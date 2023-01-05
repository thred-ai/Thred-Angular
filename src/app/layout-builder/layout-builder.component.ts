import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  PLATFORM_ID,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import {
  moveItemInArray,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CDK_DRAG_CONFIG,
} from '@angular/cdk/drag-drop';
import { BehaviorSubject, Subject } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { Button } from '../button.model';
import { LoadService, Dict } from '../load.service';
import { Page } from '../page.model';
import { Block } from '../block.model';
import { Wallet } from '../wallet.model';
import { Layout } from '../layout.model';
import { MatTabGroup } from '@angular/material/tabs';
import { NFT } from '../nft.model';
import { NFTList } from '../nft-list.model';
import { Options } from '@angular-slider/ngx-slider';
import { SharedDialogComponent } from '../shared-dialog/shared-dialog.component';
import { NFTTableComponent } from '../nft-table/nft-table.component';
import { Grid } from '../grid.model';
import { takeUntil } from 'rxjs/operators';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10001,
};

@Component({
  selector: 'app-layout-builder',
  templateUrl: './layout-builder.component.html',
  styleUrls: ['./layout-builder.component.scss'],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }],
})
export class LayoutBuilderComponent implements OnInit, OnDestroy {
  loaded = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  editingBlock?: {
    blockIndex: number;
    pageIndex: number;
  };

  items = {};
  margins: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  borders: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  gridBorders: { id: 'left' | 'right' | 'top' | 'bottom' }[] = [];
  gridShadowDirection: { id: 'vertical' | 'horizontal' }[] = [];
  blockShadowDirection: { id: 'vertical' | 'horizontal' }[] = [];

  // Dict<{
  //   nft: NFT;
  //   collection: Collection;
  // }> = {};

  mode = 0;
  codeMode = false;
  pageDisplay?: string;

  // urlText(showHttps = false) {
  //   var url = 'https://shopmythred.com/' + this.wallet?.username;

  //   if (this.wallet?.customURL?.status == 2) {
  //     url =
  //       this.wallet?.customURL.fullURL != undefined
  //         ? this.wallet?.customURL.fullURL
  //         : url;
  //   }

  //   return (
  //     url +
  //     '/' +
  //     (this.layoutForm.controls['url'].value
  //       ? this.layoutForm.controls['url'].value
  //       : '')
  //   );
  // }

  changeSetting() {
    this.mode = this.mode == 0 ? 1 : 0;
  }

  radioChange(event: any) {
    let val = event.value;

    // this.layoutForm.controls['isFullscreen'].setValue(val);
    this.cdr.detectChanges();
  }

  radioChangeLoader(event: any) {
    let val = event.value;

    // this.layoutForm.controls['isLoader'].setValue(val);
    this.cdr.detectChanges();
  }

