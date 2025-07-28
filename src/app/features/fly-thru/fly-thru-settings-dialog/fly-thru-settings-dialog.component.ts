import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { jqxSliderModule } from 'jqwidgets-ng/jqxslider';
import { jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';

@Component({
  selector: 'fly-thru-settings-dialog',
  imports: [jqxCheckBoxModule, jqxSliderModule, jqxWindowModule, jqxExpanderModule],
  templateUrl: './fly-thru-settings-dialog.component.html',
  styleUrl: './fly-thru-settings-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlyThruSettingsDialogComponent {
  @ViewChild('dialog') dialog!: jqxWindowComponent;

  checkboxWidth: number = 120;
  checkboxHeight: number = 20;

  constructor(_eventBrokerService: EventBrokerService) {}
}
