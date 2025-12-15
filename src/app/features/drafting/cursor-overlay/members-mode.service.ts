/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { EventEmitter, Injectable } from '@angular/core';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';
import { BridgeService } from '../../../shared/services/bridge.service';
import { InventorySelectionService } from '../../../shared/services/inventory-selection.service';
import { HotElementService } from '../shared/hot-element.service';
import { MemberCursorService } from '../shared/member-cursor.service';
import { Utility } from '../../../shared/classes/utility';
import { HotElementDragService } from '../shared/hot-element-drag.service';
import { GuideKnob } from '../shared/guides.service';
import { Labels } from '../shared/labels.service';

@Injectable({ providedIn: 'root' })
export class MembersModeService {
  private _ctx: CanvasRenderingContext2D | undefined;
  private addMemberRequest: EventEmitter<Member> | undefined;
  private readonly existingMemberJointIndices = new Set<number>();

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly hotElementDragService: HotElementDragService,
    private readonly hotElementService: HotElementService,
    private readonly inventorySelectionService: InventorySelectionService,
    private readonly memberCursorService: MemberCursorService,
  ) {}

  public initialize(ctx: CanvasRenderingContext2D, addMemberRequest: EventEmitter<Member>): MembersModeService {
    this._ctx = ctx;
    this.addMemberRequest = addMemberRequest;
    return this;
  }

  private get ctx(): CanvasRenderingContext2D {
    return Utility.assertNotUndefined(this._ctx);
  }

  handlePointerDown(event: PointerEvent): void {
    if (event.buttons !== 1 << 0 || this.hotElementDragService.isDragging()) {
      return;
    }
    const hotElement = this.hotElementService.hotElement;
    if (hotElement instanceof Joint) {
      this.existingMemberJointIndices.clear();
      this.bridgeService
        .findConnectedJoints(hotElement)
        .forEach(joint => this.existingMemberJointIndices.add(joint.index));
      this.memberCursorService.start(this.ctx, event.offsetX, event.offsetY, hotElement);
    }
  }

  handlePointerMove(event: PointerEvent): void {
    if (this.hotElementDragService.isDragging()) {
      return;
    }
    this.hotElementService.updateRenderedHotElement(this.ctx, event.offsetX, event.offsetY, {
      considerOnly: [Joint, GuideKnob, Labels],
      excludedJointIndices: this.existingMemberJointIndices,
    });
    this.memberCursorService.update(event.offsetX, event.offsetY, this.hotElementService.hotElement);
  }

  handlePointerUp(event: PointerEvent): void {
    if (event.button !== 0 || this.hotElementDragService.isDragging(event)) {
      return;
    }
    const anchor = this.memberCursorService.end();
    if (!anchor) {
      return;
    }
    this.existingMemberJointIndices.clear();
    const hotElement = this.hotElementService.hotElement;
    if (anchor === hotElement || !(hotElement instanceof Joint)) {
      return;
    }
    const material = this.inventorySelectionService.material;
    const shape = this.inventorySelectionService.shape;
    if (!material || !shape) {
      throw new Error('No material selected for new member');
    }
    this.addMemberRequest?.emit(new Member(-1, anchor, hotElement, material, shape));
    this.hotElementService.invalidate(this.ctx);
  }
}
