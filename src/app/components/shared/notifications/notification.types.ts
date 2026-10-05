export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
  delay?: number;
}
