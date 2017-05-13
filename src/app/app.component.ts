import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'REST Field Completer';
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}$')]],
      zipCode2: ['', [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}$')]]
    });
  }
}
