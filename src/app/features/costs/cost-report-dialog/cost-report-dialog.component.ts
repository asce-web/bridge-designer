import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { BridgeCostService } from './bridge-cost.service';
import { BridgeCostModel } from '../../../shared/classes/bridge-cost.model';
import { COUNT_FORMATTER, DOLLARS_FORMATTER } from '../../../shared/classes/utility';

@Component({
  selector: 'cost-report-dialog',
  standalone: true,
  imports: [CommonModule, jqxButtonModule, jqxWindowModule],
  templateUrl: './cost-report-dialog.component.html',
  styleUrl: './cost-report-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostReportDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  readonly costs: BridgeCostModel;
  readonly toDollars = DOLLARS_FORMATTER.format;
  readonly toCount = COUNT_FORMATTER.format;

  constructor(
    private readonly eventBrokerService: EventBrokerService,
    bridgeCostService: BridgeCostService,
  ) {
    this.costs = bridgeCostService.createBridgeCostModel();
  }

  dialogOpenHandler(): void {
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.costReportRequest.subscribe(_eventInfo => this.dialog.open());
  }
}
