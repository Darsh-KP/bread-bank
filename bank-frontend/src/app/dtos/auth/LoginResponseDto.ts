import { UserDto } from "./UserDto";

export interface LoginResponseDto {
  userResponse: UserDto;
  accessToken: string;
}
