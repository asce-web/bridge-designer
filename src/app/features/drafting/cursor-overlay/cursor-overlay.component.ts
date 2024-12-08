import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, numberAttribute, Output, ViewChild } from '@angular/core';
import { ViewportTransform2D } from '../../../shared/services/viewport-transform.service';
import { MouseEventDelegator } from './mouse-handler';
import { CoordinateService } from '../services/coordinate.service';
import { Point2D } from '../../../shared/classes/graphics';
import { Joint } from '../../../shared/classes/joint.model';
import { Member } from '../../../shared/classes/member.model';
import { ElementSelectionService } from '../services/element-selection.service';
import { EventBrokerService, EventInfo } from '../../../shared/services/event-broker.service';
import { HotElementService } from '../services/hot-element.service';
import { ReticleCursorService } from '../services/reticle-cursor.service';
import { MemberCursorService } from '../services/member-cursor.service';
import { InventorySelectionService } from '../../../shared/services/inventory-selection.service';

const enum StandardCursor {
  ARROW = 'default',
  AUTO = 'auto',
  HAND = 'pointer',
  HORIZONTAL_MOVE = 'ew-resize',
  MOVE = 'move',
  VERTICAL_MOVE = 'ns-resize',
}

@Component({
  selector: 'cursor-overlay',
  standalone: true,
  templateUrl: './cursor-overlay.component.html',
  styleUrl: './cursor-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CursorOverlayComponent implements AfterViewInit {
  @Input({ transform: numberAttribute }) width: number = screen.availWidth;
  @Input({ transform: numberAttribute }) height: number = screen.availHeight;

  @Output() addJointRequest = new EventEmitter<Joint>();
  @Output() addMemberRequest = new EventEmitter<Member>();

  @ViewChild('cursorLayer') cursorLayer!: ElementRef<HTMLCanvasElement>;

  private readonly mouseEventDelegator: MouseEventDelegator = new MouseEventDelegator();

  constructor(
    private readonly elementSelectionService: ElementSelectionService,
    private readonly hotElementService: HotElementService,
    private readonly coordinateService: CoordinateService,
    private readonly viewportTransform: ViewportTransform2D,
    private readonly eventBrokerService: EventBrokerService,
    private readonly reticleCursorService: ReticleCursorService,
    private readonly memberCursorService: MemberCursorService,
    private readonly inventorySelectionService: InventorySelectionService,
  ) { }

  get canvas(): HTMLCanvasElement {
    return this.cursorLayer.nativeElement;
  }

  get ctx(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Get canvas 2d context failed');
    }
    return ctx;
  }

  public setSelectMode(): void {
    this.reticleCursorService.clear(this.ctx);
    this.setMouseCursor(StandardCursor.ARROW);
  }

  public setJointsMode(): void {
    this.hotElementService.clearRenderedHotElement(this.ctx);
    this.setMouseCursor();
    this.mouseEventDelegator.handlerSet =
      new JointsModeMouseHandler(
        this.ctx,
        this.reticleCursorService,
        this.coordinateService,
        this.viewportTransform,
        this.addJointRequest,
      );
  }

  public setMembersMode(): void {
    this.reticleCursorService.clear(this.ctx);
    this.setMouseCursor('img/pencil.png', 0, 31);
    this.mouseEventDelegator.handlerSet =
      new MembersModeMouseHandler(
        this.hotElementService, 
        this.ctx, 
        this.memberCursorService, 
        this.inventorySelectionService, 
        this.addMemberRequest);
  }

  public setEraseMode(): void {
    this.reticleCursorService.clear(this.ctx);
    this.setMouseCursor('img/pencilud.png', 2, 29);
  }

  setMouseCursor(cursor?: string | StandardCursor, orgX: number = 0, orgY: number = 0): void {
    if (cursor === undefined) {
      this.ctx.canvas.style.cursor = 'none';
      return;
    }
    this.ctx.canvas.style.cursor = cursor.startsWith('img/')
      ? `url(${cursor}) ${orgX} ${orgY}, auto`
      : cursor;
  }

  private setCursorModeByControlSelectedIndex(i: number) {
    switch (i) {
      case 0: this.setJointsMode(); break;
      case 1: this.setMembersMode(); break;
      case 2: this.setSelectMode(); break;
      case 3: this.setEraseMode(); break;
    }
  }

  ngAfterViewInit(): void {
    this.mouseEventDelegator.register(this.canvas);
    this.setJointsMode();
    this.eventBrokerService.selectEditMode.subscribe((eventInfo: EventInfo) =>
      this.setCursorModeByControlSelectedIndex(eventInfo.data as number));
  }
}

