import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {InputTextCustomConfig} from '../../models';
import {RequiredPipe} from '../../pipes/require.pipe';

@Component({
  selector: 'app-input-text-custom',
  imports: [
    RequiredPipe
  ],
  templateUrl: './input-text-custom.component.html',
  styleUrl: './input-text-custom.component.scss'
})
export class InputTextCustomComponent {
  private _config: InputTextCustomConfig = new InputTextCustomConfig();

  @Input() set config(data: InputTextCustomConfig) {
    this._config = new InputTextCustomConfig(data); // Cloning to prevent side effects
    this.cdr.markForCheck();
  }

  get config(): InputTextCustomConfig {
    return this._config;
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
