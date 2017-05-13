import {ComponentFactoryResolver, ComponentRef, Directive, Host, Input, OnInit} from '@angular/core';
import {TextFieldComponent} from '../../text-field-component/text-field.component';
import {AutoCompleterComponent} from '../auto-completer-component/auto-completer.component';
import {AbstractControl, FormGroupDirective} from '@angular/forms';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Directive({
  selector: '[appAutoCompleterDirective]'
})
export class AutoCompleterDirective implements OnInit {

  @Input() sourceUrl: string;
  @Input() destination: TextFieldComponent;
  @Input() formControlName: string;
  source: AbstractControl;

  private isOn: boolean = false;

  private componentRef: ComponentRef<AutoCompleterComponent>;
  private autocompleter: AutoCompleterComponent;
  private autocompleterValue: Subscription;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver,
              @Host() private hostFormGroup: FormGroupDirective,
              private http: Http) {
    console.log(this.destination);
  }

  ngOnInit(): void {
    this.source = this.hostFormGroup.form.get(this.formControlName);
    this.source.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.open();
      } else if (this.isOn) {
        this.close();
      }
    });
  }

  private open(): void {
    this.isOn = true;
    this.createComponent();
    this.passDataToAutocompleter();
    this.passDataToDestination();
    this.catchKeyboardEvents();
    this.catchMouseEvents();
  }

  private close(): void {
    this.autocompleterValue.unsubscribe();
    this.componentRef.destroy();
    this.releaseEvents();
    this.isOn = false;
  }

  private createComponent(): void {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(AutoCompleterComponent);

    const viewContainerRef = this.destination.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.autocompleter = this.componentRef.instance;
    const destinationControlPosition = this.destination.inputElement.nativeElement.getBoundingClientRect();
    console.log(destinationControlPosition);

    this.autocompleter.top = destinationControlPosition.top
      + destinationControlPosition.height - 2;
    this.autocompleter.left = destinationControlPosition.left + 2;
    this.autocompleter.width = destinationControlPosition.width - 7;
  }

  private fetchData(): Observable<any> {
    return this.http.get(this.sourceUrl + this.source.value, new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }))
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  private passDataToAutocompleter(): void {
    this.fetchData().subscribe(data => {
      this.autocompleter.items = data;
    });
  }

  private passDataToDestination(): void {
    this.autocompleterValue = this.autocompleter.value.subscribe((value => {
      this.destination.writeValue(value);
      this.destination.inputElement.nativeElement.focus();
      this.close();
    }));
  }

  private catchKeyboardEvents(): void {
    document.addEventListener('keydown', this.keyboardDownEvent.bind(this));
  }

  private keyboardDownEvent(e: KeyboardEvent) {
    console.log(e.keyCode);
    if ([37, 38, 39, 40,13].indexOf(e.keyCode) !== -1) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
    if (e.keyCode === 38) {
      this.autocompleter.choosen = this.autocompleter.choosen - 1;
    }
    else if (e.keyCode === 40) {
      this.autocompleter.choosen = this.autocompleter.choosen + 1;
    }
    else if (e.keyCode === 13) {
      this.autocompleter.select();
    }
  }

  private catchMouseEvents(): void {
    document.addEventListener('click', this.mouseOnClick.bind(this));
  }

  private mouseOnClick(e: MouseEvent) {
    if (e.target != this.autocompleter.elementRef.nativeElement) {
      this.close();
    }
  }

  private releaseEvents(): void {
    document.removeEventListener('click', this.mouseOnClick);
    document.removeEventListener('keydown', this.keyboardDownEvent);
  }

}
