import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { jqxTreeComponent, jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { CurrentTopicService } from '../current-topic.service';

@Component({
  selector: 'help-nav-tree',
  imports: [jqxTreeModule],
  templateUrl: './help-nav-tree.component.html',
  styleUrl: './help-nav-tree.component.scss',
})
export class HelpNavTreeComponent implements AfterViewInit {
  @ViewChild('navTree') navTree!: jqxTreeComponent;

  constructor(private readonly currentTopicService: CurrentTopicService) {}

  handleSelect(event: any): void {
    const topicId = event.args.element.id;
    this.currentTopicService.goToTopicId(topicId);
  }

  private selectTopicId(topicId: string): void {
    const domItem = document.getElementById(topicId);
    this.navTree.selectItem(domItem);
    this.navTree.ensureVisible(domItem);
  }

  ngAfterViewInit(): void {
    this.currentTopicService.currentTopicIdChange.subscribe(info => this.selectTopicId(info.topicId));
    const openFolders: NodeList = this.navTree.elementRef.nativeElement.querySelectorAll('li.open');
    openFolders.forEach(folder => this.navTree.expandItem(folder));
  }
}
