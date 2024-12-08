import { Injectable } from '@angular/core';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';

export type MemberSelection = Set<number>;

export type ElementSelection = {
  selectedJoint?: number;
  selectedMembers: MemberSelection;
  anchorJoint?: Joint;
};

/** Container for the drafting panel's element selection and hot element. */
@Injectable({providedIn: 'root'})
export class ElementSelectionService {
  public readonly elementSelection: ElementSelection = { selectedMembers: new Set<number> };

  public isJointSelected(joint: Joint): boolean {
    return joint.index === this.elementSelection.selectedJoint;
  }

  public isMemberSelected(member: Member): boolean {
    return this.elementSelection.selectedMembers.has(member.index);
  }
}
