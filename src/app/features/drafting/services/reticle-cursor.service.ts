import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ReticleCursorService {
  private static readonly TARGET_RADIUS = 8.5;
  public x: number = 0;
  public y: number = 0;

  locate(x: number, y: number): ReticleCursorService {
    this.x = x;
    this.y = y;
    return this;
  }

  show(ctx: CanvasRenderingContext2D): ReticleCursorService {
    const savedStrokeStyle = ctx.strokeStyle;

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, ReticleCursorService.TARGET_RADIUS, 0, 2 * Math.PI, true); // circle
    ctx.moveTo(0, this.y);
    ctx.lineTo(ctx.canvas.width - 1, this.y);
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, ctx.canvas.height - 1);
    ctx.stroke();

    ctx.strokeStyle = savedStrokeStyle;
    return this;
  }

  clear(ctx: CanvasRenderingContext2D): ReticleCursorService {
    ctx.clearRect(0, this.y - ReticleCursorService.TARGET_RADIUS, ctx.canvas.width, 2 * ReticleCursorService.TARGET_RADIUS);
    ctx.clearRect(this.x - ReticleCursorService.TARGET_RADIUS, 0, 2 * ReticleCursorService.TARGET_RADIUS, ctx.canvas.height);
    return this;
  }
}
