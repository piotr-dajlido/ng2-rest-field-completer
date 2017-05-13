import {Component, ElementRef, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-auto-completer',
  templateUrl: 'auto-completer.component.html',
  styleUrls: ['auto-completer.component.scss']
})
export class AutoCompleterComponent implements OnDestroy{

  public value: Subject<string> = new Subject();

  _items = [];
  set items(v){
    if(v.length < 1){
      this._items = ['Brak Wyników'];
    } else {
      this._items = v;
    }
    this.height = this.items.length * ((this.itemPadding * 2) + this.itemHeight);
  }
  get items(){
    return this._items;
  }

  itemHeight: number = 10;
  itemPadding: number = 4;

  width: number = 100;
  top: number = 0;
  left: number = 0;
  height: number = this.items.length * ((this.itemPadding * 2) + this.itemHeight);


  constructor(private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    this.value.complete();
  }

  private onItemClicked($event){
   this.value.next($event.target.innerText);
  }
}
