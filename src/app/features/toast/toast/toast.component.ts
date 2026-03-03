/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChildren } from '@angular/core';
import { ToastKind } from './toast-error';
import { EventBrokerService } from '../../../shared/services/event-broker.service';
import { ToastNotificationComponent } from '../toast-notification.component/toast-notification.component';

@Component({
  selector: 'toast',
  imports: [ToastNotificationComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements AfterViewInit {
  @ViewChildren(ToastNotificationComponent) notifications!: QueryList<ToastNotificationComponent>;

  constructor(private readonly eventBrokerService: EventBrokerService) {}

  public show(kind: ToastKind): void {
    this.notifications.find(notification => notification.kind === kind)?.open();
  }

  ngAfterViewInit(): void {
    this.eventBrokerService.toastRequest.subscribe(info => this.show(info.data));
  }
}
