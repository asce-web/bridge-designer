import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicNameDirective } from './topic-name.directive';
import { HelpTopicLinkComponent } from '../help-topic-link/help-topic-link.component';
import { HelpPopupTopicComponent } from '../help-topic-popup/help-topic-popup.component';
import { CurrentTopicService } from '../current-topic.service';

@Component({
  selector: 'help-topic',
  imports: [CommonModule, HelpPopupTopicComponent, HelpTopicLinkComponent, TopicNameDirective],
  templateUrl: './help-topic.component.html',
  styleUrl: './help-topic.component.css',
})
export class HelpTopicComponent implements AfterViewInit, OnChanges {
  @Input() containerType: 'pane-content' | 'popup-content' = 'pane-content';
  @Input() visibleTopicId: string = CurrentTopicService.DEFAULT_TOPIC_ID;

  @ViewChild('defaultTopic', { static: true }) visibleTopic: TemplateRef<any> | null = null;
  @ViewChild('topicContainer') topicContainer!: ElementRef<HTMLDivElement>;

  @ViewChildren(TopicNameDirective) topicNames!: QueryList<TopicNameDirective>;

  constructor(private readonly currentTopicService: CurrentTopicService) {}

  /** Goes to specified topic. Called by links in component HTML. */
  goToTopic(topicId: string) {
    this.currentTopicService.goToTopicId(topicId);
  }

  private showTopic(topicId: string, scrollTop?: number): void {
    if (!this.topicNames) {
      return;
    }
    const directive = this.topicNames.find((directive, _index, _allNames) => directive.name === topicId);
    if (!directive) {
      return;
    }
    this.visibleTopicId = topicId;
    this.visibleTopic = directive.templateRef;
    if (scrollTop !== undefined) {
      setTimeout(() => {
        this.topicContainer.nativeElement.scrollTop = scrollTop;
      });
    }
  }

  private get scrollTop(): number {
    return this.topicContainer.nativeElement.scrollTop;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['visibleTopicId'];
    if (change) {
      this.showTopic(change.currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.showTopic(this.visibleTopicId);
    if (this.containerType === 'pane-content') {
      this.currentTopicService.scrollTopCallback = () => this.scrollTop;
      this.currentTopicService.currentTopicIdChange.subscribe(({ topicId, scrollTop }) => {
        this.showTopic(topicId, scrollTop);
      });
    }
  }
}
