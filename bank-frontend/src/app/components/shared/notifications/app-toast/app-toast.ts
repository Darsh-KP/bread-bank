import { Component, inject } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbToast],
  selector: 'app-toast',
  styleUrl: './app-toast.css',
  templateUrl: './app-toast.html',
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200'
  },
})
export class AppToast {
  readonly notificationService = inject(NotificationService);
}
