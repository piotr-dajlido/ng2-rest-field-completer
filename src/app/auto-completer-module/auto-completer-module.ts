import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AutoCompleterDirective} from './auto-completer-directive/auto-completer.directive';
import {AutoCompleterComponent} from './auto-completer-component/auto-completer.component';

@NgModule({
  declarations: [
    // Components
    AutoCompleterComponent,
    // Directives
    AutoCompleterDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  exports: [
    AutoCompleterDirective,
    AutoCompleterComponent
  ],
  entryComponents: [
    AutoCompleterComponent
  ]
})
export class AutoCompleterModule {
}
