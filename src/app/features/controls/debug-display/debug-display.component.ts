import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { EventBrokerService } from '../../../shared/services/event-broker.service';

@Component({
  selector: 'debug-display',
  templateUrl: './debug-display.component.html',
  styleUrl: './debug-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugDisplayComponent implements AfterViewInit {
  constructor(
    private readonly eventBrokerService: EventBrokerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  text: string = '';
  eraseTimeout: any;

  ngAfterViewInit(): void {
    this.eventBrokerService.displayDebugTextRequest.subscribe(eventInfo => {
      this.text = eventInfo.data;
      this.changeDetectorRef.detectChanges();
      clearTimeout(this.eraseTimeout);
      this.eraseTimeout = setTimeout(() => {
        this.text = '';
        this.changeDetectorRef.detectChanges();
      }, 2000);
    });
  }
}
