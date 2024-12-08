import { BridgeModel } from "../../../shared/classes/bridge.model";
import { EditableUtility, EditCommand } from "../../../shared/classes/editing";
import { Joint } from "../../../shared/classes/joint.model";
import { MemberSplitter } from "./member-splitter";

export class AddJointCommand extends EditCommand {
  private memberSplitter?: MemberSplitter;

  constructor(private readonly joint: Joint, bridge: BridgeModel) {
    super(`Add joint at (${joint.x}, ${joint.y})`, bridge);
  }
  
  public override do(): void {
    const bridge = this.context as BridgeModel;
    this.joint.index = bridge.joints.length; // Append.
    EditableUtility.merge(bridge.joints, [this.joint]);
    this.memberSplitter ||= new MemberSplitter(this.joint, this.joint, bridge.members);
    this.memberSplitter.do(bridge.members);
  }

  public override undo(): void {
    const bridge = this.context as BridgeModel;
    if (!this.memberSplitter) {
      throw new Error('undo add joint before do')
    }
    this.memberSplitter.undo(bridge.members);
    EditableUtility.remove(bridge.joints, [this.joint]);
  }
}