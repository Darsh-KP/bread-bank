import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-create-account',
  styleUrl: './create-account.css',
  templateUrl: './create-account.html',
})
export class CreateAccount {
  accounts = [{
    name: 'Plain checking'
  }, {
    name: 'Sourdough savings'
  }];

  certificateDeposits = [{
    name: "Three-month 3.0% APY"
  }, {
    name: "Six-month 3.1% APY"
  }];

  clearSelection() {
    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][name="product"]');

    radios.forEach(element => element.checked = false);

    let clsBtn = <HTMLInputElement> document.getElementById('clsBtn');
    let contBtn = <HTMLInputElement> document.getElementById('contBtn');
    clsBtn.disabled = true;
    contBtn.disabled = true;
  }
}
