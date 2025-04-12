import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { jqxListBoxComponent, jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { HELP_INDEX_DATA } from '../indexer/index-data';
import { CurrentTopicService } from '../current-topic.service';

@Component({
  selector: 'help-topic-list',
  imports: [jqxListBoxModule],
  templateUrl: './help-topic-list.component.html',
  styleUrl: './help-topic-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpTopicListComponent implements AfterViewInit {
  @ViewChild('topicListBox') topicListBox!: jqxListBoxComponent;

  readonly source: any = HELP_INDEX_DATA;

  constructor(private readonly currentTopicService: CurrentTopicService) {}

  handleTopicSelect(event: any) {
    const topicId: string = event.args.item.originalItem.id;
    this.currentTopicService.goToTopicId(topicId);
  }

  /** Workaround for jqxListbox height calc failing when performed in non-visible tab. */
  public refresh(): void {
    this.topicListBox.render();
    this.selectTopicId(this.currentTopicService.currentTopicId);
  }

  private selectTopicId(topicId: string): void {
    const index = HELP_INDEX_DATA.findIndex(value => value.id === topicId);
    if (index >= 0) {
      this.topicListBox.ensureVisible(index);
      this.topicListBox.selectedIndex(index);
    }
  }

  ngAfterViewInit(): void {
    this.currentTopicService.currentTopicIdChange.subscribe(info => this.selectTopicId(info.topicId));
  }
}
