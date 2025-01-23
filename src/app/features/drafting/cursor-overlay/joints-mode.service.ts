import { EventEmitter, Injectable } from '@angular/core';
import { Joint } from '../../../shared/classes/joint.model';
import { JointCursorService } from '../services/joint-cursor.service';
import { HotElementService } from '../services/hot-element.service';
import { GuideKnob, GuidesService } from '../../guides/guides.service';
import { BridgeService } from '../../../shared/services/bridge.service';

@Injectable({ providedIn: 'root' })
export class JointsModeService {
  private _ctx: CanvasRenderingContext2D | undefined;
  private guideKnob: GuideKnob | undefined;
  private addJointRequest: EventEmitter<Joint> | undefined;

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly guideService: GuidesService,
    private readonly hotElementService: HotElementService,
    private readonly jointCursorService: JointCursorService,
  ) {}

  private get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) {
      throw new Error('Joint mode service not initialized');
    }
    return this._ctx;
  }

  public initialize(ctx: CanvasRenderingContext2D, addJointRequest: EventEmitter<Joint>): JointsModeService {
    this._ctx = ctx;
    this.addJointRequest = addJointRequest;
    return this;
  }

  handleMouseEnter(event: MouseEvent): void {
    this.jointCursorService.start(event.offsetX, event.offsetY).show(this.ctx);
  }

  handleMouseLeave(_event: MouseEvent): void {
    this.jointCursorService.clear(this.ctx);
  }

  handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    if (this.hotElementService.hotElement instanceof GuideKnob) {
      this.guideKnob = this.hotElementService.hotElement;
    }
    // Adding the joint sets the index correctly.
    const locationWorld = this.jointCursorService.locationWorld;
    if (this.bridgeService.findJointAt(locationWorld)) {
      return;
    }
    this.addJointRequest?.emit(new Joint(-1, locationWorld.x, locationWorld.y, false));
  }

  handleMouseUp(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    if (this.guideKnob) {
      this.guideService.clear(this.ctx);
      this.guideKnob = undefined;
    }
  }

  handleMouseMove(event: MouseEvent): void {
    if (this.guideKnob) {
      this.guideService.move(this.ctx, this.guideKnob, event.offsetX, event.offsetY);
      return;
    }
    this.hotElementService.updateRenderedHotElement(this.ctx, event.offsetX, event.offsetY, {
      considerOnly: [GuideKnob],
    });
    if (this.hotElementService.hotElement) {
      this.jointCursorService.clear(this.ctx);
    } else {
      this.jointCursorService.move(this.ctx, event.offsetX, event.offsetY, /* force= */ true);
    }
  }
}