class JointsModeMouseHandler {
  // Prospective joint location in various coordinate systems.
  private readonly locationWorld: Point2D = new Point2D();
  private readonly locationGrid: Point2D = new Point2D();
  private readonly locationViewport: Point2D = new Point2D();

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly reticleCursorService: ReticleCursorService,
    private readonly coordinateService: CoordinateService,
    private readonly viewportTransform: ViewportTransform2D,
    private readonly addJointRequest: EventEmitter<Joint>,
  ) { }

  /** Update other location fields from the viewport location. */
  private snapFromViewport(): void {
    this.viewportTransform.viewportToWorldPoint(this.locationWorld, this.locationViewport);
    this.coordinateService.shiftToNearestValidWorldPoint(this.locationWorld, this.locationGrid, this.locationWorld);
    this.viewportTransform.worldToViewportPoint(this.locationViewport, this.locationWorld);
  }

  private showReticle(): void {
    this.reticleCursorService.locate(this.locationViewport.x, this.locationViewport.y).show(this.ctx);
  }

  private clearReticle(): void {
    this.reticleCursorService.clear(this.ctx);
  }

  handleMouseEnter(event: MouseEvent): void {
    this.locationViewport.set(event.offsetX, event.offsetY);
    this.snapFromViewport();
    this.showReticle();
  }

  handleMouseLeave(_event: MouseEvent): void {
    this.clearReticle();
  }

  handleMouseMove(event: MouseEvent): void {
    this.locationViewport.set(event.offsetX, event.offsetY);
    this.snapFromViewport();
    this.reticleCursorService.clear(this.ctx);
    this.showReticle();
  }

  handleMouseUp(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }
    const x = this.viewportTransform.viewportToworldX(this.reticleCursorService.x);
    const y = this.viewportTransform.viewportToworldY(this.reticleCursorService.y);
    // Adding the joint sets the index correctly.
    this.addJointRequest.emit(new Joint(-1, x, y, false));
  }
}

class MembersModeMouseHandler {
  constructor(
    private readonly hotElementService: HotElementService,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly memberCursorService: MemberCursorService,
    private readonly inventorySelectionService: InventorySelectionService,
    private readonly addMemberRequest: EventEmitter<Member>,
  ) { }

  handleMouseDown(event: MouseEvent): void {
    if (event.buttons === (1 << 0)) {  // Left button down alone to start.
      const hotElement = this.hotElementService.hotElement;
      if (hotElement instanceof Joint) {
        this.memberCursorService.start(this.ctx, event.offsetX, event.offsetY, hotElement);
      }
    }
  }

  handleMouseMove(event: MouseEvent): void {
    this.hotElementService.updateRenderedHotElementForViewportPoint(this.ctx, event.offsetX, event.offsetY, [Joint]);
    this.memberCursorService.update(event.offsetX, event.offsetY, this.hotElementService.hotElement);
  }

  handleMouseUp(event: MouseEvent): void {
    if (event.button !== 0) {  // Left up to end.
      return;
    }
    const anchor = this.memberCursorService.end();
    const hotElement = this.hotElementService.hotElement;
    if (!anchor || anchor === hotElement || !(hotElement instanceof Joint)) {
      return;
    }
    this.addMemberRequest.emit(new Member(-1, anchor, hotElement, this.inventorySelectionService.material, this.inventorySelectionService.shape));
  }
}
