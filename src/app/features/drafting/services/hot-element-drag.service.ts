import { EventEmitter, Injectable } from '@angular/core';
import { HotElementService } from './hot-element.service';
import { GuideKnob, GuidesService } from '../../guides/guides.service';
import { Utility } from '../../../shared/classes/utility';

@Injectable({ providedIn: 'root' })
export class HotElementDragService {
  private _ctx: CanvasRenderingContext2D | undefined;
  private guideKnob: GuideKnob | undefined;
  private dragEndEvent: MouseEvent | null = null;
  private guidesCursorActive: EventEmitter<boolean> | undefined;
  constructor(
    private readonly guideService: GuidesService,
    private readonly hotElementService: HotElementService,
  ) {}

  public initialize(ctx: CanvasRenderingContext2D, guidesCursorActive: EventEmitter<boolean>): HotElementDragService {
    this._ctx = ctx;
    this.guidesCursorActive = guidesCursorActive;
    return this;
  }

  /** 
   * Returns whether the guide knob is being dragged. Optionally includes whether a 
   * given event was the one that just ended the drag and so has already been handled.
   * Useful in modal mouse up handlers, which are invoked after this one.
   */
  public isDragging(event?: MouseEvent): boolean {
    return this.guideKnob !== undefined || event === this.dragEndEvent;
  }

  handleMouseDown(event: MouseEvent): void {
    if (event.buttons !== 1 << 0 || !(this.hotElementService.hotElement instanceof GuideKnob)) {
      return;
    }
    this.guideKnob = this.hotElementService.hotElement;
    this.guideService.move(this.ctx, this.guideKnob, event.offsetX, event.offsetY);
    this.guidesCursorActive?.emit(true);
  }

  handleMouseMove(event: MouseEvent): void {
    this.hotElementService.updateRenderedHotElement(this.ctx, event.offsetX, event.offsetY, {
      considerOnly: [GuideKnob],
    });
    if (!this.guideKnob) {
      return;
    }
    this.guideService.move(this.ctx, this.guideKnob, event.offsetX, event.offsetY);
  }

  handleMouseUp(event: MouseEvent): void {
    if (event.button !== 0 || !this.guideKnob) {
      return;
    }
    this.dragEndEvent = event;
    this.guideKnob = undefined;
    this.guidesCursorActive?.emit(false);
    this.guideService.clear(this.ctx);
  }

  private get ctx(): CanvasRenderingContext2D {
    return Utility.assertNotUndefined(this._ctx);
  }
}
