import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { pinPattern } from '../../../../utils/regExps';
import {NavigationBar} from '../../shared/navigation-bar/navigation-bar'
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

type DialogState = 'none' | 'prompt' | 'congratulate';
type Account = { name: string; apy: string; };
type Approval = { approved: boolean; acctNum: string; };
type newAcctRq = { owner: string; accountName: string; accountType: string; pin: string };

@Component({
  imports: [ AsyncPipe, NavigationBar ],
  selector: 'app-create-account',
  styleUrl: './create-account.css',
  templateUrl: './create-account.html',
})
export class CreateAccount implements OnInit {
  private dialog = new BehaviorSubject<DialogState>('none');
  dialog$: Observable<DialogState> = this.dialog.asObservable();

  accounts$!: Observable<Account[]>;
  certificateDeposits$!: Observable<Account[]>;
  
  waiting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  waiting$: Observable<boolean> = this.waiting.asObservable();

  selected?: string;
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.accounts$ = this.http.get<Account[]>('/mock-data/accountTypes.json');
    this.certificateDeposits$ = this.http.get<Account[]>('/mock-data/certificatesDeposit.json');
  }

  continueCreation() {
    this.dialog.next('prompt');
  }

  closeDialog() {
    this.dialog.next('none');
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  async newAccount(pin: HTMLInputElement, acctName: HTMLInputElement) {
    if (!pinPattern.test(pin.value)) {
    document.getElementById("pinWarning")!.innerText =
      "A four-digit number is required.";
    } else {
      const accessToken = null;
      const header = new HttpHeaders({ Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }); 

      this.waiting.next(true);
      await this.delay(500);
      let rq : newAcctRq = {owner: "", accountName: acctName.value, accountType: this.selected!, pin: pin.value};

      this.http.post<Approval>("/mock-data/new-account.json", rq, {headers: header}).subscribe(r => 
        { this.dialog.next(r.approved ? 'congratulate' : 'prompt');
          this.waiting.next(false) });
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

    let selectedBtn = null;
    for(let i = 0; i < radios.length; i++) {
      if(radios[i].checked === true) { selectedBtn = radios[i]; this.selected = radios[i].innerText.split(",")[0]; }
      let parent = radios[i].parentElement;
      if(parent !== null) {
        parent.style.backgroundColor = "white";
      }
    }

    let parent = selectedBtn?.parentElement;
    parent!.style.backgroundColor = "#9a5833";
    parent!.style.color = "white";
  }
}
