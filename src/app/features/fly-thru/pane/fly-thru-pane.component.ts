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
  @ViewChild('flyThruCanvas') flyThruCanvas!: ElementRef<HTMLCanvasElement>;

  width: number = screen.availWidth;
  height: number = screen.availHeight;

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
      this.rendererService.setDefaultView();
      this.animatorService.start();
    } else {
      this.animatorService.stop();
    }
  }

  ngAfterViewInit(): void {
    this.rendererService.gl = Utility.assertNotNull(this.flyThruCanvas.nativeElement.getContext('webgl2'));
    this.eventBrokerService.uiModeRequest.subscribe(eventInfo => {
      this.isVisible = eventInfo.data === 'animation';
    });
  }
}
