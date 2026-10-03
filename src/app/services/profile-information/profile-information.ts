import { Injectable } from '@angular/core';
import { normalizePhone } from '../../../utils/normalization';

export interface ProfileInformation {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const MOCK_DATABASE: ProfileInformation[] = [
  {
    userName: 'itsYaBreadBoi',
    firstName: 'Iakkhos',
    lastName: 'Baker',
    email: 'paladinOfCrust@bmail.com',
    phone: '1234567890',
  },
  {
    userName: 'yeasterSunday',
    firstName: 'Larkin',
    lastName: 'Naan',
    email: 'fallenBread@bmail.com',
    phone: '0000000000',
  },
];

//Uses mock database, replace with api calls to GET /profile-settings
//and PATCH /profile-settings/{field}
@Injectable({ providedIn: 'root' })
export class ProfileInformationService {
  private currentUser: ProfileInformation = { ...MOCK_DATABASE[0] };

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getProfileInformation(): Promise<ProfileInformation> {
    await this.delay(500);
    return { ...this.currentUser };
  }

  async updateProfileInformation(
    patch: Partial<Omit<ProfileInformation, 'userName'>>,
  ): Promise<ProfileInformation> {
    await this.delay(500);

    const updatedData: Partial<ProfileInformation> = { ...patch };

    // Email Check
    if (patch.email) {
      const newEmail = patch.email.trim().toLowerCase();
      const currentEmail = this.currentUser.email.trim().toLowerCase();

      if (newEmail !== currentEmail) {
        const emailExists = MOCK_DATABASE.some(
          (user) => user.email.trim().toLowerCase() === newEmail,
        );
        if (emailExists) {
          throw new Error('This email is already taken.');
        }
      }
    }

    // Phone Check
    if (patch.phone) {
      const newPhone = normalizePhone(patch.phone);
      const currentPhone = normalizePhone(this.currentUser.phone);

      if (newPhone !== currentPhone) {
        const phoneExists = MOCK_DATABASE.some((user) => normalizePhone(user.phone) === newPhone);
        if (phoneExists) {
          throw new Error('This phone number is already taken.');
        }
      }

      updatedData.phone = newPhone;
    }

    // Save
    this.currentUser = {
      ...this.currentUser,
      ...updatedData,
    };

    return { ...this.currentUser };
  }
}

