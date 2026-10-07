import { inject, Injectable } from '@angular/core';
import { normalizePhone } from '../../../utils/normalization';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ProfileInformation {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ProfilePasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

// Internal interface extending profile info with mock password for service state
interface MockUser extends ProfileInformation {
  passwordHash: string;
}

export type UpdatableField = keyof Omit<ProfileInformation, 'userName'>;

//Uses mock database, replace with api calls to GET /profile-settings
//and PATCH /profile-settings/{field}
@Injectable({ providedIn: 'root' })
export class ProfileInformationService {
  private readonly http = inject(HttpClient);
  private currentUser: MockUser | null = null;
  private users?: Promise<MockUser[]>;

  //Initial promise of user data being loaded in.
  private initPromise: Promise<void>;

  //Eagerly loads user data upon construction, stores the Promise/result of this
  //for other methods to wait on.
  constructor() {
    this.initPromise = this.loadCurrentUser();
  }

  //Loads the first user from the json mock database.
  private async loadCurrentUser(): Promise<void> {
    try {
      this.users = this.loadUsers();

      const resolvedUser = await this.users;
      if (resolvedUser && resolvedUser.length > 0) {
        this.currentUser = resolvedUser[0];
      }
    } catch (error) {
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //Loads user data from mock json file
  private loadUsers(): Promise<MockUser[]> {
    return (this.users ??= firstValueFrom(this.http.get<MockUser[]>('/mock-data/users.json')).catch(
      () => {
        this.users = undefined;
        throw new Error('Could not load account data. Please try again.');
      },
    ));
  }

  //Returns information of user profile
  async getProfileInformation(): Promise<ProfileInformation> {
    await this.delay(500);

    //Wait for constructor to load in resources.
    await this.initPromise;

    if(!this.currentUser){
      throw new Error('Could not load account data. Please try again.');
    }

    return { ...this.currentUser };
  }

  //Use for patch requests for non password related field changes
  //(First name, last name, email, phone)
  async updateProfileField<K extends UpdatableField>(
    field: K,
    value: ProfileInformation[K],
  ): Promise<ProfileInformation> {
    await this.delay(500);

    // In the future with HttpClient, this endpoint route will be:
    // const url = `/profile-settings/${field}`;

    //Wait for constructor to load in resources.
    await this.initPromise;

    //Throw error if either the current user or mock users data could not be loaded.
    if(!this.currentUser || !this.users){
      throw new Error('Could not load account data. Please try again.');
    }

    const resolvedUsers = await this.users;

    const updatedData: Partial<ProfileInformation> = {};

    switch (field) {
      case 'email': {
        const rawEmail = value as string;
        const newEmail = rawEmail.trim().toLowerCase();
        const currentEmail = this.currentUser.email.trim().toLowerCase();

        if (newEmail !== currentEmail) {
          const emailExists = resolvedUsers.some(
            (user) => user.email.trim().toLowerCase() === newEmail,
          );
          if (emailExists) {
            throw new Error('This email is already taken.');
          }
        }
        updatedData.email = newEmail;
        break;
      }

      case 'phone': {
        const rawPhone = value as string;
        const newPhone = normalizePhone(rawPhone);
        const currentPhone = normalizePhone(this.currentUser.phone);

        if (newPhone !== currentPhone) {
          const phoneExists = resolvedUsers.some((user) => normalizePhone(user.phone) === newPhone);
          if (phoneExists) {
            throw new Error('This phone number is already taken.');
          }
        }
        updatedData.phone = newPhone;
        break;
      }

      default: {
        updatedData[field] = value;
        break;
      }
    }

    // Save mock state
    this.currentUser = {
      ...this.currentUser,
      ...updatedData,
    };

    return { ...this.currentUser };
  }

  //Used specifically with patch requests for /profile-settings/password
  async updatePassword(request: ProfilePasswordChangeRequest): Promise<void> {
    await this.delay(500);

    //Wait for constructor to load in resources.
    await this.initPromise;

    if(!this.currentUser){
      throw new Error('Could not load account data. Please try again.');
    }

    // In future with HttpClient:
    // return firstValueFrom(this.http.patch<void>('/profile-settings/password', request));

    //Verify that provided old password matches mock stored password
    if (request.oldPassword !== this.currentUser.passwordHash) {
      throw new Error('Incorrect current password.');
    }

    //Prevent reusing the current password as the new password
    if (request.oldPassword === request.newPassword) {
      throw new Error('New password cannot be the same as your current password.');
    }

    //Save new password into mock state
    this.currentUser.passwordHash = request.newPassword;
  }
}

