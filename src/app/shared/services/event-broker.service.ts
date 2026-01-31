/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AnalysisStatus } from './analysis.service';
import { ToastKind } from '../../features/toast/toast/toast-error';
import { UiMode } from '../../features/controls/management/ui-state.service';
import { SimulationPhase } from '../../features/fly-thru/rendering/simulation-state.service';
import { EditCommandCompletionInfo } from '../../features/drafting/shared/undo-manager.service';
import { FlyThruSettings } from '../../features/fly-thru/rendering/fly-thru-settings.service';
import { HelpTab } from '../../features/help/help-dialog/types';
import { CrossSection, Material, Shape, StockId } from './inventory.service';
import { BridgeModel } from '../classes/bridge.model';
import { DraftingPanelState } from './persistence.service';
import { BridgeSketchModel } from '../classes/bridge-sketch.model';
import { Point2DInterface } from '../classes/graphics';
import { SelectedElements } from '../../features/drafting/shared/selected-elements-service';
import { TipDialogKind } from '../../features/tips/tip-dialog/tip-dialog.component';

/** Origin of an event. For breaking event cycles. */
export const enum EventOrigin {
  ABOUT_DIALOG,
  APP,
  CONFIRMATION_DIALOG,
  COST_REPORT_DIALOG,
  CURSOR_OVERLAY,
  DESIGN_ITERATION_DIALOG,
  DRAFTING_PANEL,
  FLY_THRU_SETTINGS_DIALOG,
  LOAD_TEST_REPORT_DIALOG,
  MEMBER_DETAILS_DIALOG,
  MEMBER_EDIT_DIALOG,
  MEMBER_TABLE,
  MENU,
  MISSING_BROWSER_FEATURE_DIALOG,
  PRINTING_3D_DIALOG,
  SAMPLE_DIALOG,
  SERVICE,
  SETUP_DIALOG,
  SLENDERNESS_FAIL_DIALOG,
  TEMPLATE_DIALOG,
  TOOL_SELECTOR,
  TOOLBAR,
  WELCOME_DIALOG,
}

/** Event information with associated data. */
export type EventInfo<T = undefined> = { origin: EventOrigin; data: T };

// Subject broadcast message parameter types force senders to agree with consumers.
export type DesignIterationChangeData = {
  iterationCount: number;
  inProgressIndex: number;
};
export type DraftingPanelInvalidationData = 'viewport' | 'graphic';
export type HelpRequestData = { topic: string; tab?: HelpTab };
export type LoadBridgeFileRequestData = (() => void) | undefined;
export type LoadBridgeRequestData = {
  bridge: BridgeModel;
  draftingPanelState: DraftingPanelState;
};
export type InventorySelectionChangeData = {
  material?: Material;
  crossSection?: CrossSection;
  shape?: Shape;
  stockId: StockId;
};
export type SelectData = number;
export type ToggleData = boolean;

/**
 * Event subject container. Suffixes connote following conventions.
 *
 *  o xxxRequest: Some service or component is being asked to do something.
 *    - Handled in that entity.
 *  o xxxCompletion: The subject's origin is ready for queries.
 *    - Potentially handled in many places. A broadcast.
 *  o xxxSelection: A UI selector widget has been clicked.
 *    - Handled by associated selector groups (e.g. buttons and menu items) plus anyone else interested.
 *  o xxxToggle: A UI toggle widget has been clicked.
 *    - Handled by associated toggles (e.g. button and menu item) plus anyone else interested.
 *  o xxxInvalidation: Graphic entity xxx requires rendering, e.g. because
 *    the underlying model has changed.
 *    - Handled by the graphic entity.
 *  o xxxChange: A service or component's state changed. Other services need to know.
 *    - Handled by the interested services.
 */
