import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbToast],
  selector: 'app-toast',
  styleUrl: './app-toast.css',
  templateUrl: './app-toast.html',
})
export class AppToast {
  readonly notificationService = inject(NotificationService);
}
