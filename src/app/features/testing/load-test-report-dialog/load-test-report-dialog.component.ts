import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { BridgeService } from '../../../shared/services/bridge.service';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import jsPDF from 'jspdf';
import { autoTable, HookData } from 'jspdf-autotable';

@Component({
  selector: 'load-test-report-dialog',
  imports: [CommonModule, jqxWindowModule, jqxButtonModule],
  templateUrl: './load-test-report-dialog.component.html',
  styleUrl: './load-test-report-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadTestReportDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: jqxWindowComponent;
  private changeToken: string = '';

  constructor(
    readonly bridgeService: BridgeService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly eventBrokerService: EventBrokerService,
  ) {}

  handleDialogOpen(): void {
    this.changeToken += 'change';
    this.changeDetector.detectChanges();
    this.changeToken = '';
  }

  handlePrint(): void {
    const doc = new jsPDF({ format: 'letter', orientation: 'portrait' });
    autoTable(doc, {
      html: '.test-report-member-table',
      styles: { fontSize: 8 },
      useCss: true,
      didDrawPage: (data: HookData) => {
        doc.setFontSize(8);
        var pageHeight = doc.internal.pageSize.getHeight();
        doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, pageHeight - 10);
      }
    });
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.analysisReportRequest.subscribe(_eventInfo => this.dialog.open());
  }
}
