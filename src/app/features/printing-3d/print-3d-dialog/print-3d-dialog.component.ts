/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { FormsModule } from '@angular/forms';
import { jqxNumberInputComponent, jqxNumberInputModule } from 'jqwidgets-ng/jqxnumberinput';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';
import { Print3dModelInfo, Printing3dConfig, Printing3dService } from '../printing-3d.service';
import { jqxSliderComponent } from 'jqwidgets-ng/jqxslider';
import { SaveMarkService } from '../../save-load/save-mark.service';
import { DEFAULT_SAVE_FILE_NAME } from '../../save-load/save-load.service';
import { SessionStateService } from '../../../shared/services/session-state.service';

@Component({
  selector: 'print-3d-parameters-dialog',
  imports: [jqxWindowModule, jqxButtonModule, FormsModule, jqxNumberInputModule],
  templateUrl: './print-3d-dialog.component.html',
  styleUrl: './print-3d-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Print3dDialogComponent implements AfterViewInit {
  modelInfo: Print3dModelInfo = new Print3dModelInfo();
  config: Printing3dConfig = new Printing3dConfig();
  scaleSlider!: jqxSliderComponent;

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('minFeatureSizeInput') minFeatureSizeInput!: jqxNumberInputComponent;
  @ViewChild('scaleSliderContainer', { read: ViewContainerRef, static: true }) scaleSliderContainer!: ViewContainerRef;

  private unscaledModelInfo: Print3dModelInfo | undefined;

  constructor(
    private readonly eventBrokerService: EventBrokerService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly printing3dService: Printing3dService,
    private readonly saveMarkService: SaveMarkService,
    private readonly sessionStateService: SessionStateService,
  ) {
    // jqWidgets provides this of initContent to the jqxWindow component!
    this.initDialogContent = this.initDialogContent.bind(this);
  }

  initDialogContent(): void {
    this.scaleSlider = Print3dDialogComponent.setUpSlider(
      this.scaleSliderContainer,
      {
        height: 44,
        width: 280,
        max: 10,
        min: 2,
        mode: 'fixed',
        step: 0.2,
        showTicks: true,
        template: 'primary',
        value: this.config.modelMmPerWorldM,
      },
      () => this.handleScaleSliderChange(),
    );
  }

  get abutmentsFileContents(): string {
    return this.printing3dService.abutmentsFileContents;
  }
  get crossMembersFileContents(): string {
    return this.printing3dService.crossMembersFileContents;
  }

  get trussesFileContents(): string {
    return this.printing3dService.trussesFileContents;
  }

  /** Shows help for the dialog. */
  handleHelpButtonClick() {
    this.eventBrokerService.helpRequest.next({
      origin: EventOrigin.PRINTING_3D_DIALOG,
      data: { topic: 'hlp_export_to_3dprint' },
    });
  }

  /** Prints OBJ files for the current bridge and config. */
  async handleOkButtonClick(): Promise<void> {
    this.dialog.close();
    await this.printing3dService.emit3dPrint(this.config);
  }

  /** Sets up dialog fields for current bridge and its edit state. */
  async handleDialogOpen(): Promise<void> {
    // Initialize the default export file name base from the save file name.
    const initBaseFileName = this.saveMarkService.savedFileName || DEFAULT_SAVE_FILE_NAME;
    this.config.baseFileName = initBaseFileName.replace(/\.bdc$/, '');
    this.unscaledModelInfo = await this.printing3dService.getUnscaledModelInfo();
    this.modelInfo = this.unscaledModelInfo.applyScale(this.config.modelMmPerWorldM);
    this.changeDetectorRef.detectChanges();
  }

  handleScaleSliderChange(): void {
    this.config.modelMmPerWorldM = this.scaleSlider.value();
    if (this.unscaledModelInfo === undefined) {
      return;
    }
    this.modelInfo = this.unscaledModelInfo.applyScale(this.config.modelMmPerWorldM);
    this.changeDetectorRef.detectChanges();
  }

  private static setUpSlider(
    containerRef: ViewContainerRef,
    inputs: { [key: string]: any },
    onChange: () => void,
  ): jqxSliderComponent {
    const sliderRef = containerRef.createComponent(jqxSliderComponent);
    for (const [key, value] of Object.entries(inputs)) {
      sliderRef.setInput(key, value);
    }
    sliderRef.instance.onChange.subscribe(onChange);
    sliderRef.changeDetectorRef.detectChanges();
    return sliderRef.instance;
  }

  dehydrate(): State {
    return {
      config: this.config,
    };
  }

  rehydrate(state: State): void {
    Object.assign(this.config, state.config);
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.print3dRequest.subscribe(() => this.dialog.open());
    this.sessionStateService.register(
      'print3d.dialog',
      () => this.dehydrate(),
      state => this.rehydrate(state),
      true,  // essential
    );
  }
}

type State = {
  config: Printing3dConfig;
};
