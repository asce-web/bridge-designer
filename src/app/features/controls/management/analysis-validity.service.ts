import { Injectable } from '@angular/core';
import { UndoManagerService } from '../../drafting/shared/undo-manager.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';

/**
 * Container for logic that determines if the last bridge analysis is still valid for the current bridge.
 * The value during analysis completion and on edit command completion, so don't use this in handlers
 * of those events.
 */
@Injectable({ providedIn: 'root' })
export class AnalysisValidityService {
  private currentAnalysisToken: any;

  constructor(
    eventBrokerService: EventBrokerService,
    private readonly undoManagerService: UndoManagerService,
  ) {
    eventBrokerService.analysisCompletion.subscribe(_eventInfo => {
      this.currentAnalysisToken = undoManagerService.stateToken;
    });
  }

  public get isLastAnalysisValid(): boolean {
    return this.currentAnalysisToken === this.undoManagerService.stateToken;
  }
}
