import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const enum EventOrigin {
  DRAFTING_PANEL,
  MENU,
  SAMPLE_DIALOG,
  TOOLBAR,
}

export type EventInfo = { source: EventOrigin, data?: any };

@Injectable({providedIn: 'root'})
export class EventBrokerService {
  public readonly changeInventorySelection: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly loadBridgeRequest: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly loadInventorySelectorRequest: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly loadSampleRequest: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly selectDesignMode: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly selectEditMode: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly selectGridDensity: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleAnimation: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleAnimationControls: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleAutoCorrect: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleGuides: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleLegacyGraphics: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleMemberNumbers: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleMemberTable: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleRulers: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleTemplate: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleTitleBlock: Subject<EventInfo> = new Subject<EventInfo>();
  public readonly toggleTools: Subject<EventInfo> = new Subject<EventInfo>();
}
