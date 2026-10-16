import { UserDto } from "./UserDto";

export interface LoginResponseDto {
  userResponse: UserDto;
  jwt: string;
}
