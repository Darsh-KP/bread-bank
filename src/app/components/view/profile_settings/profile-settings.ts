import { Component, inject, signal, ViewChild } from '@angular/core';
import { EditableLabelComponent } from '../../shared/editable-label/editable-label.component';
import { PasswordChangeModalComponent } from '../../shared/change-password-modal/change-password_modal-component'
import {
  ProfileInformation,
  ProfileInformationService,
  UpdatableField,
} from '../../../services/profile-information/profile-information';
import { emailPattern, phonePattern } from '../../../../utils/regExps';
import { AuthService, RegisteredUser } from '../../../services/auth/auth';
import { NotificationService } from '../../shared/notifications/notification.service';

@Component({
  imports: [EditableLabelComponent, PasswordChangeModalComponent],
  selector: 'app-profile-settings',
  styleUrl: './profile-settings.css',
  templateUrl: './profile-settings.html',
})
export class ProfileSettings {
  private readonly service = inject(ProfileInformationService);
  private readonly notifications = inject(NotificationService);

  @ViewChild('passwordModal') private passwordModal!: PasswordChangeModalComponent;

  readonly user = signal<ProfileInformation | null>(null);
  readonly loading = signal(true);
  readonly initialLoadError = signal('');
  readonly errorMessage = 'We could not load your profile settings. Please try again later.';

  protected readonly emailPattern = emailPattern;
  protected readonly phonePattern = phonePattern;

  constructor() {
    this.service
      .getProfileInformation()
      .then((data) => this.user.set(data))
      .catch(() => this.initialLoadError.set(this.errorMessage))
      .finally(() => this.loading.set(false));
  }

  //Opens Model for password change form
  openPasswordModal(): void {
    this.passwordModal.showModal();
  }

  //Have service verify if password meets requirements, if current password matches
  //and if current password and new password do not match
  readonly handlePasswordChange = async (payload: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await this.service.updatePassword(payload);
    this.notifications.success('Password updated successfully!');
  };

  // Explicitly return the promise returned by saveField
  readonly saveFirstName = (val: string): Promise<void> => this.saveField('firstName', val);
  readonly saveLastName = (val: string): Promise<void> => this.saveField('lastName', val);
  readonly saveEmail = (val: string): Promise<void> => this.saveField('email', val);
  readonly savePhone = (val: string): Promise<void> => this.saveField('phone', val);

  // Helper method to update a single editable profile field
  private async saveField<K extends UpdatableField>(key: K, newValue: string): Promise<void> {
    // Calls updateProfileField passing the field name and raw value.
    // Rejections (e.g. duplicate email/phone errors) will re-throw directly
    // to EditableLabelComponent's try/catch block.
    const updatedProfile = await this.service.updateProfileField(
      key,
      newValue as ProfileInformation[K],
    );

    this.notifications.success('Profile saved successfully.');
    // On success: Update reactive `user` signal to re-render parent view.
    this.user.set(updatedProfile);
  }
}


