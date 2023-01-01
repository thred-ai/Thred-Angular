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
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { NFT } from '../nft.model';

@Component({
  selector: 'app-nft-table',
  templateUrl: './nft-table.component.html',
  styleUrls: ['./nft-table.component.css'],
})
export class NFTTableComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() clicked = new EventEmitter<
    { nft: NFT; index: number } | undefined
  >();
  @ViewChild(MatTable) table!: MatTable<any>;
  data: NFT[] = [];

  chains: any = {};
  loading = 0;

  @Input() set nfts(nfts: NFT[]) {
    this.loading = 1;
    console.log(nfts)
    this.dataSource = new MatTableDataSource<NFT>(nfts);
    this.data = nfts ?? [];
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
        this.dataSource = new MatTableDataSource<NFT>(this.data);

        this.loading = 0; //

        this.cdr.detectChanges();

        this.dataSource!.paginator = this.paginator1!;
      }, 5);
    }
  }

  @Input() count: number = 0;
  //
  open(nft?: { nft: NFT; index: number }) {
    this.clicked.emit(nft);
  }

  dataSource?: MatTableDataSource<NFT>;

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
    this.loadService.loadedChains.subscribe((chains) => {
      chains.forEach((chain) => {
        console.log(chain);
        this.chains[chain.id] = chain;
      });
    });
  }

  ngAfterViewInit() {}

  drop(event: any) {
    // let arr = this.editableLayout?.pages[pageIndex].blocks ?? [];
    this.loading = 1;
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    // if (this.activeBlock.index == event.previousIndex) {
    //   this.activeBlock.index = event.currentIndex;
    // }
    this.dataSource = new MatTableDataSource<NFT>(this.data);

    setTimeout(() => {
      this.loading = 0; //

      this.cdr.detectChanges();

      this.dataSource!.paginator = this.paginator1!;
    }, 500);
  }
}
