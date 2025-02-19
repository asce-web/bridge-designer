import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
import { jqxTreeGridComponent, jqxTreeGridModule } from 'jqwidgets-ng/jqxtreegrid';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';
import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { EventBrokerService, EventInfo } from '../../../shared/services/event-broker.service';
import { BridgeService } from '../../../shared/services/bridge.service';
import { DesignBridgeRenderingService } from '../../../shared/services/design-bridge-rendering.service';
import { DesignJointRenderingService } from '../../../shared/services/design-joint-rendering.service';
import { DesignMemberRenderingService } from '../../../shared/services/design-member-rendering.service';
import { DesignRenderingService } from '../../../shared/services/design-rendering.service';
import { DesignSiteRenderingService } from '../../../shared/services/design-site-rendering.service';
import { ViewportTransform2D } from '../../../shared/services/viewport-transform.service';
import { SelectedElementsService } from '../../drafting/shared/selected-elements-service';
import { DesignIterationService } from '../design-iteration.service';
import { AnalysisService } from '../../../shared/services/analysis.service';

@Component({
  selector: 'design-iteration-dialog',
  standalone: true,
  imports: [jqxButtonModule, jqxListBoxModule, jqxTabsModule, jqxTreeGridModule, jqxWindowModule],
  /** Component-level injections of stateful services. Root versions are hidden. */
  providers: [
    DesignBridgeRenderingService,
    BridgeService,
    DesignJointRenderingService,
    DesignMemberRenderingService,
    DesignRenderingService,
    DesignSiteRenderingService,
    SelectedElementsService,
    ViewportTransform2D,
  ],
  templateUrl: './design-iteration-dialog.component.html',
  styleUrl: './design-iteration-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignIterationDialogComponent implements AfterViewInit {
  private static readonly ITERATION_DATA_FIELDS = [
    { name: 'cost', type: 'number' },
    { name: 'index', type: 'number' },
    { name: 'iterationNumber', type: 'number' },
    { name: 'parentIndex', type: 'number' },
    { name: 'projectId', type: 'string' },
    { name: 'status', type: 'number' },
  ];

  // prettier-ignore
  readonly columns: any[] = [
    { 
      text: 'Status',
      datafield: 'status',
      align: 'left',
      width: 80,
      cellsRenderer: (_row: string, _column: string, value: number, _rowData: any) => {
        const {src, title} = AnalysisService.getStatusIcon(value, true)
        return `<span style="display: inline-block; margin-top: 4px;"><img src="${src}" title="${title}"/><span>`;
      },
    }, {
      text: 'Iteration',
      datafield: 'iterationNumber',
      align: 'center',
      cellsalign: 'center',
      width: 64,
      cellsFormat: 'd',
    }, {
      text: 'Cost',
      datafield: 'cost',
      align: 'center',
      cellsalign: 'right',
      width: 100,
      cellsFormat: 'c2',
    }, {
      text: 'Project ID',
      datafield: 'projectId',
      align: 'center',
      width: 250,
    }
  ];

  // TODO: The tree grid widget alone can't depict the case where a parent has more than one run of 
  // contiguous descendants. We could do this with a special icon or leading graphic character for 
  // the first child of every run.
  readonly source: any = {
    localdata: [],
    datatype: 'array',
    datafields: DesignIterationDialogComponent.ITERATION_DATA_FIELDS,
    hierarchy: {
      keyDataField: { name: 'index' },
      parentDataField: { name: 'parentIndex' },
    },
    id: 'index',
  };
  readonly dataAdapter: any;

  @ViewChild('dialog') dialog!: jqxWindowComponent;
  @ViewChild('tree') tree!: jqxTreeGridComponent;
  @ViewChild('okButton') okButton!: jqxButtonComponent;

  constructor(
    private readonly designIterationService: DesignIterationService,
    private readonly eventBrokerService: EventBrokerService,
  ) {
    this.dataAdapter = new jqx.dataAdapter(this.source);
  }

  dialogOpenHandler(_event: any): void {
    this.designIterationService.refreshOpenInProgress();
    this.source.localdata = this.designIterationService.iterations;
    this.tree.updateBoundData();
    const inProgressId = this.designIterationService.inProgressIndex;
    this.tree.expandRow(inProgressId);
    this.tree.selectRow(inProgressId);
  }

  okClickHandler(): void {
    const selected = this.tree.getSelection()[0];
    if (selected) {
      this.designIterationService.choose(selected.index);
    }
    this.dialog.close();
  }

  handleRowDoubleClick(_event: any): void {
    this.okClickHandler();
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.loadDesignIterationRequest.subscribe((_eventInfo: EventInfo): void => {
      this.dialog.open();
    });
  }
}
