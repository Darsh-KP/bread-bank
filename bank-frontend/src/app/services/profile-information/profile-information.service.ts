import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ProfileInformationResponse,
  UpdatableField,
  PasswordChangeRequest,
} from './profile-information.interfaces';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({ providedIn: 'root' })
export class ProfileInformationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  // Current user logged in, used to track state inside service
  private readonly currentUserSubject = new BehaviorSubject<ProfileInformationResponse | null>(null);

  private readonly dataUrl: string = 'http://localhost:8080/profile-settings';

  constructor() {}

  // Initialize or verify current user session
  initCurrentUser(username: string): Observable<ProfileInformationResponse> {
    const user = this.auth.currentUser;
    if (!user || user.username !== username) {
      this.currentUserSubject.next(null);
      return throwError(() => new Error('Please sign in to view your profile settings.'));
    }

    // If user has already been loaded, return existing observable or fetch from backend
    const currentLoadedUser = this.currentUserSubject.value;
    if (currentLoadedUser && currentLoadedUser.username === username) {
      return of(currentLoadedUser);
    }

    return this.getProfileInformation();
  }

  // Fetch current user's profile information from Spring backend GET endpoint
  getProfileInformation(): Observable<ProfileInformationResponse> {
    return this.http.get<ProfileInformationResponse>(this.dataUrl).pipe(
      tap((profile) => {
        if (!profile) {
          throw new Error('Empty User Dataset. Could not load.');
        }
        this.currentUserSubject.next(profile);
      }),
      catchError(this.handleError)
    );
  }

  // Update a specific profile field via PATCH request to /profile-settings/{field}
  updateProfileField<K extends UpdatableField>(
    field: K,
    value: ProfileInformationResponse[K]
  ): Observable<ProfileInformationResponse> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('Could not load account data. Please try again.'));
    }

    // Send payload matching the specific field to backend
    const body = { [field]: value };

    return this.http.patch<ProfileInformationResponse>(`${this.dataUrl}/${field}`, body).pipe(
      tap((updatedUser) => {
        // Broadcast new updates to application state
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(this.handleError)
    );
  }

  // Update password via PATCH request to /profile-settings/password
  updatePassword(request: PasswordChangeRequest): Observable<void> {
    return this.http.patch<void>(`${this.dataUrl}/password`, request).pipe(
      catchError(this.handleError)
    );
  }

  // Centralized HTTP/Error handler helper
  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    const errorMessage: string =
      error instanceof HttpErrorResponse
        ? `Error Status Code: ${error.status} - ${error.message}`
        : error.message;

    return throwError(() => new Error(errorMessage));
  }
}
