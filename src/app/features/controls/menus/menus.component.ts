import { CommonModule, } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { jqxMenuComponent, jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { EventBrokerService, EventOrigin } from '../../../shared/services/event-broker.service';
import { UiStateService } from '../../drafting/services/ui-state.service';

@Component({
  selector: 'menus',
  standalone: true,
  imports: [
    CommonModule,
    jqxMenuModule,
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenusComponent implements AfterViewInit {
  constructor(
    private readonly uiStateService: UiStateService,
    private readonly eventBrokerService: EventBrokerService,
  ) { }

  @ViewChild('mainMenu', { static: false }) mainMenu!: jqxMenuComponent;

  handleItemClick(event: any): void {
    const liElement = event.args as HTMLElement;
    // State service handles radio and toggle behavior.
    this.uiStateService.handleMenuItemClicked(liElement.id);
    switch (liElement.id) {
      case 'loadSample':
        this.eventBrokerService.loadSampleRequest.next({ source: EventOrigin.MENU });
        break;
    }
  }

  ngAfterViewInit(): void {
    this.mainMenu.disable('print', true); // TODO: Example/test. Remove.
    this.uiStateService.registerSelectMenuItems(['coarseGrid', 'mediumGrid', 'fineGrid'], this.eventBrokerService.selectGridDensity);
    this.uiStateService.registerSelectMenuItems(['drawingBoard', 'loadTest'], this.eventBrokerService.selectDesignMode);
    this.uiStateService.registerSelectMenuItems(['joints', 'members', 'select', 'erase'], this.eventBrokerService.selectEditMode);
    this.uiStateService.registerToggleMenuItem('animation', this.eventBrokerService.toggleAnimation);
    this.uiStateService.registerToggleMenuItem('animationControls', this.eventBrokerService.toggleAnimationControls);
    this.uiStateService.registerToggleMenuItem('autoCorrect', this.eventBrokerService.toggleAutoCorrect);
    this.uiStateService.registerToggleMenuItem('guides', this.eventBrokerService.toggleGuides);
    this.uiStateService.registerToggleMenuItem('legacyGraphics', this.eventBrokerService.toggleLegacyGraphics);
    this.uiStateService.registerToggleMenuItem('memberList', this.eventBrokerService.toggleMemberTable);
    this.uiStateService.registerToggleMenuItem('memberNumbers', this.eventBrokerService.toggleMemberNumbers);
    this.uiStateService.registerToggleMenuItem('rulers', this.eventBrokerService.toggleRulers);
    this.uiStateService.registerToggleMenuItem('template', this.eventBrokerService.toggleTemplate);
    this.uiStateService.registerToggleMenuItem('titleBlock', this.eventBrokerService.toggleTitleBlock);
    this.uiStateService.registerToggleMenuItem('tools', this.eventBrokerService.toggleTools);
  }
}
