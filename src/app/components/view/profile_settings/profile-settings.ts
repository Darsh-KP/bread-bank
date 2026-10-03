import { Component, inject, signal } from '@angular/core';
import { EditableLabelComponent } from '../../shared/editable-label.component';
import {
  ProfileInformation,
  ProfileInformationService,
} from '../../../services/profile-information/profile-information';
import { emailPattern, phonePattern } from '../../../../utils/regExps';

@Component({
  imports: [EditableLabelComponent],
  selector: 'app-profile-settings',
  styleUrl: './profile-settings.css',
  templateUrl: './profile-settings.html',
})
export class ProfileSettings {
  private readonly service = inject(ProfileInformationService);

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

  //Explicitly return the promise returned by saveField
  readonly saveFirstName = (val: string): Promise<void> => this.saveField('firstName', val);
  readonly saveLastName = (val: string): Promise<void> => this.saveField('lastName', val);
  readonly saveEmail = (val: string): Promise<void> => this.saveField('email', val);
  readonly savePhone = (val: string): Promise<void> => this.saveField('phone', val);

  //helper method to update a single editable profile field
  private async saveField<K extends keyof Omit<ProfileInformation, 'userName'>>(
    key: K,
    newValue: string,
  ): Promise<void> {
    // Send partial update payload dynamically constructed using target field key.
    // Cast `newValue` to match the expected type for `ProfileInformation[K]`.
    // Note: If `updateProfileInformation` fails (e.g. unique constraint errors for duplicate
    // email/phone), this `await` rejects and re-throws directly to `EditableLabelComponent`'s try/catch.
    const updatedProfile = await this.service.updateProfileInformation({
      [key]: newValue as ProfileInformation[K],
    });

    //On network/validation success: Update reactive `user` signal to re-render parent view.
    this.user.set(updatedProfile);
  }
}
