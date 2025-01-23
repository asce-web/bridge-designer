import { EventEmitter, Injectable } from '@angular/core';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';
import { HotElementService } from '../services/hot-element.service';

@Injectable({ providedIn: 'root' })
export class EraseModeService {
  private _ctx: CanvasRenderingContext2D | undefined;
  private deleteRequest: EventEmitter<Joint | Member> | undefined;

  constructor(private readonly hotElementService: HotElementService) {}

  public initialize(ctx: CanvasRenderingContext2D, deleteRequest: EventEmitter<Joint | Member>): EraseModeService {
    this._ctx = ctx;
    this.deleteRequest = deleteRequest;
    return this;
  }
  private get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) {
      throw new Error('Joint mode service not initialized');
    }
    return this._ctx;
  }

  handleMouseDown(_event: MouseEvent): void {
    const hotElement = this.hotElementService.hotElement;
    this.hotElementService.clearRenderedHotElement(this.ctx);
    if (hotElement instanceof Joint || hotElement instanceof Member) {
      this.deleteRequest?.emit(hotElement);
    }
  }

  handleMouseMove(event: MouseEvent): void {
    this.hotElementService.updateRenderedHotElement(this.ctx, event.offsetX, event.offsetY, {
      excludeFixedJoints: true,
    });
  }
}
