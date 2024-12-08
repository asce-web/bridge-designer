import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { jqxDropDownListComponent, jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';
import { InventoryService, StockId } from '../../services/inventory.service';
import { EventBrokerService, EventOrigin } from '../../services/event-broker.service';

@Component({
  selector: 'inventory-selector',
  standalone: true,
  imports: [
    jqxDropDownListModule,
  ],
  templateUrl: './inventory-selector.component.html',
  styleUrl: './inventory-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventorySelectorComponent implements AfterViewInit {
  @Input({ required: true }) vertical: boolean = false;
  @Input() eventOrigin: number = EventOrigin.TOOLBAR;
  @ViewChild('materialSelector') materialSelector!: jqxDropDownListComponent;
  @ViewChild('crossSectionSelector') crossSectionSelector!: jqxDropDownListComponent;
  @ViewChild('sizeSelector') sizeSelector!: jqxDropDownListComponent;

  readonly height: number = 28;
  readonly materialSelectorWidth: number = 206;

  constructor(
    readonly inventoryService: InventoryService,
    private readonly eventBrokerService: EventBrokerService,
  ) { }

  get crossSectionSelectorWidth(): number {
    return this.vertical ? 206 : 106;
  }

  get sizeSelectorWidth(): number {
    return this.vertical ? 206 : 106;
  }

  handleMaterialSelectorOnChange(_event: any): void {
    if (_event.args.type !== 'mouse') {
      return;
    }
    this.sendStockId();
  }

  handleCrossSectionSelectorOnChange(event: any): void {
    this.sizeSelector.source(this.inventoryService.getShapes(event.args.index));
    if (event.args.type !== 'mouse') {
      return;
    }
    this.sendStockId();
  }

  handleSizeSelectorOnChange(_event: any): void {
    if (_event.args.type !== 'mouse') {
      return;
    }
    this.sendStockId();
  }

  private sendStockId(): void {
    this.eventBrokerService.changeInventorySelection.next({
      source: this.eventOrigin,
      data: new StockId(
        this.materialSelector.selectedIndex(),
        this.crossSectionSelector.selectedIndex(),
        this.sizeSelector.selectedIndex()),
    });
  }

  ngAfterViewInit(): void {
    const that = this;
    this.eventBrokerService.loadInventorySelectorRequest.subscribe(eventInfo => {
      const stockId = eventInfo.data as StockId;
      that.materialSelector.selectIndex(stockId.materialIndex);
      that.crossSectionSelector.selectIndex(stockId.sectionIndex);
      that.sizeSelector.selectIndex(stockId.sizeIndex);
    });
  }
}
