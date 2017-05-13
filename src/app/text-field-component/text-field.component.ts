import {Component, forwardRef, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextFieldComponent),
  multi: true
};

@Component({
  selector: 'app-text-field',
  templateUrl: 'text-field.component.html',
  styleUrls: ['text-field.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],

})
export class TextFieldComponent implements ControlValueAccessor {

  @Input() maxlength;

  // The internal data element
  @ViewChild('inputElement') inputElement;

  // Placeholders for the callbacks which are later provided
  // by the Control Value
  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;
  private _value: any = '';

  constructor(public viewContainerRef: ViewContainerRef) {
  }

  onBlur() {
    this.onTouched();
  }

  get value(): any {
    return this._value;
  };

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: any) {
    this._value = value;
    this.onChange(value);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
