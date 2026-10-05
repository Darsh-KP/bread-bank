import { Service, signal } from '@angular/core';
import { Notification, NotificationType } from './notification.types';

@Service()
export class NotificationService {
  private _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  private add(message: string, type: NotificationType): void {
    const notification: Notification = {
      id: Date.now(),
      message,
      type,
    };

    this._notifications.update((currentNotifications) => [...currentNotifications, notification]);
  }

  remove(id: number): void {
    this._notifications.update((notifications) =>
      notifications.filter(notification => notification.id !== id)
    );
  }

  success(message: string) {
    this.add(message, 'success');
  }

  info(message: string) {
    this.add(message, 'info');
  }

  error(message: string) {
    this.add(message, 'error');
  }
}
