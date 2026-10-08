import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  MockUserResponse,
  ProfileInformationResponse,
  UpdatableField,
} from './profile-information.interfaces';
import {
  BehaviorSubject,
  from,
  catchError,
  delay,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { normalizePhone } from '../../../utils/normalization';
import { AuthService } from '../auth/auth';
import { PasswordChangeRequest } from './profile-information.interfaces';


@Injectable({ providedIn: 'root' })
export class ProfileInformationService {
  //Http Client used to manage requesting and receiving responses from mock data in json file
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  //Current user logged in, used to track state inside service
  private readonly currentUserSubject = new BehaviorSubject<ProfileInformationResponse | null>(null);

  //Public Observable user for view to use, converts Mock User with password
  //To ProfileInformationResponse with none
  readonly currentUser$: Observable<ProfileInformationResponse | null> = this.currentUserSubject
    .asObservable()
    .pipe(map((user) => (user ? { ...user } : null)));

  private dataUrl: string = '/mock-data/users.json';
  private loadTime: number = 500;

  constructor() {}

  //For now, load first user in users, try to link with auth service later
  initCurrentUser(userName: string): Observable<ProfileInformationResponse> {
    const user = this.auth.currentUser;
    if (!user || user.userName !== userName) {
      this.currentUserSubject.next(null);
      return throwError(() => new Error('Please sign in to view your profile settings.'));
    }
    return of({ ...user }).pipe(tap((profile) => this.currentUserSubject.next(profile)));
  }

  //Method used to load data of users from given url
  private loadUsers(): Observable<MockUserResponse[]> {
    return this.http.get<MockUserResponse[]>(this.dataUrl).pipe(
      map((response) => {
        //Check if response given is empty, if so throw a new error
        if (!response) {
          throw new Error('Empty User Dataset. Could not load.');
        }
        return response;
      }),
      //If any errors occur catch them and rethrow to display on page
      catchError((error: HttpErrorResponse | Error) => {
        //If the error message is an Http error, grab error code and the message
        //If not grab message from error
        const errorMessage: string =
          error instanceof HttpErrorResponse
            ? `Error Status Code: ${error.status} - ${error.message}`
            : error.message;

        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  //Returns Observable of current user's profile information
  getProfileInformation(): Observable<ProfileInformationResponse> {
    return of(null).pipe(
      //Used to simulate loading
      delay(this.loadTime),
      //Switch Map Method used for make new observable if in middle of request and
      //user types more input/changes field
      switchMap(() => {
        const currentUser = this.currentUserSubject.value;
        if (!currentUser) {
          return throwError(() => new Error('Could not load account data. Please try again.'));
        }
        return of({ ...currentUser });
      }),
    );
  }

  //For fields that are not the password, check for uniqueness in database (email, phone)
  //preform update if all checks are validated.
  updateProfileField<K extends UpdatableField>(field: K, value: ProfileInformationResponse[K]) {
    return of(null).pipe(
      delay(this.loadTime),
      switchMap(() => {
        const currentUser = this.currentUserSubject.value;

        //If can not load the data of the current user throw an error.
        if (!currentUser) {
          return throwError(() => new Error('Could not load account data. Please try again.'));
        }

        //If the fields do not require regular expression validation then skip step.
        if (field !== 'email' && field !== 'phone') {
          return of({ currentUser, resolvedUsers: [] as MockUserResponse[] });
        }

        //Continue on to validation check
        return this.loadUsers().pipe(map((resolvedUsers) => ({ currentUser, resolvedUsers })));
      }),

      //Check validate for unique email and phone number
      switchMap(({ currentUser, resolvedUsers }) => {
        return this.checkForDuplicatePhoneOrEmail(field, value, currentUser, resolvedUsers).pipe(
          map(() => ({ currentUser, resolvedUsers })),
        );
      }),

      //Preform update on data if passes validation
      map(({ currentUser, resolvedUsers }) => {
        const updatedData: Partial<ProfileInformationResponse> = {};

        //Normalize email/phone fields before saving data
        if (field === 'email') {
          updatedData.email = (value as string).trim().toLowerCase();
        } else if (field === 'phone') {
          updatedData.phone = normalizePhone(value as string);
        } else {
          updatedData[field] = value;
        }

        //Merge current user data with updated data
        const updatedUser: ProfileInformationResponse = {
          ...currentUser,
          ...updatedData,
        };

        //Broadcast new updates to application
        this.currentUserSubject.next(updatedUser);
        //Return updated user profile information
        return { ...updatedUser } as ProfileInformationResponse;
      }),
    );
  }

  //Helper method used to check if email or phone number is taken in database
  private checkForDuplicatePhoneOrEmail<K extends UpdatableField>(
    field: K,
    value: ProfileInformationResponse[K],
    currentUser: ProfileInformationResponse,
    resolvedUsers: MockUserResponse[],
  ): Observable<void> {
    if (field === 'email') {
      //Get requested updated email and original email
      const newEmail = (value as string).trim().toLowerCase();
      const currentEmail = currentUser.email.trim().toLowerCase();

      //Check if user edited existing email, if so check for uniqueness in database
      if (newEmail !== currentEmail) {
        const emailExists = resolvedUsers.some(
          (user) => user.email.trim().toLowerCase() === newEmail,
        );
        if (emailExists) {
          return throwError(() => new Error('This email is already taken.'));
        }
      }
    }

    //Check if user edited existing phone number, if so check for uniqueness in database
    //Use normalization method to compare actual digits and use to update value in database
    if (field === 'phone') {
      //Get requested updated phone and original phone
      const newPhone = normalizePhone(value as string);
      const currentPhone = normalizePhone(currentUser.phone);

      //Check if user edited existing phone, if so check for uniqueness in database
      if (newPhone !== currentPhone) {
        const phoneExists = resolvedUsers.some((user) => normalizePhone(user.phone) === newPhone);
        if (phoneExists) {
          return throwError(() => new Error('This phone number is already taken.'));
        }
      }
    }

    // Return empty success observable if validation passes or isn't needed
    return of(void 0);
  }

  //Used specifically with patch requests for /profile-settings/password
  updatePassword(request: PasswordChangeRequest): Observable<void> {
    return from(this.auth.changePassword(request));
  }
}
