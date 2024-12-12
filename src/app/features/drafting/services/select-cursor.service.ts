import { Injectable } from '@angular/core';
import { Rectangle2D } from '../../../shared/classes/graphics';

@Injectable({ providedIn: 'root' })
export class SelectCursorService {
  private readonly cursor: Rectangle2D = Rectangle2D.createEmpty();
  private ctx?: CanvasRenderingContext2D;
  private isAnchored: boolean = false;

  constructor() { }

  public start(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.cursor.x = x;
    this.cursor.y = y;
    this.cursor.width = this.cursor.height = 0;
    this.ctx = ctx;
    this.show();
    this.isAnchored = true;
  }

  public update(x: number, y: number): void {
    if (!this.isAnchored) {
      return;
    }
    this.erase();
    this.cursor.width = x - this.cursor.x;
    this.cursor.height = y - this.cursor.y;
    this.show();
  }

  public end(x: number, y: number, selected: Rectangle2D): Rectangle2D {
    if (!this.isAnchored) {
      return selected;
    }
    this.erase();
    this.cursor.width = x - this.cursor.x;
    this.cursor.height = y - this.cursor.y;
    this.isAnchored = false;
    return selected;
  }

  private show() {
    const ctx = this.ctx!;
    const savedStrokeStyle = ctx.strokeStyle;
    const savedLineDash = ctx.getLineDash();

    ctx.strokeStyle = 'blue';
    ctx.setLineDash(this.cursor.width >= 0 ? [] : [4, 4]);

    ctx.beginPath();
    ctx.rect(this.cursor.x, this.cursor.y, this.cursor.width, this.cursor.height);
    ctx.stroke();

    ctx.setLineDash(savedLineDash);
    ctx.strokeStyle = savedStrokeStyle;
  }

  private readonly cleared = Rectangle2D.createEmpty();

  private erase() {
    this.cursor.copyTo(this.cleared).pad(1, 1);
    this.ctx?.clearRect(this.cleared.x, this.cleared.y, this.cleared.width, this.cleared.height);
  }
}
