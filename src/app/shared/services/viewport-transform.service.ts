import { Injectable } from '@angular/core';
import { Point2D, Point2DInterface, Rectangle2D } from '../classes/graphics';

export const enum Justification {
  LEFT = -1,
  RIGHT = 1,
  TOP = -1,
  BOTTOM = 1,
  CENTER = 0,
}

/** Stateful viewport transform. Create instances as needed per component with InjectionToken. */
@Injectable({providedIn: 'root'})
export class ViewportTransform2D {
    private _xWindow = 0;
    private _yWindow = 0;
    private _widthWindow = 1;
    private _heightWindow = 1;
    private _vpTx = 0.5;
    private _vpTy = 0.5;
    private _vpX = 0.5;
    private _vpY = 0.5;
    private _xViewport = 0;
    private _yViewport = 0;
    private _zWindow = 0;
    private _widthViewport = 1;
    private _heightViewport = 1;
    private _xMargin = 0;
    private _yMargin = 0;
    private _xScaleFactor = 1;
    private _yScaleFactor = 1;
    private _zScale = 1;
    private _nWindowUpdates = 0;
    private _nViewportUpdates = 0;
    private _hAlign = Justification.CENTER;
    private _vAlign = Justification.CENTER;

  public get absWidthViewport(): number {
    return ViewportTransform2D.absRound(this._widthViewport);
  }

  public get absHeightViewport(): number {
    return ViewportTransform2D.absRound(Math.round(this._heightViewport));
  }

  public get usedWidthViewport(): number {
    return ViewportTransform2D.absRound(this._widthViewport - this._xMargin);
  }

  public get usedHeightViewport(): number {
    return ViewportTransform2D.absRound(this._heightViewport - this._yMargin);
  }

  public setAlignment(horizontal: Justification, vertical: Justification): void {
    this._hAlign = horizontal;
    this._vAlign = vertical;
    this.setScaleFactor();
  }

  public setViewport(x: number, y: number, width: number, height: number): void {
    this._xViewport = x;
    this._yViewport = y;
    this._widthViewport = width;
    this._heightViewport = height;
    this.setScaleFactor();
  }

  public setWindow(window: Rectangle2D): void {
    this._xWindow = window.x;
    this._yWindow = window.y;
    this._widthWindow = window.width;
    this._heightWindow = window.height;
    this.setScaleFactor();
  }

  public worldToViewportX(x: number): number {
    return this._xMargin + this._xViewport + (x - this._xWindow) * this._xScaleFactor;
  }

  public worldToViewportY(y: number): number {
    return this._yMargin + this._yViewport + (y - this._yWindow) * this._yScaleFactor;
  }

  public worldToViewportPoint(dst: Point2DInterface, src: Point2DInterface): void {
    dst.x = this.worldToViewportX(src.x);
    dst.y = this.worldToViewportY(src.y);
  }

  public worldToViewportDistance(d: number): number {
    return ViewportTransform2D.copySign(Math.round(d * Math.abs(this._xScaleFactor)), d);
  }

  public viewportToworldX(x: number): number {
    return this._xWindow + (x - this._xMargin - this._xViewport) / this._xScaleFactor;
  }

  public viewportToworldY(y: number): number {
    return this._yWindow + (y - this._yMargin - this._yViewport) / this._yScaleFactor;
  }

  public viewportToWorldPoint(dst: Point2DInterface, src: Point2DInterface): void {
    dst.x = this.viewportToworldX(src.x);
    dst.y = this.viewportToworldY(src.y);
  }

  public viewportToWorldDistance(d: number): number {
    return ViewportTransform2D.copySign(d / this._xScaleFactor, d);
  }

  /** Set vanishing point as a fraction/parameter of x and y viewport. Also the window z-coordinate, which governs scale. */
  public setVanishingPoint(vpTx: number, vpTy: number, zWindow: number) {
    this._vpTx = vpTx;
    this._vpTy = vpTy;
    this._zWindow = zWindow;
  }

  public set zScale(zScale: number) {
    this._zScale = zScale;
  }

  private setScaleFactor(): void {
    if (this._widthWindow == 0 || this._heightWindow == 0) {
      this._xScaleFactor = this._yScaleFactor = 1;
      return;
    }
    const sfX = this._widthViewport / this._widthWindow;
    const sfY = this._heightViewport / this._heightWindow;
    if (Math.abs(sfX) < Math.abs(sfY)) {
      this._xMargin = 0;
      this._xScaleFactor = sfX;
      this._yScaleFactor = ViewportTransform2D.copySign(sfX, sfY);
      const margin = this._heightViewport - this._heightWindow * this._yScaleFactor;
      switch (this._vAlign) {
        case Justification.BOTTOM:
          this._yMargin = 0;
          break;
        case Justification.TOP:
          this._yMargin = margin;
          break;
        case Justification.CENTER:
          this._yMargin = 0.5 * margin;
          break;
      }
    } else {
      this._yMargin = 0;
      this._yScaleFactor = sfY;
      this._xScaleFactor = ViewportTransform2D.copySign(sfY, sfX);
      const margin = this._widthViewport - this._widthWindow * this._xScaleFactor;
      switch (this._hAlign) {
        case Justification.LEFT:
          this._xMargin = 0;
          break;
        case Justification.RIGHT:
          this._xMargin = margin;
          break;
        case Justification.CENTER:
          this._xMargin = 0.5 * margin;
          break;
      }
    }
    this._vpX = this.worldToViewportX(this._xWindow + this._vpTx * this._widthWindow);
    this._vpY = this.worldToViewportY(this._yWindow + this._vpTy * this._heightWindow);
  }

  private static absRound(x: number): number {
    return Math.abs(Math.round(x));
  }

  private static copySign(x: number, signSource: number): number {
    return (x < 0 && signSource < 0) || (x >= 0 && signSource >= 0) ? x : -x;;
  }
}
