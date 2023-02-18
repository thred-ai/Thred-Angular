import { Options } from '@angular-slider/ngx-slider';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from 'ng-in-viewport';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { Subject, BehaviorSubject } from 'rxjs';
import {
  Page,
  Block,
  Grid,
  NFT,
  NFTList,
  Layout,
  Media,
  Dict,
  AccountPage,
  AuthPage,
  App,
} from 'thred-core';
import { AppTableComponent } from '../app-table/app-table.component';
import { LoadService } from '../load.service';
import { MediaTableComponent } from '../media-table/media-table.component';
import { NFTTableComponent } from '../nft-table/nft-table.component';
import { SharedDialogComponent } from '../shared-dialog/shared-dialog.component';
import { RangeCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrls: ['./layout-sidebar.component.scss'],
})
export class LayoutSidebarComponent implements OnInit, OnDestroy {
  margins: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  borders: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  gridBorders: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  gridShadowDirection: { id: 'vertical' | 'horizontal' }[] = [];
  blockShadowDirection: { id: 'vertical' | 'horizontal' }[] = [];

  @Input() page!: Page;
  @Input() canDelete: boolean = false;

  AuthPage!: AuthPage;
  AccountPage!: AccountPage;

  @Input() pageIndex!: number;
  @Input() walletId!: string;

  @Input() defaultItems?: Dict<any[]>;
  @Input() layout?: Layout;

  activeBlock?: {
    block: Block;
    blockIndex: number;
    pageIndex: number;
  };

  @Input() set overrideBlock(
    block:
      | {
          block: Block;
          blockIndex: number;
          pageIndex: number;
        }
      | undefined
  ) {
    this.activeBlock = block;
    if (block) {
      this.setEdit(block.blockIndex);
    }
  }

  @Output() saveLayouts = new EventEmitter<{ delay: number; page: Page }>();
  @Output() droppedPage = new EventEmitter<any>();
  @Output() removedPage = new EventEmitter<number>();
  @Output() closeBar = new EventEmitter<any>();
  @Output() authPageChanged = new EventEmitter<{
    name: 'img' | 'text';
    data: any;
  }>();
  @Output() accountPageChanged = new EventEmitter<{
    name: 'displayName' | 'displayPic' | 'bio';
    data: any;
  }>();

  @Output() edit = new EventEmitter<{
    blockIndex: number;
    pageIndex: number;
  }>();

  @Output() finishedEdit = new EventEmitter<{
    blockIndex: number;
    pageIndex: number;
    mode: number;
  }>();

  @Output() removeBlock = new EventEmitter<{
    blockIndex: number;
    pageIndex: number;
  }>();

  @Output() addedBlock = new EventEmitter<{
    block: Block;
    pageIndex: number;
  }>();

  constructor(
    private loadService: LoadService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    for (let i = 1; i < 7; i++) {
      this.grid.push({
        name: String(i),
        block: i,
      });
    }
  }

  ngOnInit(): void {
    this.loadService.getIcons((icons) => {
      this.icons = icons ?? [];
    });
  }

  syncBlockAndPageColors(pageIndex: number, value: string) {
    this.page.blocks?.forEach((block) => {
      if (block.backgroundColor == '') {
        block.backgroundColor = value ?? '#FFFFFF';
      }
    });
  }

  finishedEditing(mode = 0) {
    // this.syncListeners(false);

    if (this.activeBlock == undefined) {
      return;
    }

    this.finishedEdit.emit({
      blockIndex: this.activeBlock.blockIndex,
      pageIndex: this.activeBlock.pageIndex,
      mode,
    });
  }

  saveLayout(delay: number) {
    this.saveLayouts.emit({ delay, page: this.page });
  }

  setBlockImgData(event: { data: Media[] }) {
    console.log(event);
    if (!this.activeBlock) {
      return;
    }
    this.activeBlock.block.imgs = event.data ?? [];
  }

  setAuthPageImgData(event: { data: Media[] }) {
    let page = this.page as AuthPage;

    if (page && event.data) {
      console.log(event.data)
      page.img = event.data[0];
    }
  }

  icons = new Array<any>();
  OnDestroy = new Subject<void>();

  filteredIcons: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>(
    []
  );

  filterCodes(icon: string) {
    if (!this.icons) {
      return;
    }
    let search = icon;

    if (!search) {
      this.filteredIcons.next(this.icons.slice());

      // this.bannerForm.controls.icon.setValue(undefined)
      this.height = '400px';
      return;
    } else {
      search = search.toLowerCase();
    }

    let filt = new Array<any>();

    let i = this.icons.filter((icon) =>
      icon.icons.filter((i: string) => i.toLowerCase().indexOf(search) > -1)
    );

    i.forEach((ic) => {
      let newIc = { category: ic.category, icons: new Array<any>() };
      ic.icons.forEach((ico: any) => {
        if (ico.toLowerCase().indexOf(search) > -1) {
          newIc.icons.push(ico);
        }
      });
      if (newIc.icons.length > 0) {
        filt.push(newIc);
      }
    });

    this.filteredIcons.next(filt);

    if (this.filteredIcons.value?.length < 10) {
      let total = 0;
      this.filteredIcons.value.forEach((icon: any) => {
        total += 40;
        total += icon.icons.length * 56;
      });
      this.height = total + 'px';
    } else {
      this.height = '400px';
    }
  }

