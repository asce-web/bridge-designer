import { Injectable } from '@angular/core';
import { BridgeModel } from '../../../shared/classes/bridge.model';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';

export type SelectedSet = Set<number>;

export type ElementSelection = {
  selectedJoints: SelectedSet,
  selectedMembers: SelectedSet,
};

export type SelectableBridge = {
  bridge: BridgeModel,
  elementSelection: ElementSelection,
};

/** Container for the drafting panel's element selection and hot element. */
@Injectable({providedIn: 'root'})
export class ElementSelectionService {
  public readonly elementSelection: ElementSelection = { 
    selectedJoints: new Set<number>(),
    selectedMembers: new Set<number>(),
  };

  public isJointSelected(joint: Joint): boolean {
    return this.elementSelection.selectedJoints.has(joint.index);
  }

  public isMemberSelected(member: Member): boolean {
    return this.elementSelection.selectedMembers.has(member.index);
  }
}
