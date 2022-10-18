import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Util } from '../util.model';

@Component({
  selector: 'app-collection-table',
  templateUrl: './collection-table.component.html',
  styleUrls: ['./collection-table.component.css'],
})
export class CollectionTableComponent
  implements OnInit, AfterViewInit, OnChanges
{

  @Input() set utils(utils: Util[]) {

    console.log(utils)
    this.dataSource = new MatTableDataSource<Util>(
      utils
    );
    console.log(this.dataSource)
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator1!;
      this.cdr.detectChanges()
      console.log(this.paginator1)
    }, 200);
  }

  @Input() count: number = 0;
  

  dataSource?: MatTableDataSource<Util>;

  displayedColumns2: string[] = [
    'image',
    'downloads',
    'status',
    'price',
    'chains',
    'action',
  ];

  chains(util: Util) {
    return util.chains.map((c) => c.name).join(', ');
  }

  ngOnChanges() {

    this.cdr.detectChanges();
  }


  @ViewChild(MatPaginator) paginator1?: MatPaginator;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
