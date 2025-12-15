/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { Utility } from '../../classes/utility';

@Component({
  selector: 'input-dialog',
  imports: [jqxButtonModule, jqxWindowModule],
  templateUrl: './input-dialog.component.html',
  styleUrl: './input-dialog.component.scss',
})
export class InputDialogComponent {
  @Input() buttonWidth = 64;
  @Input() headerHtml: string = 'Input';
  @Input() noteHtml: string = '';
  @Input() promptHtml: string = 'Enter:';
  @Output() readonly onButtonClick = new EventEmitter<string>();
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  private getInputInfo: { resolve: any; reject: any; ok?: boolean } | undefined;

  sanitizedHeaderHtml!: SafeHtml;
  sanitizedNoteHtml!: SafeHtml;
  sanitizedPromptHtml!: SafeHtml;

  constructor(private readonly sanitizer: DomSanitizer) {}

  public open(): void {
    this.dialog.open();
  }

  /**
   * Returns a promise that opens the dialog, resolves when
   * it closes with an OK click, and rejects otherwise.
   */
  public getInput(initialValue: string = ''): Promise<string> {
    this.input.nativeElement.value = initialValue;
    this.open();
    return new Promise((resolve, reject) => {
      this.getInputInfo = { resolve, reject };
    });
  }

  handleClose() {
    if (this.getInputInfo) {
      if (this.getInputInfo.ok) {
        this.getInputInfo.resolve(this.input.nativeElement.value);
      } else {
        this.getInputInfo.reject();
      }
      this.getInputInfo = undefined;
    }
  }

  handleOkButtonClick() {
    if (this.getInputInfo) {
      this.getInputInfo.ok = true;
    }
    this.dialog.close();
    this.onButtonClick.emit(this.input.nativeElement.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const headerChange = changes['headerHtml'];
    if (headerChange) {
      const html = this.sanitizer.sanitize(SecurityContext.HTML, this.headerHtml);
      this.sanitizedHeaderHtml = Utility.assertNotNull(html);
    }
    const promptChange = changes['promptHtml'];
    if (promptChange) {
      const html = this.sanitizer.sanitize(SecurityContext.HTML, this.promptHtml);
      this.sanitizedPromptHtml = Utility.assertNotNull(html);
    }
    const noteChange = changes['noteHtml'];
    if (noteChange) {
      const html = this.sanitizer.sanitize(SecurityContext.HTML, this.noteHtml);
      this.sanitizedNoteHtml = Utility.assertNotNull(html);
    }
  }
}
