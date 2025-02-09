import { Injectable } from '@angular/core';
import { BridgeService } from '../../../shared/services/bridge.service';
import {
  BridgeCostModel,
  MaterialSectionWeight,
  SizeMaterialSectionCount,
} from '../../../shared/classes/bridge-cost.model';
import { TreeMap } from '../../../shared/core/tree-map';

/**
 * Container for logic that tabulates bridge cost information.
 * Note fixed costs are tabulated in DesignConditions and used here.
 */
@Injectable({ providedIn: 'root' })
export class BridgeCostService {
  constructor(private readonly bridgeService: BridgeService) {}

  createBridgeCostModel(): BridgeCostModel {
    const bridge = this.bridgeService.bridge;
    const weightByMaterialAndSection = new TreeMap<string, MaterialSectionWeight>(
      (a, b) => a.localeCompare(b),
      o => o.name,
    );
    const countBySizeMaterialAndSection = new TreeMap<string, SizeMaterialSectionCount>(
      (a, b) => a.localeCompare(b),
      o => o.name,
    );
    for (const member of bridge.members) {
      const newWeightTableRow = new MaterialSectionWeight(member.material, member.shape.section);
      const weightTableRow = weightByMaterialAndSection.insert(newWeightTableRow) || newWeightTableRow;
      weightTableRow.memberKg += member.length * member.shape.area * member.material.density;

      const newCountTableRow =  new SizeMaterialSectionCount(member.shape, member.material);
      const countTableRow = countBySizeMaterialAndSection.insert(newCountTableRow) || newCountTableRow;
      countTableRow.count++;
    }
    return new BridgeCostModel(weightByMaterialAndSection, countBySizeMaterialAndSection, bridge.joints.length);
  }
}
