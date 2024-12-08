import { Injectable } from '@angular/core';
import { CrossSection, InventoryService, Material, Shape, StockId } from './inventory.service';
import { EventBrokerService, EventInfo, EventOrigin } from './event-broker.service';

@Injectable({ providedIn: 'root' })
export class InventorySelectionService {
  private _material: Material;
  private _crossSection: CrossSection;
  private _shape: Shape;

  constructor(inventoryService: InventoryService, eventBrokerService: EventBrokerService) {
    this._material = inventoryService.materials[0];
    this._crossSection = inventoryService.crossSections[0];
    this._shape = inventoryService.getShape(0, 0);
    const that = this;
    const updateState = (eventInfo: EventInfo) => {
      if (eventInfo.source === EventOrigin.TOOLBAR) {
        const stockId = eventInfo.data as StockId;
        that._material = inventoryService.materials[stockId.materialIndex];
        that._crossSection = inventoryService.crossSections[stockId.sectionIndex];
        that._shape = inventoryService.getShape(stockId.sectionIndex, stockId.sizeIndex);
      };
    }
    eventBrokerService.changeInventorySelection.subscribe(updateState);
    eventBrokerService.loadInventorySelectorRequest.subscribe(updateState);
  }

  public get material(): Material {
    return this._material;
  }

  public get crossSection(): CrossSection {
    return this._crossSection;
  }

  public get shape(): Shape {
    return this._shape;
  }
}
