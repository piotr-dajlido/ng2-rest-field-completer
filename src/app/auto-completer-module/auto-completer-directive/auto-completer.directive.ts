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
    this.setDataToAutocompleter();
    this.passDataToDestination();
  }

  private close(): void {
    this.autocompleterValue.unsubscribe();
    this.componentRef.destroy();
    this.isOn = false;
  }

  private createComponent(): void {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(AutoCompleterComponent);

    const viewContainerRef = this.destination.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    const destinationControlPosition = this.destination.inputElement.nativeElement.getBoundingClientRect();
    console.log(destinationControlPosition);

    (<AutoCompleterComponent>this.componentRef.instance).top = destinationControlPosition.top
      + destinationControlPosition.height - 2;
    (<AutoCompleterComponent>this.componentRef.instance).left = destinationControlPosition.left + 2;
    (<AutoCompleterComponent>this.componentRef.instance).width = destinationControlPosition.width - 7;
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

  private setDataToAutocompleter(): void {
    this.fetchData().subscribe(data => {
        (<AutoCompleterComponent>this.componentRef.instance).items = data;
    });
  }
  private passDataToDestination(): void {
    this.autocompleterValue = (<AutoCompleterComponent>this.componentRef.instance).value.subscribe((value => {
      this.destination.writeValue(value);
      this.close();
    }));
  }

  private catchKeyboardEvents(): void {

  }

}
