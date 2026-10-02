import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'editable-label',
  imports: [FormsModule],
  standalone: true,
  template: `
    <section>
      <label>{{ label }}</label>
      <input [type]='type' [(ngModel)]='value' [readonly]='isReadOnly' />
      <button type='button' (click)='toggleEdit()'>
        {{ isReadOnly ? 'Edit' : 'Save' }}
      </button>

      @if (displayToast) {
        <div>
          <span>{{ errorMessage || 'Invalid input format' }}</span>
          <button type='button' (click)='dismissToastError()'>✕</button>
        </div>
      }
    </section>`,
})
export class EditableLabelComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() type: 'text' | 'email' | 'tel' = 'text';
  @Input() pattern?: string | RegExp;
  @Input() errorMessage: string = '';
  @Output() valueChange: EventEmitter<string> = new EventEmitter();

  isReadOnly: boolean = true;
  displayToast: boolean = false;
  private toastTimeout?: ReturnType<typeof setTimeout>;
  private toastTimeoutVal = 3000;

  //Method for making corresponding text field editable
  //If user input is invalid, message is displayed and changes are not saved.
  toggleEdit(): void {
    if (!this.isReadOnly) {
      //If input is not validate immediately return
      if (!this.validate()) {
        this.displayToastError();
        return;
      }
      this.isReadOnly = true;
      this.dismissToastError();
      //Notify that value has changed.
      this.valueChange.emit(this.value);
      return;
    }

    this.isReadOnly = false;
    this.dismissToastError();
  }

  //Checks if user input matches regular expression or if field is not empty
  private validate(): boolean {
    //Always return true for non-empty non-email/phone fields
    if (!this.pattern){
      return this.value.length > 0;
    }

    //Get rid of leading white space
    let val = (this.value ?? '').trim();

    // Strip spaces, dashes, and parens for phone numbers before regex evaluation
    if (this.type === 'tel') {
      val = val.replace(/[\s\(\)\-]/g, '');
    }

    const regExp = typeof this.pattern === 'string' ? new RegExp(this.pattern) : this.pattern;

    return regExp.test(val);
  }

  //Display toast error message for timeout duration
  private displayToastError(): void {
    this.displayToast = true;
    if (this.toastTimeout)
      clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.displayToast = false;
    }, this.toastTimeoutVal);
  }

  //Dismiss toast error message
  dismissToastError(): void {
    this.displayToast = false;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
}
