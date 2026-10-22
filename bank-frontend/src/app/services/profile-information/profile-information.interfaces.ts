// Interface representing response json from backend api
export interface ProfileInformationResponse {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Interface representing a request to change user's current password
export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

// From ProfileInformationResponse lists all fields that can be updated leaving username out
export type UpdatableField = keyof Omit<ProfileInformationResponse, 'username'>;
