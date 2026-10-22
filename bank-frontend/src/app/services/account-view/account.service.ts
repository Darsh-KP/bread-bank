import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountInformationRequestDTO} from '../../dtos/account-view/AccountInformationRequestDTO';
import {catchError, Observable, throwError} from 'rxjs';
import {AccountInformationResponseDTO} from '../../dtos/account-view/AccountInformationResponseDTO';
import {UpdateNicknameRequestDTO} from '../../dtos/account-view/UpdateNicknameRequestDTO';
import {UpdateNicknameResponseDTO} from '../../dtos/account-view/UpdateNicknameResponseDTO';

@Service()
export class AccountService {
  private http = inject(HttpClient);
  private BASE_URL = "http://localhost:8080/account";

  getAccountDetails(
    accountInformationRequestDTO: AccountInformationRequestDTO
  ): Observable<AccountInformationResponseDTO> {
    return this.http.post<AccountInformationResponseDTO>(this.BASE_URL, accountInformationRequestDTO).pipe(
      catchError(() => {
        return throwError(() => new Error('An unexcepted error occurred.'))
      })
    );
  }

  updateAccountNickname(
    updateAccountNicknameRequestDTO: UpdateNicknameRequestDTO
  ): Observable<UpdateNicknameResponseDTO> {
    return this.http.patch<UpdateNicknameResponseDTO>(`${this.BASE_URL}/nickname`, updateAccountNicknameRequestDTO).pipe(
      catchError(() => {
        return throwError(() => new Error('An unexcepted error occurred.'))
      })
    );
  }
}
