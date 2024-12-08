import { BridgeModel } from "../../../shared/classes/bridge.model";
import { EditableUtility, EditCommand } from "../../../shared/classes/editing";
import { Geometry } from "../../../shared/classes/graphics";
import { Joint } from "../../../shared/classes/joint.model";
import { Member } from "../../../shared/classes/member.model";

export class AddMemberCommand extends EditCommand {
  private members: Member[] = [];

  constructor(member: Member, bridge: BridgeModel) {
    super(`Add member between joints ${member.a.number} and ${member.b.number}`, bridge);
    const transecting = bridge.joints.filter(joint => Geometry.isPointOnSegment(joint, member.a, member.b))
      .sort((x, y) => Geometry.distanceSquared2DPoints(x, member.a) - Geometry.distanceSquared2DPoints(y, member.a));
    // Handle the most common case without copying.
    if (transecting.length === 0) {
      this.members.push(member);
      return;
    }
    var a: Joint = member.a;
    transecting.forEach(b => {
      if (!bridge.members.some(member => member.hasJoints(a, b))) {
        this.members.push(new Member(-1, a, b, member.material, member.shape));
      }
      a = b;
    });
    this.members.push(new Member(-1, a, member.b, member.material, member.shape));
  }

  public override do(): void {
    const bridge = this.context as BridgeModel;
    this.members.forEach((member, index) => member.index = index + bridge.members.length);
    EditableUtility.merge(bridge.members, this.members);
  }

  public override undo(): void {
    const bridge = this.context as BridgeModel;
    EditableUtility.remove(bridge.members, this.members);
  }
}
