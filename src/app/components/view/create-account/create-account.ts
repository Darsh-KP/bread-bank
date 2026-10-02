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

    radios.forEach(e => e.checked = false);
    
    const labels = document.querySelectorAll<HTMLElement>(".group");
    labels.forEach(e => e.style.backgroundColor = "white");
    

    let clsBtn = <HTMLInputElement> document.getElementById('clsBtn');
    let contBtn = <HTMLInputElement> document.getElementById('contBtn');
    clsBtn.style.backgroundColor = "Grey";
    clsBtn.disabled = true;
    contBtn.style.backgroundColor = "Grey";
    contBtn.disabled = true;
  }

  selectProduct() {
    let clsBtn = <HTMLInputElement> document.getElementById("clsBtn");
    let contBtn = <HTMLInputElement> document.getElementById("contBtn");
    clsBtn.style.backgroundColor = "Green";
    clsBtn.disabled = false;
    contBtn.style.backgroundColor = "Green";
    contBtn.disabled = false;

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

    if(selected !== null && selected.parentElement !== null)
      selected.parentElement.style.backgroundColor = "#00ff00";
  }
}
