import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-auto-completer',
  templateUrl: 'auto-completer.component.html',
  styleUrls: ['auto-completer.component.scss']
})
export class AutoCompleterComponent implements OnDestroy {

  public value: Subject<string> = new Subject();

  _items: Array<{ label: string, selected: boolean }> = [];
  set items(v: any[]) {
    if (v.length < 1) {
      this._items = [{
        label: 'Brak Wyników', selected: false
      }];
    } else {
      this._items = v.map(value => {
        return {
          label: value, selected: false
        }
      });
    }
    this.height = this.items.length * ((this.itemPadding * 2) + this.itemHeight);
  }

  get items(): any[] {
    return this._items;
  }

  _choosen: number = -1;
  set choosen(v) {
    if (v > -1 && v < this._items.length) {
      this.items.forEach(item => {
        item.selected = false;
      });
      this.items[v].selected = true;
      this._choosen = v;
    }
  }

  get choosen() {
    return this._choosen;
  }


  itemHeight: number = 10;
  itemPadding: number = 4;

  width: number = 100;
  top: number = 0;
  left: number = 0;
  height: number = this.items.length * ((this.itemPadding * 2) + this.itemHeight);


  constructor(public elementRef: ElementRef) {
  }

  ngOnDestroy(): void {
    this.value.complete();
  }

  private onItemClick($event) {
    this.value.next($event.target.innerText);
  }

  private onItemMouseenter($event){
    this.choosen = +$event.target.getAttribute("index");
  }

  public select(): void {
    this.value.next(this.items[this.choosen].label);
  }
}
