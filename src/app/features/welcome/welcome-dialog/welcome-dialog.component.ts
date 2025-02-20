import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxRadioButtonModule, jqxRadioButtonComponent } from 'jqwidgets-ng/jqxradiobutton';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';

@Component({
  selector: 'welcome-dialog',
  standalone: true,
  imports: [jqxWindowModule, jqxButtonModule, jqxRadioButtonModule],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeDialogComponent {
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('newButton') newButton!: jqxRadioButtonComponent;
  @ViewChild('loadSampleButton') loadSampleButton!: jqxRadioButtonComponent;
  @ViewChild('openButton') openButton!: jqxRadioButtonComponent;

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  handleOkButton(): void {
    this.dialog.close();
    if (this.newButton.checked()) {
      this.eventBrokerService.newDesignRequest.next({origin: EventOrigin.WELCOME_DIALOG});
    } else if (this.loadSampleButton.checked()) {
      this.eventBrokerService.loadSampleRequest.next({origin: EventOrigin.WELCOME_DIALOG});
    } else if (this.openButton.checked()) {
      // TODO: Load saved bridge!
    }
  }
}
