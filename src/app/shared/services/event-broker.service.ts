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
  /** Request to show the about dialog. */
  public readonly aboutRequest = new Subject<EventInfo>();
  /** Notification that analysis is complete. */
  public readonly analysisCompletion = new Subject<EventInfo<AnalysisStatus>>();
  /** Request to show analysis report dialog. */
  public readonly analysisReportRequest = new Subject<EventInfo>();
  /** Toggle of visibility of animation controls dialog. */
  public readonly animationControlsToggle = new Subject<EventInfo<ToggleData>>();
  /** Toggle of whether to animate at all. */
  public readonly animationToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to attach a template sketch to the bridge model currently in the drafting panel. */
  public readonly attachSketchRequest = new Subject<EventInfo<BridgeSketchModel>>();
  /** Toggle of whether to auto-correct truss before analysis. */
  public readonly autoCorrectToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to show cost report dialog. */
  public readonly costReportRequest = new Subject<EventInfo>();
  /** Request to delete selected joint or members. */
  public readonly deleteSelectionRequest = new Subject<EventInfo>();
  /** Request to go back one design iteration. */
  public readonly designIterationBackRequest = new Subject<EventInfo>();
  /** Notification that the effective design iteration has changed. */
  public readonly designIterationChange = new Subject<EventInfo<DesignIterationChangeData>>();
  /** Request to go forward one design iteration. */
  public readonly designIterationForwardRequest = new Subject<EventInfo>();
  /** Request to select design drafting or test mode. */
  public readonly designModeSelection = new Subject<EventInfo<SelectData>>();
  /** Request to display a line of debug text in the UI. */
  public readonly displayDebugTextRequest = new Subject<EventInfo<string>>();
  /** Declaration that the drafting panel graphics are invalid and need re-drawing. */
  public readonly draftingPanelInvalidation = new Subject<EventInfo<DraftingPanelInvalidationData>>();
  /** Notification that the drafting viewport is about to change. */
  public readonly draftingViewportPendingChange = new Subject<EventInfo>();
  /** Notification that a drafting panel edit command has just been executed. */
  public readonly editCommandCompletion = new Subject<EventInfo<EditCommandCompletionInfo>>();
  /** Selection of the drafting edit mode: joint, member, select, erase. */
  public readonly editModeSelection = new Subject<EventInfo<SelectData>>();
  /** Notification that the drafting edit mode has changed. */
  public readonly editModeChange = new Subject<EventInfo<number>>();
  /** Request to pause the load test fly-thru animation. */
  public readonly flyThruAnimationPauseRequest = new Subject<EventInfo<boolean>>();
  /** Notification that settings of the load test fly-thru animation have changed. */
  public readonly flyThruSettingsChange = new Subject<EventInfo<FlyThruSettings>>();
  /** Notification that viewport of the load test fly-thru animation has changed. */
  public readonly flyThruViewportChange = new Subject<EventInfo>();
  /** Notification that the drafting panel's grid density has changed. */
  public readonly gridDensityChange = new Subject<EventInfo>();
  /** Selection of the drafting panel's grid density. */
  public readonly gridDensitySelection = new Subject<EventInfo<SelectData>>();
  /** Toggle of whether the drafting panel drawing guides are visible. */
  public readonly guidesToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to show the help dialog. */
  public readonly helpRequest = new Subject<EventInfo<HelpRequestData>>();
  /** Selector-internal request used to update all. User entry is loadInventorySelectorRequest. */
  public readonly inventorySelectionChangeRequest = new Subject<EventInfo<StockId>>();
  /** Notification that the member material/section/size selection has changed. */
  public readonly inventorySelectionChange = new Subject<EventInfo<InventorySelectionChangeData>>();
  /** Notification that the loading of a bridge model is complete. */
  public readonly loadBridgeCompletion = new Subject<EventInfo<BridgeModel>>();
  /** Request to load a bridge model in the drafting panel by reading it from a file. */
  public readonly loadBridgeFileRequest = new Subject<EventInfo<LoadBridgeFileRequestData>>();
  /** Request to load a bridge model in the drafting panel. */
  public readonly loadBridgeRequest = new Subject<EventInfo<LoadBridgeRequestData>>();
  /** Request to load a specific design iteration in the drafting panel. */
  public readonly loadDesignIterationRequest = new Subject<EventInfo>();
  /** Request to load a specific material/section/size into inventory selectors. */
  public readonly loadInventorySelectorRequest = new Subject<EventInfo<StockId>>();
  /** Request to load a sample bridge in the drafting panel. */
  public readonly loadSampleRequest = new Subject<EventInfo>();
  /** Request to show the load template dialog. */
  public readonly loadTemplateRequest = new Subject<EventInfo>();
  /** Request to show the member details/analysis report dialog. */
  public readonly memberDetailsReportRequest = new Subject<EventInfo>();
  /** Request to open the member edit context dialog. */
  public readonly memberEditRequest = new Subject<EventInfo<Point2DInterface>>();
  /** Toggle of whether members are visible in the drafting panel. */
  public readonly memberNumbersToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to decrease the sizes of selected members by one. */
  public readonly memberSizeDecreaseRequest = new Subject<EventInfo>();
  /** Request to increase the sizes of selected members by one. */
  public readonly memberSizeIncreaseRequest = new Subject<EventInfo>();
  /** Toggle of whether the member list/table is visible beside the drafting panel. */
  public readonly memberTableToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to show the design setup wizard dialog, beginning a new design in the drafting panel. */
  public readonly newDesignRequest = new Subject<EventInfo>();
  /** Request to format a drawing of the drafting panel's bridge model for printing. */
  public readonly printRequest = new Subject<EventInfo>();
  /** Request to export OBJ files of the drafting panel's bridge model for 3d printing. */
  public readonly print3dRequest = new Subject<EventInfo>();
  /** Request to redo the last undone edit command in the drafting window. */
  public readonly redoRequest = new Subject<EventInfo<number>>();
  /** Toggle of whether the rulers at the drafting panel's edges are visible. */
  public readonly rulersToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to save the drafting panel's bridge model to a file. */
  public readonly saveBridgeFileRequest = new Subject<EventInfo<boolean>>();
  /** Request to select all members of the bridge model in the drafting panel. */
  public readonly selectAllRequest = new Subject<EventInfo>();
  /** Notification that the set of selected elements in the drafting panel has changed. */
  public readonly selectedElementsChange = new Subject<EventInfo<SelectedElements>>();
  /** Request to de-select all members of the bridge model in the drafting panel. */
  public readonly selectNoneRequest = new Subject<EventInfo>();
  /** Toggle of whether session state is saved and restored on tab reloads. */
  public readonly sessionStateEnableToggle = new Subject<EventInfo<ToggleData>>();
  /** Notification that session state has been restored after a tab reload. */
  public readonly sessionStateRestoreCompletion = new Subject<EventInfo>();
  /** Request for dehydrator to render essential state for saving. */
  public readonly sessionStateSaveEssentialRequest = new Subject<EventInfo>();
  /** Request for dehydrator to render normal state for saving. */
  public readonly sessionStateSaveRequest = new Subject<EventInfo>();
  /** Notification that the phase of the load test fly-through animation simulation has changed. */
  public readonly simulationPhaseChange = new Subject<EventInfo<SimulationPhase>>();
  /** Request that the load test fly-through animation simulation should restart after bridge failure. */
  public readonly simulationReplayRequest = new Subject<EventInfo>();
  /** Request to show the slenderness failure dialog. */
  public readonly slendernessFailDialogOpenRequest = new Subject<EventInfo>();
  /** Toggle of whether the template attached to the drafting panel bridge model is visible. */
  public readonly templateToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to show the startup tip dialog. */
  public readonly tipRequest = new Subject<EventInfo<TipDialogKind>>();
  /** Toggle of whether the title block is visible in the drafting panel. */
  public readonly titleBlockToggle = new Subject<EventInfo<ToggleData>>();
  /** Request to show a toast containing a message. */
  public readonly toastRequest = new Subject<EventInfo<ToastKind>>();
  /** Toggle of whether the tools palette is visible in the drafting panel. */
  public readonly toolsToggle = new Subject<EventInfo<ToggleData>>();
  /** Request that the UI go to a specified mode: initial, drafting, animation. */
  public readonly uiModeRequest = new Subject<EventInfo<UiMode>>();
  /** Notification that the UI mode has changed. */
  public readonly uiModeChange = new Subject<EventInfo<UiMode>>();
  /** Request to undo the last edit command in the drafting window. */
  public readonly undoRequest = new Subject<EventInfo<number>>();
  /** Request to show the unstable bridge dialog. */
  public readonly unstableBridgeDialogOpenRequest = new Subject<EventInfo>();
  /** Request to show the welcome dialog with options for starting a bridge design. */
  public readonly welcomeRequest = new Subject<EventInfo>();

  // De- and rehydration support hooks.

  /** Select and toggle subjects that should be reset at every startup (i.e. not rehydrated). */
  public readonly noDehydrateSubjects = [this.designModeSelection]; // Rehydrated animation would be weird.

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
