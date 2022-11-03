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
  @Output() clicked = new EventEmitter<{ app: Util; index: number, mode: number }>();

  @Input() set utils(utils: Util[]) {
    this.dataSource = new MatTableDataSource<Util>(utils);
    console.log(this.dataSource);
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator1!;
      this.cdr.detectChanges();
    }, 200);
  }

  @Input() count: number = 0;

  open(
    app: Util,
    index: number = (this.dataSource?.data ?? []).findIndex(
      (d) => d.id == app.id
    ),
    mode = 0
  ) {
    this.clicked.emit({ app, index, mode });
  }


  dataSource?: MatTableDataSource<Util>;

  displayedColumns2: string[] = [
    'image',
    'downloads',
    'price',
    'chains',
    'status',
    'action'
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
