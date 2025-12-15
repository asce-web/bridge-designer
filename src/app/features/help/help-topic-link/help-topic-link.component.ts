/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrentTopicService } from '../current-topic.service';

@Component({
    selector: 'topic-link',
    imports: [],
    templateUrl: './help-topic-link.component.html',
    styleUrl: './help-topic-link.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpTopicLinkComponent {
  @Input({ required: true }) name!: string;

  constructor(private readonly currentTopicService: CurrentTopicService) {}

  handlePointerDown(event: any) {
    this.currentTopicService.goToTopicId(this.name);
    event.stopPropagation();
  }
}
