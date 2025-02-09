import { BridgeModel } from '../../../shared/classes/bridge.model';
import { EditCommand, EditEffect } from '../../../shared/classes/editing';
import { Point2DInterface } from '../../../shared/classes/graphics';
import { Joint } from '../../../shared/classes/joint.model';
import { SelectedElements } from '../../drafting/shared/selected-elements-service';
import { MemberSplitter } from './member-splitter';

export class MoveJointCommand extends EditCommand {
  private memberSplitter: MemberSplitter;
  private readonly toJoint: Joint;

  constructor(
    private readonly joint: Joint,
    newLocation: Point2DInterface,
    private readonly bridge: BridgeModel,
    private readonly selectedElements: SelectedElements,
  ) {
    super(`Move joint to (${newLocation.x}, ${newLocation.y})`);
    this.toJoint = new Joint(joint.index, newLocation.x, newLocation.y, false);
    this.memberSplitter= new MemberSplitter(
      this.joint,
      this.bridge.members,
      this.selectedElements.selectedMembers,
    );
  }

  override get effectsMask(): number {
    return EditEffect.JOINTS;
  }

  public override do(): void {
    this.bridge.joints[this.toJoint.index].swapContents(this.toJoint);
    this.memberSplitter.do();
  }

  public override undo(): void {
    this.memberSplitter.undo();
    this.bridge.joints[this.toJoint.index].swapContents(this.toJoint);
  }
}
