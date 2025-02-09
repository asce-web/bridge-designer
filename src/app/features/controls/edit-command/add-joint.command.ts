import { BridgeModel } from '../../../shared/classes/bridge.model';
import { EditableUtility, EditCommand, EditEffect } from '../../../shared/classes/editing';
import { Joint } from '../../../shared/classes/joint.model';
import { SelectedElements } from '../../drafting/shared/selected-elements-service';
import { MemberSplitter } from './member-splitter';

export class AddJointCommand extends EditCommand {
  private memberSplitter?: MemberSplitter;

  constructor(
    private readonly joint: Joint,
    private readonly bridge: BridgeModel,
    private readonly selectedElements: SelectedElements,
  ) {
    super(`Add joint at (${joint.x}, ${joint.y})`);
  }

  /** Returns what's affected by this command. Valid only after do(). */
  override get effectsMask(): number {
    return this.memberSplitter?.hasSplit ? (EditEffect.MEMBERS | EditEffect.JOINTS) : EditEffect.JOINTS;
  }

  // TODO: Handle too many joints.
  public override do(): void {
    this.joint.index = this.bridge.joints.length; // Append.
    EditableUtility.merge(this.bridge.joints, [this.joint], this.selectedElements.selectedJoints);
    this.memberSplitter ||= new MemberSplitter(
      this.joint,
      this.bridge.members,
      this.selectedElements.selectedMembers,
    );
    this.memberSplitter.do();
  }

  public override undo(): void {
    this.memberSplitter!.undo();
    EditableUtility.remove(this.bridge.joints, [this.joint], this.selectedElements.selectedJoints);
  }
}
