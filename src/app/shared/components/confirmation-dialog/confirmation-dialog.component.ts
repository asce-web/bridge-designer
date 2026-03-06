/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  OnChanges,
  Output,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Utility } from '../../classes/utility';
import { EventBrokerService, EventOrigin } from '../../services/event-broker.service';
import { SessionStateService } from '../../../features/session-state/session-state.service';

/** Possible buttons in recommended order. */
const BUTTON_INFO = {
  help: 'Help...',
  ok: 'OK',
  yes: 'Yes',
  no: 'No',
  cancel: 'Cancel',
  close: 'Close',
} as const;
export type ButtonTag = keyof typeof BUTTON_INFO;

@Component({
  selector: 'confirmation-dialog',
  imports: [CommonModule, jqxCheckBoxModule, jqxWindowModule, jqxButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements AfterViewInit, OnChanges {
  /** Buttons to be rendered. Order of tags is honored. See `BUTTON_INFO`. */
  @Input() buttons: ButtonTag[] = ['close'];
  @Input({ transform: numberAttribute}) buttonWidth = 64;
  @Input() contentHtml: string = '';
  @Input() headerHtml: string = '';
  @Input({ transform: numberAttribute}) height = 200; 
  @Input() helpTopic: string = 'hlp_how_to';
  @Input() rememberKey: string = '';
  @Input({ transform: numberAttribute}) width = 400;
  @Input({ transform: numberAttribute}) timeout: number = 0;
  @Output() readonly onButtonClick = new EventEmitter<ButtonTag>();
  @ViewChild('rememberCheckbox') rememberCheckbox!: jqxCheckBoxComponent;
  @ViewChild('dialog') dialog!: jqxWindowComponent;

  sanitizedContentHtml!: SafeHtml;
  sanitizedHeaderHtml!: SafeHtml;
  readonly buttonInfo = BUTTON_INFO;
  private rememberedButtonTag: ButtonTag | undefined;

  constructor(
    private readonly eventBrokerService: EventBrokerService,
    private readonly sanitizer: DomSanitizer,
    private readonly sessionStateService: SessionStateService,
  ) {}

  public open(): void {
    if (this.rememberedButtonTag) {
      // Simulate a click of remembered button press.
      this.onButtonClick.emit(this.rememberedButtonTag);
    } else {
      this.dialog.open();
      if (this.timeout > 0) {
        setTimeout(() => this.dialog.close(), this.timeout);
      }
    }
  }

  handleButtonClick(tag: ButtonTag) {
    if (tag === 'help') {
      this.eventBrokerService.helpRequest.next({
        origin: EventOrigin.CONFIRMATION_DIALOG,
        data: { topic: this.helpTopic },
      });
    } else {
      if (this.rememberCheckbox?.checked()) {
        this.rememberedButtonTag = tag;
      }
      this.dialog.close();
      this.onButtonClick.emit(tag);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contentHtml']) {
      const html = this.sanitizer.sanitize(SecurityContext.HTML, this.contentHtml);
      this.sanitizedContentHtml = Utility.assertNotNull(html);
    }
    if (changes['headerHtml']) {
      const html = this.sanitizer.sanitize(SecurityContext.HTML, this.headerHtml);
      this.sanitizedHeaderHtml = Utility.assertNotNull(html);
    }
  }

  ngAfterViewInit(): void {
    if (this.rememberKey) {
      this.sessionStateService.register(
        this.rememberKey,
        () => this.dehydrate(),
        state => this.rehydrate(state),
        true /* essential */,
      );
    }
  }

  private dehydrate(): State {
    return {
      rememberedButtonTag: this.rememberedButtonTag,
    };
  }

  private rehydrate(state: State): void {
    this.rememberedButtonTag = state.rememberedButtonTag;
  }
}

type State = {
  rememberedButtonTag?: ButtonTag;
};
