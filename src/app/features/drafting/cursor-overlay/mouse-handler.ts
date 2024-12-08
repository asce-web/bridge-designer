export type MouseHandlerSet = {
  handleMouseEnter?: (event: MouseEvent) => void;
  handleMouseLeave?: (event: MouseEvent) => void;
  handleMouseMove?: (event: MouseEvent) => void;
  handleMouseDown?: (event: MouseEvent) => void;
  handleMouseUp?: (event: MouseEvent) => void;
};

export class MouseEventDelegator {
  public handlerSet: MouseHandlerSet = {};

  public register(canvas: HTMLCanvasElement) {
    const that = this;
    canvas.addEventListener('mouseenter', (event: MouseEvent) => that.handlerSet.handleMouseEnter?.(event));
    canvas.addEventListener('mouseleave', (event: MouseEvent) => that.handlerSet.handleMouseLeave?.(event));
    canvas.addEventListener('mousemove', (event: MouseEvent) => that.handlerSet.handleMouseMove?.(event));
    canvas.addEventListener('mousedown', (event: MouseEvent) => that.handlerSet.handleMouseDown?.(event));
    canvas.addEventListener('mouseup', (event: MouseEvent) => that.handlerSet.handleMouseUp?.(event)); 
  }
}
