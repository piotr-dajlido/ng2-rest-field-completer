import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from '@angular/forms';

const noop = () => {};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextFieldComponent),
  multi: true
};

@Component({
  selector: 'app-text-field',
  templateUrl: 'text-field.component.html',
  styleUrls: ['text-field.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TextFieldComponent implements ControlValueAccessor {

  @Input() maxlength;

  // The internal data model
  private input = new FormControl();

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // get accessor
  get value(): any {
    return this.input.value;
  };

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.input.value) {
      this.input.setValue(v);
      this.onChangeCallback(v);
    }
  }

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.input.value) {
      this.input.setValue(value);
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
