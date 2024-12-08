import { 
  AfterViewInit,
  ChangeDetectionStrategy, 
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { jqxListBoxComponent, jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxWindowComponent, jqxWindowModule } from 'jqwidgets-ng/jqxwindow';

@Component({
  selector: 'undo-redo-dropdown',
  standalone: true,
  imports: [
    jqxWindowModule,
    jqxListBoxModule,
  ],
  templateUrl: './undo-redo-dropdown.component.html',
  styleUrl: './undo-redo-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UndoRedoDropdownComponent implements AfterViewInit{
  @Input('items') items: string[] = ['empty'];
  @Input('operation') operation: string = 'Undo';
  @ViewChild('dropdown', { static: true}) dropdown!: jqxWindowComponent;
  @ViewChild('listBox', { static: true}) listBox!: jqxListBoxComponent;

  public open() {
    this.dropdown.open();
  }

  public close() {
    this.dropdown.close();
  }

  handleDropdownOpen(_event: any) {
    this.listBox.refresh();
  }

  handleBindingComplete(_event: any) {
    this.listBox.addItem('Cancel');
  }

  handleChange(event: any) {
    const index = event.args.index;
    const toastIndex = this.items.length;
    this.listBox.updateAt(
      index < toastIndex ? `Undo ${index + 1} commands` : 'Cancel', 
      toastIndex);
  }

  ngAfterViewInit(): void {
    this.listBox.onBindingComplete
  } 
}
