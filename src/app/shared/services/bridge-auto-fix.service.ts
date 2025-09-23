import { Injectable } from '@angular/core';
import { BridgeService } from './bridge.service';
import { Joint } from '../classes/joint.model';
import { UndoManagerService } from '../../features/drafting/shared/undo-manager.service';
import { AddMemberCommand } from '../../features/controls/edit-command/add-member.command';
import { Member } from '../classes/member.model';
import { SelectedElementsService } from '../../features/drafting/shared/selected-elements-service';
import { DeleteJointCommand } from '../../features/controls/edit-command/delete-joint.command';
import { DeleteMembersCommand } from '../../features/controls/edit-command/delete-members.command';
import { EventBrokerService, EventOrigin } from './event-broker.service';

/** Container for heuristics that try to fix common errors causing instability. */
@Injectable({ providedIn: 'root' })
export class BridgeAutoFixService {
  constructor(
    private readonly bridgeService: BridgeService,
    private readonly eventBrokerService: EventBrokerService,
    private readonly undoManagerService: UndoManagerService,
    private readonly selectedElementsService: SelectedElementsService,
  ) {}

  public autoFix(): void {
    const didAdd = this.addMissingDeckMembers();
    const didRemove = this.removeSingletons();
    if (didAdd || didRemove) {
      this.eventBrokerService.toastRequest.next({ origin: EventOrigin.SERVICE, data: 'autofixInfo' });
    }
  }

  private addMissingDeckMembers(): boolean {
    const designConditions = this.bridgeService.designConditions;
    const a = designConditions.prescribedJoints[0];
    const b = designConditions.prescribedJoints[designConditions.loadedJointCount - 1];
    const { material, shape } = this.bridgeService.getMostCommonStockId().toMaterialAndShape()!;
    try {
      const command = AddMemberCommand.create(
        new Member(-1, a, b, material, shape),
        this.bridgeService.bridge,
        this.selectedElementsService.selectedElements,
      );
      this.undoManagerService.do(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  private removeSingletons(): boolean {
    const memberCountsByJoint = new Map<Joint, number>();
    const bridge = this.bridgeService.bridge;
    const selectedElements = this.selectedElementsService.selectedElements;
    for (const joint of bridge.joints) {
      memberCountsByJoint.set(joint, 0);
    }
    for (const member of bridge.members) {
      increment(member.a);
      increment(member.b);
    }
    let removalCount = 0;
    for (const member of bridge.members) {
      if (isJoint1Connected(member.a) || isJoint1Connected(member.b)) {
        const command = DeleteMembersCommand.forMember(member, bridge, selectedElements);
        this.undoManagerService.do(command);
        increment(member.a, -1);
        increment(member.b, -1);
        removalCount++;
      }
    }
    for (const [joint, count] of memberCountsByJoint.entries()) {
      if (count === 0 && !joint.isFixed) {
        const command = new DeleteJointCommand(joint, bridge, selectedElements);
        this.undoManagerService.do(command);
        removalCount++;
      }
    }
    return removalCount > 0;

    function isJoint1Connected(joint: Joint): boolean {
      return !joint.isFixed && memberCountsByJoint.get(joint) === 1;
    }

    function increment(joint: Joint, delta: number = 1) {
      const count = memberCountsByJoint.get(joint)!;
      memberCountsByJoint.set(joint, count + delta);
    }
  }
}
