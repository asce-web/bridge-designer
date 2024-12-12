import { BridgeModel } from '../../../shared/classes/bridge.model';
import { EditableUtility, EditCommand } from '../../../shared/classes/editing';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';
import { DesignBridgeService } from '../../../shared/services/design-bridge.service';
import {
  ElementSelection,
  SelectableBridge,
} from '../../drafting/services/element-selection.service';

export class DeleteMembersCommand extends EditCommand {
  private constructor(
    private readonly members: Member[],
    private readonly joints: Joint[],
    selectableBridge: SelectableBridge
  ) {
    const description =
      members.length == 1
        ? `Delete member, joint ${members[0].a.number} to ${members[0].b.number}`
        : `Delete ${members.length} members`;
    super(description, selectableBridge);
  }

  public static forMember(
    member: Member,
    bridge: BridgeModel,
    elementSelection: ElementSelection
  ): DeleteMembersCommand {
    return new DeleteMembersCommand([member], [], { bridge, elementSelection });
  }

  public static forSelectedMembers(
    bridge: BridgeModel,
    elementSelection: ElementSelection,
    designBridgeService: DesignBridgeService
  ): DeleteMembersCommand {
    const members = Array.from(elementSelection.selectedMembers)
      .sort()
      .map((i) => bridge.members[i]);
    const joints = designBridgeService.getJointsForMembersDeletion(
      elementSelection.selectedMembers
    );
    return new DeleteMembersCommand(members, joints, {
      bridge,
      elementSelection,
    });
  }

  public override do(): void {
    const { bridge, elementSelection }: SelectableBridge = this.context;
    EditableUtility.remove(
      bridge.members,
      this.members,
      elementSelection.selectedMembers
    );
    EditableUtility.remove(
      bridge.joints,
      this.joints,
      elementSelection.selectedJoints
    );
  }

  public override undo(): void {
    const { bridge, elementSelection }: SelectableBridge = this.context;
    EditableUtility.merge(
      bridge.joints,
      this.joints,
      elementSelection.selectedJoints
    );
    EditableUtility.merge(
      bridge.members,
      this.members,
      elementSelection.selectedMembers
    );
  }
}
