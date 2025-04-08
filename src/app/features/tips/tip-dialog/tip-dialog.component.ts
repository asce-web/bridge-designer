import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { jqxCheckBoxModule, jqxCheckBoxComponent } from 'jqwidgets-ng/jqxcheckbox';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { SessionStateService } from '../../../shared/services/session-state.service';

@Component({
    selector: 'tip-dialog',
    imports: [jqxCheckBoxModule, jqxWindowModule, jqxButtonModule],
    templateUrl: './tip-dialog.component.html',
    styleUrl: './tip-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TipDialogComponent implements AfterViewInit {
  @Output() readonly onClose = new EventEmitter<{ isStartupTip: boolean }>();

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('tips') tips!: ElementRef<HTMLSpanElement>;
  @ViewChild('showAtStartupCheckbox') showAtStartupCheckbox!: jqxCheckBoxComponent;

  private isStartupTip: boolean = false;
  private tipCount: number = 0;
  tipIndex: number = 0;
  constructor(
    private readonly eventBrokerService: EventBrokerService,
    private readonly sessionStateService: SessionStateService,
  ) {}

  bumpTip(increment: 1 | -1): void {
    this.showTip(this.tipIndex + increment);
  }

  /** Tell our parent that we're done. */
  handleDialogClose(): void {
    this.bumpTip(1); // Next time user gets next tip.
    this.onClose.emit({ isStartupTip: this.isStartupTip });
  }

  /** Shows tip with given index, which is wrappped into the valid range. */
  private showTip(index: number): void {
    while (index >= this.tipCount) {
      index -= this.tipCount;
    }
    while (index < 0) {
      index += this.tipCount;
    }
    for (let i = 0; i < this.tipCount; ++i) {
      const tip = this.tips.nativeElement.children.item(i) as HTMLSpanElement;
      tip.style.display = i === index ? '' : 'none';
    }
    this.tipIndex = index;
  }

  ngAfterViewInit(): void {
    this.tipCount = this.tips.nativeElement.childElementCount;
    this.eventBrokerService.tipRequest.subscribe(eventInfo => {
      this.isStartupTip = eventInfo.data === 'startup';
      if (this.isStartupTip && !this.showAtStartupCheckbox.checked()) {
        this.handleDialogClose(); // Simulate tip dialog that didn't happen.
      } else {
        this.dialog.open();
      }
    });
    this.sessionStateService.register(
      'tip.dialog',
      () => this.dehydrate(),
      state => this.rehydrate(state),
      true /* essential */,
    );
    this.showTip(this.tipIndex);
  }

  private dehydrate(): State {
    return {
      showOnStartup: this.showAtStartupCheckbox.checked() !== false,
      tipIndex: this.tipIndex,
    };
  }

  private rehydrate(state: State): void {
    this.showAtStartupCheckbox.checked(state.showOnStartup);
    this.showTip(state.tipIndex);
  }
}

type State = {
  showOnStartup: boolean;
  tipIndex: number;
};
