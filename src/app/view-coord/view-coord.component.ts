import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Util } from '../util.model';

@Component({
  selector: 'app-view-coord',
  templateUrl: './view-coord.component.html',
  styleUrls: ['./view-coord.component.css']
})
export class ViewCoordComponent implements OnInit {

  @Input() coord?: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() open = new EventEmitter<Util>();

  viewMapping:
      {[k: string]: string} = {'=0': 'No Views', '=1': '1 View', 'other': '# Views'};
  saleMapping:
      {[k: string]: string} = {'=0': 'No Sales', '=1': '1 Sale', 'other': '# Sales'};
  
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  openDialog(){
    this.open.emit(this.coord!.app)
    // this.close.emit(true)
    this.cdr.detectChanges()
  }

}