@Injectable({ providedIn: 'root' })
export class EventBrokerService {
  public readonly aboutRequest = new Subject<EventInfo>();
  public readonly analysisCompletion = new Subject<EventInfo<AnalysisStatus>>();
  public readonly analysisReportRequest = new Subject<EventInfo>();
  public readonly animationControlsToggle = new Subject<EventInfo<ToggleData>>();
  public readonly animationToggle = new Subject<EventInfo<ToggleData>>();
  public readonly autoCorrectToggle = new Subject<EventInfo<ToggleData>>();
  public readonly costReportRequest = new Subject<EventInfo>();
  public readonly deleteSelectionRequest = new Subject<EventInfo>();
  public readonly designIterationBackRequest = new Subject<EventInfo>();
  public readonly designIterationChange = new Subject<EventInfo<DesignIterationChangeData>>();
  public readonly designIterationForwardRequest = new Subject<EventInfo>();
  public readonly designModeSelection = new Subject<EventInfo<SelectData>>();
  public readonly displayDebugTextRequest = new Subject<EventInfo<string>>();
  public readonly draftingPanelInvalidation = new Subject<EventInfo<DraftingPanelInvalidationData>>();
  public readonly draftingViewportPendingChange = new Subject<EventInfo>();
  public readonly editCommandCompletion = new Subject<EventInfo<EditCommandCompletionInfo>>();
  public readonly editModeSelection = new Subject<EventInfo<SelectData>>();
  public readonly editModeChange = new Subject<EventInfo<number>>();
  public readonly flyThruAnimationPauseRequest = new Subject<EventInfo<boolean>>();
  public readonly flyThruSettingsChange = new Subject<EventInfo<FlyThruSettings>>();
  public readonly flyThruViewportChange = new Subject<EventInfo>();
  public readonly gridDensityChange = new Subject<EventInfo>();
  public readonly gridDensitySelection = new Subject<EventInfo<SelectData>>();
  public readonly guidesToggle = new Subject<EventInfo<ToggleData>>();
  public readonly helpRequest = new Subject<EventInfo<HelpRequestData>>();
  /** Selector-internal request used to update all. User entry is loadInventorySelectorRequest. */
  public readonly inventorySelectionChangeRequest = new Subject<EventInfo<StockId>>();
  public readonly inventorySelectionChange = new Subject<EventInfo<InventorySelectionChangeData>>();
  public readonly loadBridgeCompletion = new Subject<EventInfo<BridgeModel>>();
  public readonly loadBridgeFileRequest = new Subject<EventInfo<LoadBridgeFileRequestData>>();
  public readonly loadBridgeRequest = new Subject<EventInfo<LoadBridgeRequestData>>();
  public readonly loadDesignIterationRequest = new Subject<EventInfo>();
  public readonly loadInventorySelectorRequest = new Subject<EventInfo<StockId>>();
  public readonly loadSampleRequest = new Subject<EventInfo>();
  public readonly loadSketchRequest = new Subject<EventInfo<BridgeSketchModel>>();
  public readonly loadTemplateRequest = new Subject<EventInfo>();
  public readonly memberDetailsReportRequest = new Subject<EventInfo>();
  public readonly memberEditRequest = new Subject<EventInfo<Point2DInterface>>();
  public readonly memberNumbersToggle = new Subject<EventInfo<ToggleData>>();
  public readonly memberSizeDecreaseRequest = new Subject<EventInfo>();
  public readonly memberSizeIncreaseRequest = new Subject<EventInfo>();
  public readonly memberTableToggle = new Subject<EventInfo<ToggleData>>();
  public readonly newDesignRequest = new Subject<EventInfo>();
  public readonly printRequest = new Subject<EventInfo>();
  public readonly print3dRequest = new Subject<EventInfo>();
  public readonly redoRequest = new Subject<EventInfo<number>>();
  public readonly rulersToggle = new Subject<EventInfo<ToggleData>>();
  public readonly saveBridgeFileRequest = new Subject<EventInfo<boolean>>();
  public readonly selectAllRequest = new Subject<EventInfo>();
  public readonly selectedElementsChange = new Subject<EventInfo<SelectedElements>>();
  public readonly selectNoneRequest = new Subject<EventInfo>();
  public readonly sessionStateEnableToggle = new Subject<EventInfo<ToggleData>>();
  public readonly sessionStateRestoreCompletion = new Subject<EventInfo>();
  public readonly sessionStateSaveEssentialRequest = new Subject<EventInfo>();
  public readonly sessionStateSaveRequest = new Subject<EventInfo>();
  public readonly simulationPhaseChange = new Subject<EventInfo<SimulationPhase>>();
  public readonly simulationReplayRequest = new Subject<EventInfo>();
  public readonly slendernessFailDialogOpenRequest = new Subject<EventInfo>();
  public readonly templateToggle = new Subject<EventInfo<ToggleData>>();
  public readonly tipRequest = new Subject<EventInfo<TipDialogKind>>();
  public readonly titleBlockToggle = new Subject<EventInfo<ToggleData>>();
  public readonly toastRequest = new Subject<EventInfo<ToastKind>>();
  public readonly toolsToggle = new Subject<EventInfo<ToggleData>>();
  public readonly uiModeRequest = new Subject<EventInfo<UiMode>>();
  public readonly uiModeChange = new Subject<EventInfo<UiMode>>();
  public readonly undoRequest = new Subject<EventInfo<number>>();
  public readonly unstableBridgeDialogOpenRequest = new Subject<EventInfo>();
  public readonly welcomeRequest = new Subject<EventInfo>();

  /** Returns an index mapping subject objects to subject names. */
  public get namesBySubject(): Map<Subject<any>, string> {
    const map = new Map<Subject<any>, string>();
    for (const name in this) {
      if (this[name] instanceof Subject) {
        map.set(this[name], name);
      }
    }
    return map;
  }

  /** Returns an index mapping subject names to subject objects. */
  public get subjectsByName(): Map<string, Subject<any>> {
    const map = new Map<string, Subject<any>>();
    for (const name in this) {
      if (this[name] instanceof Subject) {
        map.set(name, this[name]);
      }
    }
    return map;
  }
}
