/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HelpIndexService, HelpTopic } from '../indexer/help-index.service';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { Results } from '@orama/orama';
import { CurrentTopicService } from '../current-topic.service';

@Component({
  selector: 'help-search',
  imports: [jqxListBoxModule],
  templateUrl: './help-search.component.html',
  styleUrl: './help-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpSearchComponent {
  private static readonly NOTHING_YET = [{ topic: '', title: 'Nothing so far...' }];
  @ViewChild('searchTermInput') searchTermInput!: ElementRef<HTMLInputElement>;

  source: any = HelpSearchComponent.NOTHING_YET;

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly currentTopicService: CurrentTopicService,
    private readonly helpIndexService: HelpIndexService,
  ) {}

  public clear(): void {
    this.searchTermInput.nativeElement.value = '';
  }
  
  handleSearchTermInputInput(_event: Event): void {
    const searchTerm = this.searchTermInput.nativeElement.value;
    if (searchTerm.length <= 1) {
      this.source = HelpSearchComponent.NOTHING_YET;
    } else {
      const result: Results<HelpTopic> = this.helpIndexService.search(searchTerm);
      this.source =
        result.hits.length === 0
          ? HelpSearchComponent.NOTHING_YET
          : result.hits.map(hit => ({ topicId: hit.id, title: hit.document.title }));
    }
    this.changeDetector.detectChanges();
  }

  handleSearchResultsSelect(event: any) {
    const topicId: string | undefined = event.args.item.originalItem.topicId;
    if (topicId?.length) {
      this.currentTopicService.goToTopicId(topicId);
    }
  }
}
