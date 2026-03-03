import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { jqxNotificationComponent, jqxNotificationModule } from 'jqwidgets-ng/jqxnotification';

@Component({
  selector: 'toast-notification',
  imports: [jqxNotificationModule],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotificationComponent {
  @Input({ required: true }) kind!: string;

  @ViewChild('notification') notification!: jqxNotificationComponent;

  public open() {
    this.notification.open();
  }
}