  height = '0px';

  selectIcon(icon: string, page: Page) {
    console.log(icon);
    page.icon = icon;
    this.saveLayout(0);
  }

  formattedName(name: string) {
    let str = name
      ?.replace('_', ' ')
      .replace('_', ' ')
      .replace('_', ' ')
      .replace('_', ' ');
    return str;
  }

  ngOnDestroy(): void {
    this.activeBlock = undefined;
    this.OnDestroy.next();
    this.OnDestroy.complete();
  }

  removeBlocks(blockIndex: number, pageIndex: number) {
    this.removeBlock.emit({ blockIndex, pageIndex });
  }

  addBlock(pageIndex: number) {
    let block = new Block(
      undefined,
      0,
      [],
      [],
      new Grid(undefined, 3, 0, 'start'),
      '',
      '#FFFFFF00',
      0,
      '',
      [],
      ''
    );

    this.addedBlock.emit({ block, pageIndex });
  }

  async setEdit(blockIndex: number) {
    this.margins = (
      Object.keys(this.activeBlock?.block?.padding ?? {}) as (
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.borders = (
      Object.keys(this.activeBlock?.block?.borders ?? {}) as (
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.gridBorders = (
      Object.keys(this.activeBlock?.block?.grid.borders ?? {}) as (
        | 'left'
        | 'right'
        | 'top'
        | 'bottom'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.blockShadowDirection = (
      Object.keys(this.activeBlock?.block?.shadow.direction ?? {}) as (
        | 'vertical'
        | 'horizontal'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.gridShadowDirection = (
      Object.keys(this.activeBlock?.block?.grid.shadow.direction ?? {}) as (
        | 'vertical'
        | 'horizontal'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.cdr.detectChanges();

    if (isPlatformBrowser()) {
      setTimeout(async () => {
        let p = document.getElementById('p-' + blockIndex);
        if (p) {
          p.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
          });
        } else {
        }
      }, 100);
    }
  }

  sliderVal(event: Event) {
    console.log((event as RangeCustomEvent).detail.value);
    return (event as RangeCustomEvent).detail.value as number;
  }

  setValue() {
    if (this.activeBlock == undefined) {
      return;
    }

    let blocks = this.page.blocks ?? [];

    if (blocks[this.activeBlock.blockIndex] != undefined) {
      blocks[this.activeBlock.blockIndex] = this.copyBlock(
        this.activeBlock?.block!
      );
    }

    this.saveLayout(0);
  }

  @ViewChild('nftTable') nftTable?: NFTTableComponent;
  @ViewChild('appTable') appTable?: AppTableComponent;
  @ViewChild('mediaTable') mediaTable?: MediaTableComponent;
  @ViewChild('mediaTable2') mediaTable2?: MediaTableComponent;

  openNFT(nft?: NFT, index?: number) {
    console.log(nft);
    const modalRef = this.dialog.open(SharedDialogComponent, {
      width: '750px',
      maxHeight: '80vh',
      maxWidth: '100vw',
      panelClass: 'app-full-bleed-sm-dialog',

      data: {
        payload: nft,
        mode: 0,
        title: 'NFT Details',
      },
    });

    modalRef.afterClosed().subscribe((value) => {
      //

      if (this.activeBlock?.block) {
        if (
          !this.activeBlock.block.nftList ||
          !this.activeBlock.block.nftList.nfts
        ) {
          this.activeBlock.block.nftList = new NFTList(0, []);
        }
        if (this.activeBlock.block.nftList.nfts) {
          if (nft && index != undefined && index > -1) {
            if (value && value?.nft) {
              this.activeBlock.block.nftList.nfts[index] = value?.nft;
            } else if (value == '0') {
              this.activeBlock.block.nftList.nfts.splice(index, 1);
            }
          } else {
            if (value && value?.nft) {
              this.activeBlock.block.nftList.nfts.push(value?.nft);
            }
          }
          if (this.nftTable) {
            this.nftTable.nfts = this.activeBlock.block.nftList.nfts;
            this.nftTable.resize(undefined, true);
          }
        }
        this.cdr.detectChanges();
      }
      this.setValue();
    });
  }

  openApp(app?: App, index?: number) {
    console.log(app);
    const modalRef = this.dialog.open(SharedDialogComponent, {
      width: '750px',
      maxHeight: '80vh',
      maxWidth: '100vw',
      panelClass: 'app-full-bleed-sm-dialog',

      data: {
        payload: app,
        id: this.walletId,
        mode: 8,
        title: 'App Details',
      },
    });

    modalRef.afterClosed().subscribe((value) => {
      //

      if (this.activeBlock?.block) {
        if (!this.activeBlock.block.apps) {
          this.activeBlock.block.apps = [];
        }
        if (this.activeBlock.block.apps) {
          if (app && index != undefined && index > -1) {
            if (value && value?.nft) {
              this.activeBlock.block.apps[index] = value?.app;
            } else if (value == '0') {
              this.activeBlock.block.apps.splice(index, 1);
            }
          } else {
            if (value && value?.app) {
              this.activeBlock.block.apps.push(value?.app);
            }
          }
          if (this.appTable) {
            this.appTable.apps = this.activeBlock.block.apps;
            this.appTable.resize(undefined, true);
          }
        }
        this.cdr.detectChanges();
      }
      this.setValue();
    });
  }

  copyBlock(block: Block) {
    let newBlock = Object.assign({}, JSON.parse(JSON.stringify(block)));

    let newGrid = Object.assign({}, JSON.parse(JSON.stringify(block.grid)));

    let newGridBorders = Object.assign(
      {},
      JSON.parse(JSON.stringify(block.grid.borders))
    );

    let newBorders = Object.assign(
      {},
      JSON.parse(JSON.stringify(block.borders))
    );

    newBlock.borders = newBorders;
    newGrid.borders = newGridBorders;
    newBlock.grid = newGrid;

    return JSON.parse(JSON.stringify(newBlock)) as Block;
  }

  matchingType(type: number) {
    return this.types.find((t) => {
      return t.code == type;
    });
  }

  matchingTabType(type: number) {
    return this.tabPosTypes.find((t) => {
      return t.code == (type ?? 0);
    });
  }

  matchingBarType(type: number) {
    return this.navBarTypes.find((t) => {
      return t.code == (type ?? 0);
    });
  }

  matchingGridType(type: number) {
    return this.gridLayoutTypes.find((t) => {
      return t.code == (type ?? 0);
    });
  }

  grid: Array<{
    name: string;
    block: number;
  }> = [];

  gridAlignment: Array<{
    name: string;
    id: string;
  }> = [
    {
      name: 'Left',
      id: 'start',
    },
    {
      name: 'Right',
      id: 'end',
    },
    {
      name: 'Middle',
      id: 'center',
    },
    {
      name: 'Equal',
      id: 'between',
    },
  ];

  types = [
    {
      name: 'Text',
      code: 2,
    },
    {
      name: 'Image',
      code: 1,
    },
    // {
    //   name: 'Video',
    //   code: 4,
    // },
    {
      name: 'NFT Display',
      code: 0,
    },
    // {
    //   name: 'NFT Collection',
    //   code: 5,
    // },
    {
      name: 'NFT Wallet',
      code: 6,
    },
    {
      name: 'Network',
      code: 7,
    },
    {
      name: 'App',
      code: 8,
    },
    // {
    //   name: 'Multi Block',
    //   code: 3,
    // },
  ];

  tabPosTypes = [
    {
      name: 'Reverse',
      code: 1,
    },
    {
      name: 'Standard',
      code: 0,
    },
  ];

  gridLayoutTypes = [
    {
      name: 'Carousel',
      code: 1,
    },
    {
      name: 'Grid',
      code: 0,
    },
  ];

  navBarTypes = [
    {
      name: 'Image',
      code: 1,
    },
    {
      name: 'Title',
      code: 0,
    },
  ];

  alignment(id: string) {
    return this.gridAlignment.find((a) => a.id == id);
  }

  options: Options = {
    floor: 0,
    ceil: 5,
    getPointerColor: (value: number): string => {
      return '#9c4aff';
    },
  };

  blockBorderRadiusOptions: Options = {
    floor: 0,
    ceil: 50,
    getPointerColor: (value: number): string => {
      return '#9c4aff';
    },
  };

  blockGridBorderRadiusOptions: Options = {
    floor: 0,
    ceil: 50,
    getPointerColor: (value: number): string => {
      return '#9c4aff';
    },
  };

  hoverIndex?: number = undefined;

  changeStyle($event: Event, index: number) {
    // this.color = $event.type == 'mouseover' ? 'yellow' : 'red';

    if (isPlatformBrowser()) {
      let p = document.getElementById('p-' + index);

      if ($event?.type == 'mouseover') {
        this.hoverIndex = index;
        setTimeout(async () => {
          if (p) {
            p.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'start',
            });
          } else {
          }
        }, 0);
      } else {
        this.hoverIndex = undefined;
      }
    }
  }
}
