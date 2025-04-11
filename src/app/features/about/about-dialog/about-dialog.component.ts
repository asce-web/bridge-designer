import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { VERSION } from '../../../shared/classes/version';

@Component({
  selector: 'about-dialog',
  imports: [jqxWindowModule, jqxButtonModule],
  templateUrl: './about-dialog.component.html',
  styleUrl: './about-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDialogComponent implements AfterViewInit {
  version: string = VERSION.toString();

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  @ViewChild('dialog') dialog!: jqxWindowComponent;

  handlePurposeButtonClick(): void {
    this.eventBrokerService.helpRequest.next({ origin: EventOrigin.ABOUT_DIALOG, data: { topic: 'hlp_purposes' } });
  }

  handleHowItWorksButtonClick() {
    this.eventBrokerService.helpRequest.next({
      origin: EventOrigin.ABOUT_DIALOG,
      data: { topic: 'hlp_how_wpbd_works' },
    });
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.aboutRequest.subscribe(_eventInfo => this.dialog.open());
  }
}
