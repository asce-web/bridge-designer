import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxToggleButtonComponent, jqxToggleButtonModule } from 'jqwidgets-ng/jqxtogglebutton';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { UiStateService } from '../management/ui-state.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
@Component({
  selector: 'tool-selector',
  standalone: true,
  imports: [jqxToggleButtonModule, jqxWindowModule],
  templateUrl: './tool-selector.component.html',
  styleUrl: './tool-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolSelectorComponent implements AfterViewInit {
  readonly imgSize = 25;
  readonly buttonSize = 34;
  readonly windowWidth = 4 * this.buttonSize + 2;
  readonly windowHeight = 68;

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('jointsButton') jointsButton!: jqxToggleButtonComponent;
  @ViewChild('membersButton') membersButton!: jqxToggleButtonComponent;
  @ViewChild('selectButton') selectButton!: jqxToggleButtonComponent;
  @ViewChild('eraseButton') eraseButton!: jqxToggleButtonComponent;

  constructor(
    private readonly uiStateService: UiStateService,
    private readonly eventBrokerService: EventBrokerService,
  ) {}

  ngAfterViewInit(): void {
    this.uiStateService.registerSelectButtons(
      [this.jointsButton, this.membersButton, this.selectButton, this.eraseButton],
      this.eventBrokerService.editModeSelection,
    );
    this.eventBrokerService.toolsToggle.subscribe(eventInfo => {
      if (eventInfo.data) {
        this.dialog.open();
      } else {
        this.dialog.close();
      }
    });
  }
}
