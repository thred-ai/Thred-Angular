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

import { Wallet } from '../wallet.model';

@Component({
  selector: 'app-collection-table',
  templateUrl: './collection-table.component.html',
  styleUrls: ['./collection-table.component.css'],
})
export class CollectionTableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Output() clicked = new EventEmitter<{ app: Wallet; index: number, mode: number }>();

  @Input() set utils(utils: Wallet[]) {
    this.dataSource = new MatTableDataSource<Wallet>(utils);
    console.log(this.dataSource);
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator1!;
      this.cdr.detectChanges();
    }, 200);
  }

  @Input() count: number = 0;

  open(
    app: Wallet,
    index: number = (this.dataSource?.data ?? []).findIndex(
      (d) => d.id == app.id
    ),
    mode = 0
  ) {
    this.clicked.emit({ app, index, mode });
  }


  dataSource?: MatTableDataSource<Wallet>;

  displayedColumns2: string[] = [
    'image',
    'downloads',
    'chains',
    'status',
    'action'
  ];

  chains(util: Wallet) {
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
