export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  delay?: number;
}
