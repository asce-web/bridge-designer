import { Injectable } from '@angular/core';
import { EventBrokerService } from '../../shared/services/event-broker.service';
import { UndoManagerService } from '../drafting/shared/undo-manager.service';

/** A container for the bit that reflects whether the current design needs saving. */
@Injectable({ providedIn: 'root' })
export class SaveMarkService {
  private savedMark: any;

  constructor(
    eventBrokerService: EventBrokerService,
    private readonly undoManagerService: UndoManagerService,
  ) {
    // Reset the saved bit for current undo state. It's un-set by any edit wrt this one.
    eventBrokerService.loadBridgeCompletion.subscribe(_eventInfo => this.markSave());
    // Rehydrate.
    eventBrokerService.sessionStateRestoreCompletion.subscribe(_eventInfo => this.markSave());
  }

  /** Returns whether the current design is changed since last save. */
  public get isDesignUnsaved(): boolean {
    return this.undoManagerService.stateToken !== this.savedMark;
  }

  public markSave(): void {
    this.savedMark = this.undoManagerService.stateToken;
  }
}
