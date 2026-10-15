import { Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { EditableLabelComponent } from '../../shared/editable-label/editable-label.component';
import { PasswordChangeModalComponent } from '../../shared/change-password-modal/change-password_modal-component'
import { emailPattern, phonePattern } from '../../../../utils/regExps';
import { NotificationService } from '../../shared/notifications/notification.service';
import { ProfileInformationService } from '../../../services/profile-information/profile-information.service';
import {
  ProfileInformationResponse,
  UpdatableField,
} from '../../../services/profile-information/profile-information.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { NavigationBar } from '../../shared/navigation-bar/navigation-bar';
import { AuthService } from '../../../services/auth/auth';

@Component({
  imports: [EditableLabelComponent, PasswordChangeModalComponent, NavigationBar],
  selector: 'app-profile-settings',
  styleUrl: './profile-settings.css',
  templateUrl: './profile-settings.html',
})
export class ProfileSettings {
  private readonly service = inject(ProfileInformationService);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  //Used to keep memory from leaking when component destroyed
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('passwordModal') private passwordModal!: PasswordChangeModalComponent;

  readonly user = signal<ProfileInformationResponse | null>(null);
  readonly loading = signal(true);
  readonly initialLoadError = signal('');
  readonly errorMessage = 'We could not load your profile settings. Please try logging in.';

  readonly username? : string | undefined = undefined;


  protected readonly emailPattern = emailPattern;
  protected readonly phonePattern = phonePattern;

  constructor() {
    const currentUser = this.authService.currentUser;

    if (!currentUser) {
      this.initialLoadError.set(this.errorMessage);
      this.loading.set(false);
      return;
    }

    this.username = currentUser.username;

    this.service
      .initCurrentUser(this.username)
      .pipe(
        takeUntilDestroyed(this.destroyRef), //Prevents memory leaks when component destroyed
      )
      .subscribe({
        next: (data) => {
          this.user.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.initialLoadError.set(this.errorMessage);
          this.loading.set(false);
        },
      });
  }

  //Opens Model for password change form
  openPasswordModal(): void {
    this.passwordModal.showModal();
  }

  //Have service verify if password meets requirements, if current password matches
  //and if current password and new password do not match
  readonly handlePasswordChange = (payload: {
    oldPassword: string;
    newPassword: string;
  }): Observable<void> => {
    return this.service.updatePassword(payload).pipe(
      //If successful then notify user that password was updated.
      tap(() => {
        this.notifications.success('Password updated successfully!');
      }),
    );
  };

  //Fields in profile settings, now Observables
  readonly saveFirstName = (val: string): Observable<ProfileInformationResponse> =>
    this.saveField('firstName', val);
  readonly saveLastName = (val: string): Observable<ProfileInformationResponse> =>
    this.saveField('lastName', val);
  readonly saveEmail = (val: string): Observable<ProfileInformationResponse> =>
    this.saveField('email', val);
  readonly savePhone = (val: string): Observable<ProfileInformationResponse> =>
    this.saveField('phone', val);

  // Helper method to update a single editable profile field
  private saveField<K extends UpdatableField>(
    key: K,
    newValue: string,
  ): Observable<ProfileInformationResponse> {
    return this.service.updateProfileField(key, newValue as ProfileInformationResponse[K]).pipe(
      tap((updatedProfile) => {
        this.notifications.success('Profile saved successfully.');
        // On success: Update the reactive local `user` signal layout cache
        this.user.set(updatedProfile);
      }),
    );
  }
}


