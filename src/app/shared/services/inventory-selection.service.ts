/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { EventBrokerService, EventInfo, EventOrigin } from './event-broker.service';
import { CrossSection, InventoryService, Material, Shape, StockId } from './inventory.service';

/** Injectable mirror of the state of the toolbar and member edit material selectors. */
@Injectable({ providedIn: 'root' })
export class InventorySelectionService {
  private _material: Material | undefined;
  private _crossSection: CrossSection | undefined;
  private _shape: Shape | undefined;

  constructor(inventoryService: InventoryService, eventBrokerService: EventBrokerService) {
    this._material = inventoryService.materials[0];
    this._crossSection = inventoryService.crossSections[0];
    this._shape = inventoryService.getShape(0, 22);
    const that = this;
    const updateState = (eventInfo: EventInfo): boolean => {
      const stockId = eventInfo.data as StockId;
      // Array references return undefined for indices oob.
      const material = inventoryService.materials[stockId.materialIndex];
      const crossSection = inventoryService.crossSections[stockId.sectionIndex];
      const shape = inventoryService.getShape(stockId.sectionIndex, stockId.sizeIndex);
      if (material === that._material && crossSection === that._crossSection && shape === that._shape) {
        return false;
      }
      that._material = material;
      that._crossSection = crossSection;
      that._shape = shape;
      return true;
    };
    eventBrokerService.inventorySelectionChange.subscribe(eventInfo => {
      if (updateState(eventInfo)) {
        // The completion event should cause updates to selected members.
        eventBrokerService.inventorySelectionCompletion.next({
          origin: EventOrigin.SERVICE,
          data: {
            material: that._material,
            crossSection: that._crossSection,
            shape: that._shape,
            stockId: eventInfo.data,
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
