import { Injectable } from '@angular/core';
import { Joint } from '../../../shared/classes/joint.model';
import { HotElement } from './hot-element.service';
import { Rectangle2D } from '../../../shared/classes/graphics';
import { DesignJointRenderingService } from '../../../shared/services/design-joint-rendering.service';
import { ViewportTransform2D } from '../../../shared/services/viewport-transform.service';

@Injectable({providedIn: 'root'})
export class MemberCursorService {
  private _anchor: Joint | undefined;
  private anchorX: number = 0;
  private anchorY: number = 0;
  private cursorX: number = 0;
  private cursorY: number = 0;
  private ctx?: CanvasRenderingContext2D;

  constructor(
    private readonly designJointRenderingService: DesignJointRenderingService,
    private readonly viewportTransform: ViewportTransform2D,
  ) { }

  public start(ctx: CanvasRenderingContext2D, x: number, y: number, joint: Joint): void {
    this._anchor = joint;
    this.anchorX = this.viewportTransform.worldToViewportX(this._anchor.x);
    this.anchorY = this.viewportTransform.worldToViewportY(this._anchor.y);
    this.cursorX = x;
    this.cursorY = y;
    this.ctx = ctx;
    this.show(x, y, undefined);
  }

  public update(x: number, y: number, hotElement: HotElement): void {
    if (!this._anchor) {
      return;
    }
    this.erase();
    this.show(x, y, hotElement);
  }

  public end(): Joint | undefined {
    if (!this._anchor) {
      return;
    }
    this.erase();
    const anchor = this._anchor;
    this._anchor = this.ctx = undefined;
    return anchor;
  }

  private show(x: number, y: number, hotElement: HotElement): void {
    const ctx = this.ctx!;
    const savedStrokeStyle = ctx.strokeStyle;
    const savedLineDash = ctx.getLineDash();

    // Drag rubberband.
    ctx.strokeStyle = 'blue';
    ctx.setLineDash([4, 4, 16, 4]);
    if (hotElement instanceof Joint) {
      this.cursorX = this.viewportTransform.worldToViewportX(hotElement.x);
      this.cursorY = this.viewportTransform.worldToViewportY(hotElement.y);
    } else {
      this.cursorX = x;
      this.cursorY = y;
    }
    ctx.beginPath();
    ctx.moveTo(this.anchorX, this.anchorY);
    ctx.lineTo(this.cursorX, this.cursorY);
    ctx.stroke();
    // Restore joints erased when clearing rubberband.
    this.designJointRenderingService.renderHot(ctx, this._anchor!, false);
    if (hotElement instanceof Joint) {
      this.designJointRenderingService.renderHot(ctx, hotElement, false);
    }

    ctx.setLineDash(savedLineDash);
    ctx.strokeStyle = savedStrokeStyle;
  }

  private erase(): void {
    const pad = DesignJointRenderingService.JOINT_RADIUS_VIEWPORT;
    const cleared = Rectangle2D.fromDiagonal(this.anchorX, this.anchorY, this.cursorX, this.cursorY).pad(pad, pad);
    this.ctx!.clearRect(cleared.x, cleared.y, cleared.width, cleared.height);
  }
}
