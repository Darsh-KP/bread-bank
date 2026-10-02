import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditableLabelComponent } from '../../shared/editable-label.component';

@Component({
  imports: [EditableLabelComponent],
  selector: 'app-profile-settings',
  styleUrl: './profile-settings.css',
  templateUrl: './profile-settings.html',
})
export class ProfileSettings {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern = /^\+?[0-9\s.-]{10,15}$/;

  user = {
    firstName: 'Iakkhos',
    lastName: 'Baker',
    email: 'example@example.com',
    phone: '+1-(123)-456-7890',
  };
};
