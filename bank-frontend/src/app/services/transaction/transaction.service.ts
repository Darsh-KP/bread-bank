import { Service, signal } from '@angular/core';
import {VerifyPinRequestDTO} from '../../dtos/transaction/VerifyPinRequestDTO';
import {Observable, of} from 'rxjs';
import {TransactionRequestDTO} from '../../dtos/transaction/TransactionRequestDTO';
import {TransactionResponseDTO} from '../../dtos/transaction/TransactionResponseDTO';

@Service()
export class TransactionService {
  public accountBalanceInCents = signal<number>(284576);

  // TODO
  verifyPin(request: VerifyPinRequestDTO): void {
    // // Success case
    // if (request.pin === '1234') {
    //   return of({
    //     success: true,
    //   }).pipe(delay(800));
    // }
    //
    // // Failure
    // return of({
    //   success: false,
    // }).pipe(delay(800));
  }

  processTransaction(request: TransactionRequestDTO): Observable<TransactionResponseDTO> {
    // Failure case
    if (request.amountInCents > this.accountBalanceInCents()) {
      return of({
        success: false,
        amountInCents: request.amountInCents,
      });
    }

    // Success
    return of({
      success: true,
      amountInCents: request.amountInCents,
    });
  }
}
