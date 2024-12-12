import { Injectable } from '@angular/core';
import { DesignBridgeRenderingService } from './design-bridge-rendering.service';
import { DesignSiteRenderingService } from './design-site-rendering.service';

@Injectable({ providedIn: 'root' })
export class DesignRenderingService {
  constructor(
    private readonly siteRenderingService: DesignSiteRenderingService,
    private readonly designBridgeRenderingService: DesignBridgeRenderingService
  ) {}

  public render(ctx: CanvasRenderingContext2D): void {
    DesignRenderingService.clearCanvas(ctx);
    this.siteRenderingService.render(ctx);
    this.designBridgeRenderingService.renderDesignBridge(ctx);
  }

  private static clearCanvas(ctx: CanvasRenderingContext2D) {
    const savedTransform = ctx.getTransform();
    ctx.resetTransform();
    ctx.clearRect(0, 0, ctx.canvas.width - 1, ctx.canvas.height - 1);
    ctx.setTransform(savedTransform);
  }
}
