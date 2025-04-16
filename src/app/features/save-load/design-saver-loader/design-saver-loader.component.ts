import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import {
  ButtonTag,
  ConfirmationDialogComponent,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SAVE_LOAD_PROVIDER_SPEC, SaveLoadService } from '../save-load.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { SaveMarkService } from '../save-mark.service';
import { InputDialogComponent } from '../../../shared/components/input-dialog/input-dialog.component';

@Component({
  selector: 'design-saver-loader',
  imports: [ConfirmationDialogComponent, InputDialogComponent],
  templateUrl: './design-saver-loader.component.html',
  styleUrl: './design-saver-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SAVE_LOAD_PROVIDER_SPEC],
})
export class DesignSaverLoaderComponent implements AfterViewInit {
  @ViewChild('saveBeforeLoadConfirmationDialog') saveBeforeLoadConfirmationDialog!: ConfirmationDialogComponent;
  @ViewChild('fileNameInputDialog') fileNameInputDialog!: InputDialogComponent;

  constructor(
    private readonly eventBrokerService: EventBrokerService,
    @Inject('SaveLoadService') private readonly saveLoadService: SaveLoadService,
    private readonly saveMarkService: SaveMarkService,
  ) {}

  public async saveBridgeFileSafely(forceGetFile: boolean): Promise<void> {
    this.saveLoadService.saveBridgeFile(forceGetFile, (value) => this.fileNameInputDialog.getInput(value));
  }

  public async loadBridgeFileSafely(): Promise<void> {
    if (this.saveMarkService.isDesignUnsaved) {
      this.saveBeforeLoadConfirmationDialog.open();
    } else {
      await this.saveLoadService.loadBridgeFile();
    }
  }

  async handleConfirmationButtonClick(button: ButtonTag): Promise<void> {
    switch (button) {
      case 'yes':
        await this.saveBridgeFileSafely(false);
        break;
      case 'cancel':
        return;
    }
    await this.saveLoadService.loadBridgeFile();
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.saveBridgeFileRequest.subscribe(eventInfo => this.saveBridgeFileSafely(eventInfo.data));
    this.eventBrokerService.loadBridgeFileRequest.subscribe(_eventInfo => this.loadBridgeFileSafely());
  }
}
