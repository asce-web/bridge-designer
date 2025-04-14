import { Injectable } from '@angular/core';
import { UndoManagerService } from '../drafting/shared/undo-manager.service';
import { BridgeService } from '../../shared/services/bridge.service';
import { PersistenceService, SaveSet } from '../../shared/services/persistence.service';
import { EventBrokerService, EventOrigin } from '../../shared/services/event-broker.service';
import { ToastError } from '../toast/toast/toast-error';

const PICKER_ID = 'bridge-design';
const PICKER_DIR = 'documents';
const PICKER_TYPES = [
  {
    description: 'Bridge design',
    accept: { 'text/plain': ['.bdc'] }, // TODO: change to application/octet-stream with obfuscation
  },
];

@Injectable({ providedIn: 'root' })
export class SaveLoadService {
  private _currentFileHandle: FileSystemFileHandle | undefined;
  private savedMark: any;

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly eventBrokerService: EventBrokerService,
    private readonly persistenceService: PersistenceService,
    private readonly undoManagerService: UndoManagerService,
  ) {
    eventBrokerService.saveBridgeFileRequest.subscribe(eventInfo => this.saveBridgeFile(eventInfo.data));
    eventBrokerService.loadBridgeFileRequest.subscribe(_eventInfo => this.loadBridgeFile());
    eventBrokerService.loadBridgeCompletion.subscribe(_eventInfo => this.markSave());
    eventBrokerService.sessionStateRestoreCompletion.subscribe(_eventInfo => this.markSave());
  }

  // TODO: file read/write error handling.

  public get currentFileName(): string | undefined {
    return this._currentFileHandle?.getFile.name;
  }

  public get isUnsaved(): boolean {
    return this.undoManagerService.stateToken !== this.savedMark;
  }

  public async saveBridgeFile(forceGetFile: boolean = false): Promise<void> {
    try {
      if (forceGetFile || !this._currentFileHandle) {
        this._currentFileHandle = await this.getSaveFile();
      }
      const stream = await this._currentFileHandle!.createWritable();
      const text = this.bridgeService.saveSetText;
      await stream.write(text);
      await stream.close();
    } catch (error) {
      console.log('save:', error);
      // Abort is a normal user cancel, so ignore it.
      if (!(error instanceof DOMException) || error.name !== 'AbortError') {
        throw new ToastError('fileWriteError');
      }
      throw error;
    }
    this.markSave();
  }

  public async loadBridgeFile(): Promise<void> {
    if (this.isUnsaved) {
      await this.saveBridgeFile();
    }
    const text = await this.doLoad();
    const saveSet = SaveSet.createNew();
    this.persistenceService.parseSaveSetText(text, saveSet);
    this.eventBrokerService.loadBridgeRequest.next({
      origin: EventOrigin.SERVICE,
      data: saveSet,
    });
  }

  private async doLoad(): Promise<string> {
    const options = {
      id: PICKER_ID,
      startIn: PICKER_DIR,
      types: PICKER_TYPES,
    };
    try {
      const [fileHandle]: FileSystemFileHandle[] = await (window as any).showOpenFilePicker(options);
      const file = await fileHandle.getFile();
      return file.text();
    } catch (error) {
      console.log('load:', error);
      // Abort is a normal user cancel, so ignore it.
      if (!(error instanceof DOMException) || error.name !== 'AbortError') {
        throw new ToastError('fileReadError');
      }
      throw error;
    }
  }

  private async getSaveFile(): Promise<FileSystemFileHandle> {
    const options = {
      id: PICKER_ID,
      startIn: PICKER_DIR,
      suggestedName: this.currentFileName || 'MyDesign.bdc',
      types: PICKER_TYPES,
    };
    return await (window as any).showSaveFilePicker(options);
  }

  private markSave(): void {
    this.savedMark = this.undoManagerService.stateToken;
  }
}
