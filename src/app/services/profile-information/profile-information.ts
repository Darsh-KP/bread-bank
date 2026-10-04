import { Injectable } from '@angular/core';
import { normalizePhone } from '../../../utils/normalization';

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

const MOCK_DATABASE: MockUser[] = [
  {
    userName: 'itsYaBreadBoi',
    firstName: 'Iakkhos',
    lastName: 'Baker',
    email: 'paladinOfCrust@bmail.com',
    phone: '1234567890',
    passwordHash: 'myPassword123!',
  },
  {
    userName: 'yeasterSunday',
    firstName: 'Larkin',
    lastName: 'Naan',
    email: 'fallenBread@bmail.com',
    phone: '0000000000',
    passwordHash: 'myPassword123!',
  },
];

export type UpdatableField = keyof Omit<ProfileInformation, 'userName'>;

//Uses mock database, replace with api calls to GET /profile-settings
//and PATCH /profile-settings/{field}
@Injectable({ providedIn: 'root' })
export class ProfileInformationService {
  private currentUser: MockUser = { ...MOCK_DATABASE[0] };

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getProfileInformation(): Promise<ProfileInformation> {
    await this.delay(500);
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

    const updatedData: Partial<ProfileInformation> = {};

    switch (field) {
      case 'email': {
        const rawEmail = value as string;
        const newEmail = rawEmail.trim().toLowerCase();
        const currentEmail = this.currentUser.email.trim().toLowerCase();

        if (newEmail !== currentEmail) {
          const emailExists = MOCK_DATABASE.some(
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
          const phoneExists =
            MOCK_DATABASE.some((user) => normalizePhone(user.phone) === newPhone);
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

