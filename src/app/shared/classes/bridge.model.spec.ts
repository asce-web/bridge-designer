/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { BridgeModel } from './bridge.model';
import { DesignConditionsService } from '../services/design-conditions.service';
import { Joint } from './joint.model';
import { Member } from './member.model';
import { InventoryService } from '../services/inventory.service';

describe('BridgeModel', () => {
  const inventoryService = new InventoryService();

  describe('createClone', () => {
    it('should create a clone of the bridge model', () => {
      const originalBridge = new BridgeModel(DesignConditionsService.PLACEHOLDER_CONDITIONS);
      originalBridge.projectName = 'Original Bridge';
      originalBridge.projectId = '123';
      originalBridge.designedBy = 'Engineer';
      originalBridge.iterationNumber = 2;
      // Index of first non-prescribed joint.
      const j0 = originalBridge.joints.length;
      originalBridge.joints.push(new Joint(j0, 6, 7, false));
      originalBridge.joints.push(new Joint(j0 + 1, 8, 9, false));
      originalBridge.joints.push(new Joint(j0 + 2, 4, 5, false));
      const material = inventoryService.materials[0];
      const shape = inventoryService.getShape(0, 0);
      originalBridge.members.push(new Member(0, originalBridge.joints[j0 + 0], originalBridge.joints[j0 + 1], material, shape));
      originalBridge.members.push(new Member(1, originalBridge.joints[j0 + 1], originalBridge.joints[j0 + 2], material, shape));
      originalBridge.members.push(new Member(2, originalBridge.joints[j0 + 2], originalBridge.joints[j0 + 0], material, shape));

      const clonedBridge = BridgeModel.createClone(originalBridge);

      expect(clonedBridge.projectName).toBe(originalBridge.projectName);
      expect(clonedBridge.projectId).toBe(originalBridge.projectId);
      expect(clonedBridge.designedBy).toBe(originalBridge.designedBy);
      expect(clonedBridge.iterationNumber).toBe(originalBridge.iterationNumber);
      expect(clonedBridge.joints.length).toBe(originalBridge.joints.length);
      expect(clonedBridge.members.length).toBe(originalBridge.members.length);
      // Verify each clone member's joints refer to the clone.
      for (const member of clonedBridge.members) {
        expect(clonedBridge.joints.findIndex(joint => joint === member.a)).toBe(member.a.index);
        expect(clonedBridge.joints.findIndex(joint => joint === member.b)).toBe(member.b.index);
      }
      // Verify each original member's non-prescribed joints do not refer to the clone.
      for (const member of clonedBridge.members) {
        expect(originalBridge.joints.findIndex(joint => joint === member.a)).toBe(-1);
        expect(originalBridge.joints.findIndex(joint => joint === member.b)).toBe(-1);
      }
    });
  });
});