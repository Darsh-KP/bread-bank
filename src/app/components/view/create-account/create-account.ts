import { Component } from '@angular/core';

type DialogState = 'none' | 'prompt' | 'congratulate';

@Component({
  imports: [],
  selector: 'app-create-account',
  styleUrl: './create-account.css',
  templateUrl: './create-account.html',
})
export class CreateAccount {
  dialog: DialogState = 'none';
  pin: number = 0;

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

  continueCreation() {
    this.dialog = 'prompt';
  }

  newAccount(pin: HTMLInputElement) {
    if(Number.isNaN(pin)) {
      document.getElementById("pinWarning")!.innerText = "A four-digit number is required.";
    } else {
      this.dialog = 'congratulate';
    }
  }

  clearSelection() {
    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][name="product"]');

    radios.forEach(e => e.checked = false);
    
    const labels = document.querySelectorAll<HTMLElement>(".group");
    labels.forEach(e => e.style.backgroundColor = "white");
    labels.forEach(e => e.style.color = "rgb(154, 88, 51)");
    

    let clsBtn = <HTMLInputElement> document.getElementById('clsBtn');
    let contBtn = <HTMLInputElement> document.getElementById('contBtn');
    clsBtn.style.backgroundColor = "#fffefc";
    clsBtn.style.color = "rgb(154, 88, 51)";
    clsBtn.disabled = true;
    contBtn.style.backgroundColor = "#fffefc";
    contBtn.style.color = "rgb(154, 88, 51)";
    contBtn.disabled = true;
  }

  selectProduct() {
    let clsBtn = <HTMLInputElement> document.getElementById("clsBtn");
    let contBtn = <HTMLInputElement> document.getElementById("contBtn");
    clsBtn.style.backgroundColor = "#77762f";
    clsBtn.style.color = "white";
    clsBtn.disabled = false;
    contBtn.style.backgroundColor = "#77762f";
    contBtn.style.color = "white";
    contBtn.disabled = false;

    const labels = document.querySelectorAll<HTMLElement>(".group");
    labels.forEach(e => e.style.backgroundColor = "white");
    labels.forEach(e => e.style.color = "rgb(154, 88, 51)");

    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][name="product"]');

    let selected = null;

    for(let i = 0; i < radios.length; i++) {
      if(radios[i].checked === true) selected = radios[i];
      let parent = radios[i].parentElement;
      if(parent !== null) {
        parent.style.backgroundColor = "white";
      }
    }

    let parent = selected?.parentElement;
    parent!.style.backgroundColor = "#9a5833";
    parent!.style.color = "white";
  }
}
