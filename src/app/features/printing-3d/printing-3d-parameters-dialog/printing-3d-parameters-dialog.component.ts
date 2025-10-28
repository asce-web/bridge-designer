import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { FormsModule } from '@angular/forms';
import { jqxNumberInputComponent, jqxNumberInputModule } from 'jqwidgets-ng/jqxnumberinput';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';

@Component({
  selector: 'printing-3d-parameters-dialog',
  imports: [jqxWindowModule, jqxButtonModule, FormsModule, jqxNumberInputModule],
  templateUrl: './printing-3d-parameters-dialog.component.html',
  styleUrl: './printing-3d-parameters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Printing3dParametersDialogComponent {
  fileName: string = 'MyBridge.obj';
  /*
  Front truss
  Rear truss
  Pins
  Deck panels
  Left abutment
  Right abutment
  Left anchorages
  Right anchorages
  Pier
  */

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('bedSizeInput') bedSizeInput!: jqxNumberInputComponent;
  @ViewChild('minFeatureSizeInput') minFeatureSizeInput!: jqxNumberInputComponent;

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  handleHelpButtonClick() {
    this.eventBrokerService.helpRequest.next({ origin: EventOrigin.PRINTING_3D_DIALOG, data: { topic: 'hlp_3d_printing' } });
  }

  handleOkButtonClick() {}
}
