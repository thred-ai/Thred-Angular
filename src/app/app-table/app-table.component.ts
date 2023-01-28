import { moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ResizedEvent } from 'angular-resize-event';
import { App } from 'thred-core';
import { LoadService } from '../load.service';

@Component({
  selector: 'app-app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css'],
})
export class AppTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() clicked = new EventEmitter<
    { app: App; index: number } | undefined
  >();
  @Output() uploaded = new EventEmitter<App[]>();

  @ViewChild(MatTable) table!: MatTable<any>;
  data: App[] = [];

  loading = 0;

  @Input() set apps(apps: App[]) {
    this.loading = 1;
    console.log(apps)
    this.dataSource = new MatTableDataSource<App>(apps);
    this.data = apps ?? [];
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator1!;
      this.loading = 0; //
    }, 250);
  }

  num = 1;

  resize(event?: ResizedEvent, forceResize = false) {
    if ((event && 
      (event.isFirst ||
      Math.abs(event.newRect.height - event.oldRect!.height) > 0) || forceResize)
    ) {
      console.log(event);
      this.loading = 3;
      setTimeout(() => {
        if (!forceResize && event){
          this.num = Math.floor((event.newRect.height - 125) / 70);
        }
        this.dataSource = new MatTableDataSource<App>(this.data);

        this.loading = 0; //

        this.cdr.detectChanges();

        this.dataSource!.paginator = this.paginator1!;
      }, 5);
    }
  }

  @Input() count: number = 0;
  //
  open(app?: { app: App; index: number }) {
    this.clicked.emit(app);
  }

  dataSource?: MatTableDataSource<App>;

  displayedColumns2: string[] = ['image'];

  ngOnChanges() {
    this.cdr.detectChanges();
  }

  @ViewChild(MatPaginator) paginator1?: MatPaginator;
  @ViewChild('parent') parent?: ElementRef<HTMLElement>;
  @ViewChild('header') header?: ElementRef<HTMLElement>;
  @ViewChild('footer') footer?: ElementRef<HTMLElement>;

  constructor(
    private cdr: ChangeDetectorRef,
    private loadService: LoadService
  ) {}

  ngOnInit(): void {
  
  }

  ngAfterViewInit() {}

  drop(event: any) {
    // let arr = this.editableLayout?.pages[pageIndex].blocks ?? [];
    this.loading = 1;
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    // if (this.activeBlock.index == event.previousIndex) {
    //   this.activeBlock.index = event.currentIndex;
    // }
    this.dataSource = new MatTableDataSource<App>(this.data);

    this.uploaded.emit(this.data)
    setTimeout(() => {
      this.loading = 0; //

      this.cdr.detectChanges();

      this.dataSource!.paginator = this.paginator1!;
    }, 500);
  }
}
