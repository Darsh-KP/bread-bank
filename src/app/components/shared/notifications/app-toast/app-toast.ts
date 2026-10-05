import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbToastModule],
  selector: 'app-app-toast',
  styleUrl: './app-toast.css',
  templateUrl: './app-toast.html',
})
export class AppToast {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;

  removeNotification(id: number): void {
    this.notificationService.remove(id);
  }
}
