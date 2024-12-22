import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxDropDownListComponent, jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { jqxInputModule } from 'jqwidgets-ng/jqxinput';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { WidgetHelper } from '../../../shared/classes/widget-helper';

const enum BumpDirection {
  UP = 1,
  DOWN = -1,
  TO = 2,
}

@Component({
  selector: 'setup-wizard',
  standalone: true,
  imports: [
    jqxButtonModule,
    jqxDropDownListModule,
    jqxInputModule,
    jqxListBoxModule,
    jqxRadioButtonModule,
    jqxWindowModule,
  ],
  templateUrl: './setup-wizard.component.html',
  styleUrl: './setup-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupWizardComponent implements AfterViewInit {
  private static readonly CARD_COUNT = 7;

  readonly edition = 'Cloud edition';
  readonly buttonWidth = 80;
  readonly archHeights = ['4 meters', '8 meters', '12 meters', '16 meters', '20 meters', '24 meters'];
  readonly deckElevations = ['24 meters', '20 meters', '16 meters', '12 meters', '8 meters', '4 meters', '0 meters'];
  readonly templates = ['&lt;none&gt;', 'Through truss - Howe'];
  private cardIndex: number = 0;
  private cardElements: NodeListOf<HTMLElement>[] = new Array<NodeListOf<HTMLElement>>(SetupWizardComponent.CARD_COUNT);

  @ViewChild('archHeightDropDownList') archHeightDropDownList!: jqxDropDownListComponent;
  @ViewChild('backButton') backButton!: jqxButtonComponent;
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('elevationCanvas') elevationCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('finishButton') finishButton!: jqxButtonComponent;
  @ViewChild('localContestCodeInput') localContestCodeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('nextButton') nextButton!: jqxButtonComponent;
  @ViewChild('pierHeightDropDownList') pierHeightDropDownList!: jqxDropDownListComponent;

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  private setCardDisplay(index: number, value: string = ''): void {
    this.cardElements[index].forEach(element => (element.style.display = value));
  }

  private bumpCard(direction: BumpDirection, toIndex: number = 0): void {
    const newCardIndex = direction == BumpDirection.TO ? toIndex : this.cardIndex + direction;
    if (newCardIndex < 0 || newCardIndex >= this.cardElements.length) {
      return;
    }
    this.setCardDisplay(this.cardIndex, 'none');
    this.setCardDisplay(newCardIndex);
    this.backButton.disabled(newCardIndex == 0);
    this.nextButton.disabled(newCardIndex == SetupWizardComponent.CARD_COUNT - 1);
    this.cardIndex = newCardIndex;
  }

  archAbutmentSelectHandler(event: any): void {
    WidgetHelper.disableDropDownList(this.archHeightDropDownList, !event.args.checked);
  }

  backButtonOnClickHandler(): void {
    this.bumpCard(BumpDirection.DOWN);
  }

  finishButtonOnClickHandler(): void {
    this.dialog.close();
  }

  helpButtonOnClickHandler(): void {
    // TODO: URL is a placeholder. Put the real help link here.
    window.open('https://google.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
  }

  localContestRadioYesHandler(event: any) {
    this.localContestCodeInput.nativeElement.disabled = !event.args.checked;
  }

  nextButtonOnClickHandler(): void {
    this.bumpCard(BumpDirection.UP);
  }

  pierSelectHandler(event: any): void {
    WidgetHelper.disableDropDownList(this.pierHeightDropDownList, !event.args.checked);
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.newDesignRequest.subscribe(_info => this.dialog.open());
    // Find all the elements associated with cards and hide all but card-1.
    for (var i: number = 0; i < SetupWizardComponent.CARD_COUNT; ++i) {
      this.cardElements[i] = this.content.nativeElement.querySelectorAll(`.card-${i + 1}`);
      if (i !== this.cardIndex) {
        this.setCardDisplay(i, 'none');
      }
    }
  }
}
