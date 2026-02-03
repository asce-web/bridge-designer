/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxRadioButtonModule, jqxRadioButtonComponent } from 'jqwidgets-ng/jqxradiobutton';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';

@Component({
  selector: 'welcome-dialog',
  imports: [jqxWindowModule, jqxButtonModule, jqxRadioButtonModule],
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('newButton') newButton!: jqxRadioButtonComponent;
  @ViewChild('loadSampleButton') loadSampleButton!: jqxRadioButtonComponent;
  @ViewChild('openButton') openButton!: jqxRadioButtonComponent;

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  handleOkButton(): void {
    this.dialog.close();
    if (this.newButton.checked()) {
      this.eventBrokerService.newDesignRequest.next({ origin: EventOrigin.WELCOME_DIALOG, data: undefined });
    } else if (this.loadSampleButton.checked()) {
      this.eventBrokerService.loadSampleRequest.next({ origin: EventOrigin.WELCOME_DIALOG, data: undefined });
    } else if (this.openButton.checked()) {
      this.eventBrokerService.loadBridgeFileRequest.next({ origin: EventOrigin.WELCOME_DIALOG, data: undefined });
    }
  }

  handleAboutButton(): void {
    this.eventBrokerService.aboutRequest.next({ origin: EventOrigin.WELCOME_DIALOG, data: undefined });
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.welcomeRequest.subscribe(() => this.dialog.open());
  }
}
