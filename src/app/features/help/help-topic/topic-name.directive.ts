/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Directive, Input, TemplateRef } from '@angular/core';

/**
 * Workaround for TemplateRef providing no access to injection tag.
 *
 * Usage: <ng-template topic-name="foo">...</ng-template>
 * 
 * Then this.name will contain 'foo' and this.templateRef will point to the template.
 */
@Directive({
  // TODO: Change this to topic-id for consistency.
  selector: '[topic-name]',
  standalone: true,
})
export class TopicNameDirective {
  constructor(public readonly templateRef: TemplateRef<any>) {}
  @Input('topic-name') name!: string;
}
