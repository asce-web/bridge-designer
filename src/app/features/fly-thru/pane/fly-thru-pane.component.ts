import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  ViewChild,
} from '@angular/core';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { Utility } from '../../../shared/classes/utility';
import { RendererService } from '../rendering/renderer.service';
import { AnimatorService } from '../rendering/animator.service';

@Component({
  selector: 'fly-thru-pane',
  imports: [],
  templateUrl: './fly-thru-pane.component.html',
  styleUrl: './fly-thru-pane.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyThruPaneComponent implements AfterViewInit {
  @HostBinding('style.display') display: string = 'none';
  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('flyThruCanvas') flyThruCanvas!: ElementRef<HTMLCanvasElement>;

  width: number = screen.availWidth * devicePixelRatio;
  height: number = screen.availHeight * devicePixelRatio;

  constructor(
    private readonly animatorService: AnimatorService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly eventBrokerService: EventBrokerService,
    private readonly rendererService: RendererService,
  ) { }

  public set isVisible(value: boolean) {
    this.display = value ? 'block' : 'none';
    this.changeDetector.detectChanges();
    if (value) {
      this.handleResize();
      this.rendererService.setDefaultView();
      this.animatorService.start();
    } else {
      this.animatorService.stop();
    }
  }

  private handleResize(): void {
    const parent = Utility.assertNotNull(this.flyThruCanvas.nativeElement.parentElement);
    const width = parent.clientWidth * devicePixelRatio;
    const height = parent.clientHeight * devicePixelRatio;
    this.rendererService.setViewport(0, this.height - height, width, height);
  }

  ngAfterViewInit(): void {
    new ResizeObserver(() => this.handleResize()).observe(this.wrapper.nativeElement);
    const gl = Utility.assertNotNull(this.flyThruCanvas.nativeElement.getContext('webgl2'));
    this.rendererService.initialize(gl);
    this.eventBrokerService.uiModeRequest.subscribe(eventInfo => {
      this.isVisible = eventInfo.data === 'animation';
    });
  }
}
