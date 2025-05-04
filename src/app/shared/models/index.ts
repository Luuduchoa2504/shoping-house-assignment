import { FormControl } from '@angular/forms';

export class InputTextCustomConfig {
  isUsingInput: boolean = true;
  formControl: FormControl = new FormControl(null);
  label: string = '';
  placeholder: string = '';
  isShowError: boolean = true;
  isRequired: boolean = true;
  numbersOnly: boolean = false;
  percentageInput: boolean = false;
  isHaveSuffix: boolean = false;
  suffixValue: string = '';

  constructor(params = {} as InputTextCustomConfig) {
    Object.assign(this, params);
    return this;
  }
}
