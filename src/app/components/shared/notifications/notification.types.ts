export type NotificationType = 'success' | 'info' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
