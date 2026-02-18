/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { EventBrokerService, EventOrigin, EventInfo } from './event-broker.service';
import { CrossSection, InventoryService, Material, Shape, StockId } from './inventory.service';

/**
 * Injectable mirror of the state of the toolbar and member edit material selectors.
 * Manages message flow for cooperation of multiple selectors. There are three subjects:
 *
 * - `loadInventorySelectorRequest`: External request to load a new selection into the control.
 *   May cause both other events.
 * - `inventorySelectionChangeRequest`: Internal request that user interaction has changed the
 *   selection, allowing other instances to update themselves. May cause next event.
 * - `inventorySelectionChange`: External notification that a change has occurred. Sent after all
 *    controls are already synced. Care is taken to avoid sending redundant instances.
 *
 * The hierarchy avoids event cycles.
 */
@Injectable({ providedIn: 'root' })
export class InventorySelectionService {
  private _material: Material | undefined;
  private _crossSection: CrossSection | undefined;
  private _shape: Shape | undefined;

  constructor(inventoryService: InventoryService, eventBrokerService: EventBrokerService) {
    this._material = inventoryService.materials[0];
    this._crossSection = inventoryService.crossSections[0];
    this._shape = inventoryService.getShape(0, 22);
    const updateState = (info: EventInfo<StockId>): boolean => {
      const stockId = info.data as StockId;
      // Array references return undefined for indices oob.
      const material = inventoryService.materials[stockId.materialIndex];
      const crossSection = inventoryService.crossSections[stockId.sectionIndex];
      const shape = inventoryService.getShape(stockId.sectionIndex, stockId.sizeIndex);
      if (material === this._material && crossSection === this._crossSection && shape === this._shape) {
        return false;
      }
      this._material = material;
      this._crossSection = crossSection;
      this._shape = shape;
      return true;
    };
    eventBrokerService.inventorySelectionChangeRequest.subscribe(info => {
      if (updateState(info)) {
        eventBrokerService.inventorySelectionChange.next({
          origin: EventOrigin.SERVICE,
          data: {
            material: this._material,
            crossSection: this._crossSection,
            shape: this._shape,
            stockId: info.data,
          },
        });
      }
    });
    eventBrokerService.loadInventorySelectorRequest.subscribe(updateState);
  }

  public get material(): Material | undefined {
    return this._material;
  }

  public get crossSection(): CrossSection | undefined {
    return this._crossSection;
  }

  public get shape(): Shape | undefined {
    return this._shape;
  }

  /** Returns whether the current stock selection is completely defined. */
  public get isValid(): boolean {
    return this._material !== undefined && this._crossSection !== undefined && this._shape !== undefined;
  }
}
