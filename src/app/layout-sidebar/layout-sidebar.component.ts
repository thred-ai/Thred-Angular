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
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { Subject, BehaviorSubject } from 'rxjs';
import { Page, Block, Grid, NFT, NFTList, Layout, Media, Dict, AccountPage, AuthPage } from 'thred-core';
import { LoadService } from '../load.service';
import { MediaTableComponent } from '../media-table/media-table.component';
import { NFTTableComponent } from '../nft-table/nft-table.component';
import { SharedDialogComponent } from '../shared-dialog/shared-dialog.component';

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

  AuthPage!: AuthPage
  AccountPage!: AccountPage

  @Input() pageIndex!: number;
  @Input() pages!: Page[];
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
  @Output() authPageChanged = new EventEmitter<{name: 'img' | 'text', data: any}>();
  @Output() accountPageChanged = new EventEmitter<{name: 'displayName' | 'displayPic' | 'bio', data: any}>();

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
    this.pages[pageIndex]?.blocks?.forEach((block) => {
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
    // if (this.activeBlock){
    //   this.page.blocks[this.activeBlock.blockIndex] = this.activeBlock.block
    // }
    this.saveLayouts.emit({ delay, page: this.page });
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
      new Grid(0, 3, 0, 'start'),
      '',
      '#FFFFFF',
      0,
      '',
      [],
      ''
    );

    this.addedBlock.emit({ block, pageIndex });
  }

  removeSliderListener(id: string) {
    const $slider = document.getElementById(id);

    if ($slider) {
      $slider.removeAllListeners!('change');
    }
  }

  addSliderListener(id: string, callback: (data: number) => any) {
    const $slider = document.getElementById(id);

    $slider?.addEventListener('change', (evt: any) => {
      callback(evt.detail.value ?? 0);
    });
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

    this.syncListeners(true);

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

  syncListeners(add = true) {
    this.margins.forEach((margin) => {
      this.removeSliderListener('block-margin-' + margin.id);
      if (add) {
        this.addSliderListener('block-margin-' + margin.id, (data) => {
          if (this.activeBlock?.block) {
            this.activeBlock.block.padding[margin.id] = data;
            this.setValue();
          }
        });
      }
    });

    this.borders.forEach((border) => {
      this.removeSliderListener('block-border-' + border.id);
      if (add) {
        this.addSliderListener('block-border-' + border.id, (data) => {
          if (this.activeBlock?.block) {
            this.activeBlock.block.borders[border.id].width = data;
            this.setValue();
          }
        });
      }
    });

    this.gridBorders.forEach((border) => {
      this.removeSliderListener('grid-border-' + border.id);
      if (add) {
        this.addSliderListener('grid-border-' + border.id, (data) => {
          if (this.activeBlock?.block) {
            this.activeBlock.block.grid.borders[border.id].width = data;
            this.setValue();
          }
        });
      }
    });

    this.blockShadowDirection.forEach((shadow) => {
      this.removeSliderListener('block-shadow-direction-' + shadow.id);
      if (add) {
        this.addSliderListener(
          'block-shadow-direction-' + shadow.id,
          (data) => {
            if (this.activeBlock?.block) {
              this.activeBlock.block.shadow.direction[shadow.id] = data;
              this.setValue();
            }
          }
        );
      }
    });

    this.gridShadowDirection.forEach((shadow) => {
      this.removeSliderListener('grid-shadow-direction-' + shadow.id);
      if (add) {
        this.addSliderListener('grid-shadow-direction-' + shadow.id, (data) => {
          if (this.activeBlock?.block) {
            this.activeBlock.block.grid.shadow.direction[shadow.id] = data;
            this.setValue();
          }
        });
      }
    });

    this.removeSliderListener('grid-corners');
    this.removeSliderListener('grid-spacing');
    this.removeSliderListener('grid-shadow-blur');

    this.removeSliderListener('block-corners');
    this.removeSliderListener('block-shadow-blur');

    if (add) {
      this.addSliderListener('grid-corners', (data) => {
        if (this.activeBlock?.block) {
          this.activeBlock.block.grid.corners = data;
          this.setValue();
        }
      });
      this.addSliderListener('grid-spacing', (data) => {
        if (this.activeBlock?.block) {
          this.activeBlock.block.grid.spacing = data;
          this.setValue();
        }
      });
      this.addSliderListener('grid-shadow-blur', (data) => {
        if (this.activeBlock?.block) {
          this.activeBlock.block.grid.shadow.blur = data;
          this.setValue();
        }
      });
      this.addSliderListener('block-corners', (data) => {
        if (this.activeBlock?.block) {
          this.activeBlock.block.corners = data;
          this.setValue();
        }
      });
      this.addSliderListener('block-shadow-blur', (data) => {
        if (this.activeBlock?.block) {
          this.activeBlock.block.shadow.blur = data;
          this.setValue();
        }
      });
    }
  }

  setValue() {
    if (this.activeBlock == undefined) {
      return;
    }

    let blocks = this.pages[this.activeBlock.pageIndex].blocks ?? [];

    if (blocks[this.activeBlock.blockIndex] != undefined) {
      blocks[this.activeBlock.blockIndex] = this.copyBlock(
        this.activeBlock?.block!
      );
    }

    this.saveLayout(0);
  }

  @ViewChild('nftTable') nftTable?: NFTTableComponent;
  @ViewChild('mediaTable') mediaTable?: MediaTableComponent;

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

  config: SummernoteOptions = {
    placeholder: '',
    tabsize: 2,
    height: 200,
    toolbar: [
      ['misc', ['undo', 'redo']],
      [['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'hr']],
    ],
  };

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