  radioChangeBtn(event: any, index: number) {
    let val = event.value;

    this.buttons[index].submit = val;
    this.cdr.detectChanges();
  }

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
    fontNames: [],
  };

  config2: SummernoteOptions = {
    placeholder: '',
    tabsize: 2,
    height: 200,
    toolbar: [['misc', ['undo', 'redo', 'codeview']]],
    fontNames: [],
  };

  title = 'LAUNCHING LAYOUT BUILDER';

  hoverIndex?: number = undefined;

  changeStyle($event: Event, index: number) {
    // this.color = $event.type == 'mouseover' ? 'yellow' : 'red';
    let p = document.getElementById('p-' + index);

    if ($event.type == 'mouseover') {
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

  syncBlockAndPageColors(pageIndex: number, value: string) {
    this.editableLayout!.pages[pageIndex]?.blocks?.forEach((block) => {
      if (block.backgroundColor == '') {
        block.backgroundColor = value ?? '#FFFFFF';
      }
    });
  }

  @Input() wallet!: Wallet;
  @Input() color!: string;

  @Output() layoutSaved = new EventEmitter<{time: number, layout?: Layout}>();
  @Output() clickedCanvas = new EventEmitter<boolean>();

  @Input() set layout(value: Layout) {
    if (!this.editableLayout) {
      this.editableLayout = Object.assign(
        {},
        JSON.parse(JSON.stringify(value))
      );
    }
  }
  @Input() editable!: boolean;

  editableLayout: Layout | undefined = undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private loadService: LoadService,
    private dialog: MatDialog
  ) {
    this.mode = 1;

    for (let i = 1; i < 7; i++) {
      this.grid.push({
        name: String(i),
        block: i,
      });
    }
  }

  types = [
    {
      name: 'Text',
      code: 2,
    },
    {
      name: 'Image',
      code: 1,
    },
    {
      name: 'Video',
      code: 4,
    },
    {
      name: 'NFT Display',
      code: 0,
    },
    {
      name: 'NFT Collection',
      code: 5,
    },
    {
      name: 'NFT Wallet',
      code: 6,
    },
    {
      name: 'Multi Block',
      code: 3,
    },
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

  btnTypes = [
    {
      name: 'Pill',
      code: 0,
    },
    {
      name: 'Rounded Corners',
      code: 1,
    },
    {
      name: 'Square Corners',
      code: 2,
    },
    {
      name: 'Circle',
      code: 3,
    },
  ];

  images = new Array<{
    isActive: boolean;
    img: string;
    link: string;
  }>();

  videos = new Array<{
    isActive: boolean;
    link: string;
  }>();

  buttons = new Array<Button>();

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

  ngOnDestroy(): void {
    this.activeBlock.index = undefined;
    this.activeBlock.block = undefined;
    this.OnDestroy.next();
    this.OnDestroy.complete();
  }

  selectedTheme: Dict<any> = {};

  async ngOnInit() {
    this.loadService.getIcons((icons) => {
      this.icons = icons ?? [];
    });

    if (this.editableLayout) {
      await Promise.all(
        this.editableLayout.pages?.map((page, index) => {
          console.log(page.icon);
          if (page.blocks) {
            return Promise.all(
              page.blocks!.map((block) => {
                if (block.type == 0 && block.nftList) {
                  return this.loadService.loadNFTs(block.nftList, (nfts) => {
                    block.nftList = new NFTList(
                      block.nftList.type ?? 0,
                      nfts ?? [],
                      block.nftList.contract
                    );
                  });
                } else {
                  return Promise.resolve(undefined);
                }
              })
            );
          } else {
            return Promise.resolve(undefined);
          }
        })
      );

      console.log(this.editableLayout.pages);
    }

    this.recalculateUniqIdsForDragDrop();

    this.cdr.detectChanges();
  }

  closeDialog() {
    if (this.mode == 0) {
      this.mode = 1;
      return;
    }
  }

  removeBlocks(index: number, pageIndex: number) {
    this.editableLayout?.pages[pageIndex]?.blocks?.splice(index, 1);
    this.saveLayout(0);

    this.cdr.detectChanges();
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

  async edit(blockIndex: number, pageIndex: number) {
    if (
      this.editingBlock?.blockIndex == blockIndex &&
      this.editingBlock?.pageIndex == pageIndex
    ) {
      return;
    }

    this.editingBlock = {
      blockIndex,
      pageIndex,
    };
    this.activeBlock.block = Object.assign(
      {},
      JSON.parse(
        JSON.stringify(
          this.editableLayout?.pages[pageIndex].blocks![blockIndex]
        )
      )
    );

    this.activeBlock.index = blockIndex;
    this.margins = (
      Object.keys(this.activeBlock.block?.padding ?? {}) as (
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
      Object.keys(this.activeBlock.block?.borders ?? {}) as (
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
      Object.keys(this.activeBlock.block?.grid.borders ?? {}) as (
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
      Object.keys(this.activeBlock.block?.shadow.direction ?? {}) as (
        | 'vertical'
        | 'horizontal'
      )[]
    ).map((id) => {
      return {
        id,
      };
    });

    this.gridShadowDirection = (
      Object.keys(this.activeBlock.block?.grid.shadow.direction ?? {}) as (
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

  removeImg(img: { isActive: boolean; img: string; link: string }) {
    img.img = '';
    img.isActive = false;

    let index = this.images.indexOf(img);
    moveItemInArray(this.images, index, this.images.length - 1);
  }

  fileChangeEvent(
    event: any,
    image: {
      isActive: boolean;
      img: string;
      link: string;
    }
  ): void {
    // const modalRef = this.modalService.open(CropperComponent, { size: 'lg' });
    // modalRef.componentInstance.imageChangedEvent = event;
    // modalRef.componentInstance.width = 2560;
    // modalRef.componentInstance.height = 2560;
    // let sub = modalRef.dismissed.subscribe((img: string) => {
    //   sub.unsubscribe();
    //   if (img != '0') {
    //     image.img = img;
    //     image.isActive = true;
    //   }
    //   this.setBlock();
    // });
  }

  vidChangeEvent(
    event: any,
    vid: {
      isActive: boolean;
      link: string;
    }
  ): void {
    vid.link = event.target.value;
    vid.isActive = event.target.value && event.target.value.trim() != '';
  }

  canCancel(isBtn = false) {
    if (isBtn) {
      return (
        this.buttons.filter((btn) => {
          return (btn.text ?? '').trim() != '';
        }).length > 1
      );
    }
    return (
      this.images.filter((img) => {
        return img.isActive;
      }).length > 1
    );
  }

  syncListeners(add = true) {
    this.margins.forEach((margin) => {
      this.removeSliderListener('block-margin-' + margin.id);
      if (add) {
        this.addSliderListener('block-margin-' + margin.id, (data) => {
          if (this.activeBlock.block) {
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
          if (this.activeBlock.block) {
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
          if (this.activeBlock.block) {
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
            if (this.activeBlock.block) {
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
          if (this.activeBlock.block) {
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
        if (this.activeBlock.block) {
          this.activeBlock.block.grid.corners = data;
          this.setValue();
        }
      });
      this.addSliderListener('grid-spacing', (data) => {
        if (this.activeBlock.block) {
          this.activeBlock.block.grid.spacing = data;
          this.setValue();
        }
      });
      this.addSliderListener('grid-shadow-blur', (data) => {
        if (this.activeBlock.block) {
          this.activeBlock.block.grid.shadow.blur = data;
          this.setValue();
        }
      });
      this.addSliderListener('block-corners', (data) => {
        if (this.activeBlock.block) {
          this.activeBlock.block.corners = data;
          this.setValue();
        }
      });
      this.addSliderListener('block-shadow-blur', (data) => {
        if (this.activeBlock.block) {
          this.activeBlock.block.shadow.blur = data;
          this.setValue();
        }
      });
    }
  }

  editorOptions = {
    theme: 'hc-black',
    language: 'html',
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    lineNumbers: 'off',
    glyphMargin: false,
    folding: false,
  };

  deleting = false;

  setValue() {
    if (this.editingBlock == undefined) {
      return;
    }

    let blocks =
      this.editableLayout?.pages[this.editingBlock.pageIndex].blocks ?? [];

    if (blocks[this.editingBlock.blockIndex] != undefined) {
      blocks[this.editingBlock.blockIndex] = this.copyBlock(
        this.activeBlock.block!
      );
    }

    this.saveLayout(0);
  }

  saveLayout(delay = 750) {
    setTimeout(() => {
      this.save();
    }, delay);
  }

  finishedEditing(mode = 0) {
    // this.syncListeners(false);

    if (this.editingBlock == undefined) {
      return;
    }

    let blocks =
      this.editableLayout?.pages[this.editingBlock.pageIndex].blocks ?? [];

    if (blocks[this.editingBlock.blockIndex] != undefined) {
      switch (mode) {
        // @ts-ignore
        case 1:
          this.removeBlocks(
            this.editingBlock.blockIndex,
            this.editingBlock.pageIndex
          );
          break;
        default:
          break;
      }
    }

    this.images = [];
    this.videos = [];
    this.buttons = [];
    this.editingBlock = undefined;
    this.activeBlock.block = undefined;
    this.activeBlock.index = undefined;
  }

  activeBlock: {
    block?: Block;
    index?: number;
  } = {
    block: undefined,
    index: undefined,
  };

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

  resizeIframe(index: number) {
    let obj = document.getElementById('frame' + index) as HTMLIFrameElement;
    let c = document.getElementById('c' + index) as HTMLElement;

    if (obj) {
      c.style.height =
        (obj.contentWindow?.document.body.scrollHeight ?? 0) + 'px';
    }
  }

  addBlock(pageIndex: number) {
    let rows =
      (this.editableLayout?.pages[pageIndex]?.blocks as Array<Block>) ?? [];
    rows.push(
      new Block(
        undefined,
        0,
        [],
        new Grid(0, 3, 0, 'start'),
        '',
        '#FFFFFF',
        0,
        '',
        [],
        [],
        ''
      )
    );

    this.saveLayout(0);

    this.edit(rows.length - 1, pageIndex);
  }

  async getBase64ImageFromUrl(imageUrl: string) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', imageUrl, true);
      xhr.responseType = 'arraybuffer';

      xhr.onerror = function (e) {
        alert('error');
      };

      xhr.onload = function (e) {
        if (this.status == 200) {
          var uInt8Array = new Uint8Array(this.response);
          var i = uInt8Array.length;
          var biStr = new Array(i);
          while (i--) {
            biStr[i] = String.fromCharCode(uInt8Array[i]);
          }
          var data = biStr.join('');
          var base64 = window.btoa(data);

          xhr.onerror = function (e) {
            reject(e);
          };

          resolve('data:image/png;base64,' + base64);
        }
      };
      xhr.send();
    });
  }

  async save() {
    if (this.editableLayout) {
      let time = new Date().getTime()
      this.layoutSaved.emit({time})
      this.loadService.addLayout(this.editableLayout, this.wallet, (layout) => {
        this.layoutSaved.emit({time, layout})
      });
    }
  }

  toast(m: string) {
    // this.loadService.openSnackBar(m);
  }

  drop(event: any, pageIndex: number, isImage = false, isButton = false) {
    let arr = this.editableLayout?.pages[pageIndex].blocks ?? [];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    if (this.activeBlock.index == event.previousIndex) {
      this.activeBlock.index = event.currentIndex;
    }
    this.saveLayout(0);
  }

  @ViewChild('nftTable') nftTable?: NFTTableComponent;

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

      if (this.activeBlock.block) {
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
      this.saveLayout(0);
    });
  }

  @ViewChild('tabGroup', { static: false }) childTabGroup!: MatTabGroup;

  CHILD_ID_NAME = 'menu-name';
  childMenuIds$ = new BehaviorSubject<string[]>([]);

  trackByIndex(index: number): number {
    return index;
  }

  onDropTab(event: CdkDragDrop<Page[]>): void {
    console.log(event);
    const previousIndex = parseInt(
      event.previousContainer.id.replace(this.CHILD_ID_NAME, ''),
      10
    );
    const newIndex = parseInt(
      event.container.id.replace(this.CHILD_ID_NAME, ''),
      10
    );
    console.log(event);
    moveItemInArray(this.editableLayout?.pages ?? [], previousIndex, newIndex);
    this.showDragWrapper(event);
    this.saveLayout(0);
  }

  onDropPage(event: CdkDragDrop<Page[]>): void {
    let arr = this.editableLayout?.pages ?? [];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    if (this.editingBlock?.pageIndex == event.previousIndex) {
      this.editingBlock.pageIndex = event.currentIndex;
    }
    this.saveLayout(0);
  }

  onDragEntered(event: CdkDragEnter): void {
    console.log(event);
    this.hideDragWrapper(event);
  }

  onDragExited(event: CdkDragExit): void {
    this.showDragWrapper(event);
  }

  onRemoveMenu(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.editableLayout?.pages.splice(index, 1);
    // When we want to remove last item and this item is active right now
    if (
      this.childTabGroup.selectedIndex === this.editableLayout?.pages.length ??
      0
    ) {
      this.childTabGroup.selectedIndex =
        (this.childTabGroup?.selectedIndex ?? -1) - 1;
    }
    this.recalculateUniqIdsForDragDrop();
    this.saveLayout(0);
  }

  onAddChildControl(event: MouseEvent): void {
    event.stopPropagation();
    let index = (this.editableLayout?.pages.length ?? 0) + 1;

    let oldIndex = (this.editableLayout?.pages.length ?? 0) - 1;

    let oldPage = this.editableLayout?.pages[oldIndex];

    let page = Object.assign({}, JSON.parse(JSON.stringify(oldPage))) as Page;

    page.name = `new page ${index}`;
    page.title = `New Page ${index}`;
    page.id = `${index}`;
    page.url = `new-page-${index}`;
    page.blocks = [];
    page.icon = 'radio_button_unchecked';
    page.type = 0;

    this.editableLayout?.pages.push(page);
    this.recalculateUniqIdsForDragDrop();
    this.saveLayout(0);
  }

  private showDragWrapper(event: CdkDragExit | CdkDragDrop<string[]>): void {
    const element = this.getDragWrappedElement(event);
    if (element) {
      element.classList.remove('d-none');
    }
  }

  private hideDragWrapper(event: CdkDragEnter): void {
    const element = this.getDragWrappedElement(event);
    if (element) {
      element.classList.add('d-none');
    }
  }

  private getDragWrappedElement(
    event: CdkDragEnter | CdkDragExit
  ): HTMLElement | null {
    return event.container.element.nativeElement.querySelector(`.drag-wrapper`);
  }

  private recalculateUniqIdsForDragDrop(): void {
    const uniqIds: string[] = [];
    this.editableLayout?.pages.reduce((accumulator: string[], _, index) => {
      accumulator.push(`${this.CHILD_ID_NAME}${index}`);
      return accumulator;
    }, uniqIds);
    this.childMenuIds$.next(uniqIds);
  }
}
