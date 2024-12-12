import { BridgeModel } from '../../../shared/classes/bridge.model';
import { EditableUtility, EditCommand } from '../../../shared/classes/editing';
import { Joint } from '../../../shared/classes/joint.model';
import {
  ElementSelection,
  SelectableBridge,
} from '../../drafting/services/element-selection.service';
import { MemberSplitter } from './member-splitter';

export class AddJointCommand extends EditCommand {
  private memberSplitter?: MemberSplitter;

  constructor(
    private readonly joint: Joint,
    bridge: BridgeModel,
    elementSelection: ElementSelection
  ) {
    super(`Add joint at (${joint.x}, ${joint.y})`, {
      bridge,
      elementSelection,
    });
  }

  public override do(): void {
    const { bridge, elementSelection }: SelectableBridge = this.context;
    this.joint.index = bridge.joints.length; // Append.
    EditableUtility.merge(
      bridge.joints,
      [this.joint],
      elementSelection.selectedJoints
    );
    this.memberSplitter ||= new MemberSplitter(
      this.joint,
      this.joint,
      bridge.members
    );
    this.memberSplitter.do(bridge.members, elementSelection.selectedMembers);
  }

  public override undo(): void {
    const { bridge, elementSelection }: SelectableBridge = this.context;
    if (!this.memberSplitter) {
      throw new Error('undo add joint before do');
    }
    this.memberSplitter.undo(bridge.members, elementSelection.selectedMembers);
    EditableUtility.remove(
      bridge.joints,
      [this.joint],
      elementSelection.selectedJoints
    );
  }
}
