/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { AfterViewInit, Component } from '@angular/core';
import { AnalysisService, AnalysisStatus } from '../../../shared/services/analysis.service';
import { AnalysisValidityService } from '../management/analysis-validity.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';

@Component({
  selector: 'status-indicator',
  standalone: true,
  templateUrl: './status-indicator.component.html',
  styleUrl: './status-indicator.component.scss',
})
export class StatusIndicatorComponent implements AfterViewInit {
  iconSrc!: string;
  iconTitle!: string;

  constructor(
    private readonly analysisService: AnalysisService,
    private readonly analysisValidityService: AnalysisValidityService,
    private readonly eventBrokerService: EventBrokerService,
  ) {
    this.setIcon(AnalysisStatus.NONE);
  }

  private setIcon(status: AnalysisStatus): void {
    ({ src: this.iconSrc, title: this.iconTitle } = AnalysisService.getStatusIcon(status));
  }

  ngAfterViewInit(): void {
    // A freshly loaded bridge hasn't yet been analyzed.
    this.eventBrokerService.loadBridgeCompletion.subscribe(() => {
      this.setIcon(AnalysisStatus.NONE);
    });
    // New analysis status needs to be displayed.
    this.eventBrokerService.analysisCompletion.subscribe(eventInfo => {
      this.setIcon(eventInfo.data);
    });
    // Analysis completion event during re-hydration is too early to be handled above.
    this.eventBrokerService.sessionStateRestoreCompletion.subscribe(() => {
      this.setIcon(this.analysisService.status);
    });
    // Any edit command is a potential status change.
    this.eventBrokerService.editCommandCompletion.subscribe(() => {
      if (this.analysisValidityService.isLastAnalysisValid) {
        this.setIcon(this.analysisService.status);
      } else {
        this.iconSrc = 'img/working.png';
        this.iconTitle = 'The design changed since last tested.';
      }
    });
  }
}
