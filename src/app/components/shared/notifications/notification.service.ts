import { Service, signal } from '@angular/core';
import { Notification, NotificationType } from './notification.types';

@Service()
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  private add(message: string, type: NotificationType): void {
    const notification: Notification = {
      id: Date.now(),
      message,
      type,
    };

    this.notifications.update((currentNotifications) => [...currentNotifications, notification]);
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
