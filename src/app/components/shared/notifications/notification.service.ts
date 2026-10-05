import { Service, signal } from '@angular/core';
import { Notification, NotificationType } from './notification.types';

@Service()
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  private add(message: string, type: NotificationType, delay?: number): void {
    const notification: Notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      delay: delay ?? 5000,
    };

    this._notifications.update((current) => [...current, notification]);
  }

  remove(notification: Notification): void {
    this._notifications.update((current) => current.filter((n) => n.id !== notification.id));
  }

  clear() {
    this._notifications.set([]);
  }

  info(message: string, delay?: number): void {
    this.add(message, 'info', delay);
  }

  success(message: string, delay?: number): void {
    this.add(message, 'success', delay);
  }

  warning(message: string, delay?: number): void {
    this.add(message, 'warning', delay);
  }

  error(message: string, delay?: number): void {
    this.add(message, 'error', delay);
  }
}
