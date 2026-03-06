import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ContestParametersService } from '../../../shared/services/contest-parameters.service';

@Component({
  selector: 'contest-welcome-dialog',
  imports: [ConfirmationDialogComponent],
  templateUrl: './contest-welcome-dialog.component.html',
  styleUrl: './contest-welcome-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContestWelcomeDialogComponent {

 @ViewChild('dialog') dialog!: ConfirmationDialogComponent;

  constructor(public readonly contestParametersService: ContestParametersService) {}

  public showIfContest() {
    if (this.contestParametersService.parameters.isPatched) {
      this.dialog.open();
    }
  }
}
