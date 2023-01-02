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
  margins: { id: 'left' | 'right' | 'top' | 'bottom'; options: Options }[] = [];
  borders: { id: 'left' | 'right' | 'top' | 'bottom'; options: Options }[] = [];
  gridBorders: { id: 'left' | 'right' | 'top' | 'bottom'; options: Options }[] =
    [];

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
    this.setBlock();
    this.cdr.detectChanges();
  }

  // layoutForm = this.fb.group({
  //   rows: [[]],
  //   name: [null, [Validators.required]],
  //   url: [null, [Validators.required]],
  //   isFullscreen: [null, [Validators.required]],
  //   isLoader: [null, [Validators.required]],

  //   // seoTitle: [null, [Validators.required]],
  //   // seoDesc: [null, [Validators.required]],
  //   // seoTags: [[], [Validators.required]],

  //   // metaTitle: [null, [Validators.required]],
  //   // metaDesc: [null, [Validators.required]],
  //   // metaURL: [null, [Validators.required]],
  //   // metaPic: [null, [Validators.required]],
  // });

  // rowForm = this.fb.group({
  //   title: [null],
  //   htmlText: [null],
  //   html: [null],
  //   backgroundColor: [null],
  //   corners: ['0'],
  //   imgs: [[]],
  //   type: [null],
  //   grid: [null],
  //   buttons: [null],
  //   animations: [null],
  // });

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

  // productName(id: any) {
  //   if (id === '1') {
  //     return 'HOTTEST PRODUCTS';
  //   } else if (id === '0') {
  //     return 'NEWEST PRODUCTS';
  //   } else if (id === '2') {
  //     return 'ALL PRODUCTS';
  //   }
  //   return this.items[id]?.nft.name ?? 'NFT';
  // }

  syncBlockAndPageColors(pageIndex: number, value: string) {
    this.editableLayout!.pages[pageIndex]?.blocks?.forEach((block) => {
      if (block.backgroundColor == '') {
        block.backgroundColor = value ?? '#FFFFFF';
      }
    });
  }

  @Input() wallet!: Wallet;
  @Input() color!: string;

  @Output() layoutSaved = new EventEmitter<Layout>();
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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformID: Object,
    private loadService: LoadService,
    private dialog: MatDialog
  ) {
    // this.spinner.show('loader');
    this.mode = 1;

    for (let i = 1; i < 5; i++) {
      this.grid.push({
        name: String(i),
        block: i,
      });
    }

    // this.filteredProducts = this.productCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) =>
    //     fruit
    //       ? this._filter(fruit)
    //       : Object.values(this.items)
    //           .map((c) => c.nft)
    //           .slice()
    //   )
    // );
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
    // this.blockForm.reset();
    // this.layoutForm.reset();
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
    this.cdr.detectChanges();
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
      let options: Options = {
        floor: 0,
        ceil: 10,
        getPointerColor: (value: number): string => {
          return '#9c4aff';
        },
      };

      return {
        id,
        options,
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
      let options: Options = {
        floor: 0,
        ceil: 10,
        getPointerColor: (value: number): string => {
          return '#9c4aff';
        },
      };

      return {
        id,
        options,
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
      let options: Options = {
        floor: 0,
        ceil: 10,
        getPointerColor: (value: number): string => {
          return '#9c4aff';
        },
      };

      return {
        id,
        options,
      };
    });

    this.cdr.detectChanges();

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
    this.setBlock();
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

    this.setBlock();
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

  changed(event?: any, event2?: any) {
    // let type = this.blockForm.controls['type'].value ?? event2.value;
    // let grid = this.blockForm.controls['grid'].value ?? event.value;
    // if (type == undefined) {
    //   type = event2?.value;
    // }
    // if (grid == undefined) {
    //   grid = event.value;
    // }
    // if (type == 1) {
    //   let matchGrid = this.grid.find((g) => g.name == grid);
    //   let newSize = matchGrid?.block ?? 1;
    //   if (newSize > this.images.length) {
    //     for (let i = 0; i < newSize; i++) {
    //       if (!this.images[i]) {
    //         this.images.push({
    //           isActive: false,
    //           img: '',
    //           link: '',
    //         });
    //       }
    //     }
    //   } else if (newSize < this.images.length) {
    //     this.images = this.images.slice(0, newSize);
    //   }
    // } else if (type == 4) {
    //   let matchGrid = this.grid.find((g) => g.name == grid);
    //   let newSize = matchGrid?.block ?? 1;
    //   if (newSize > this.videos.length) {
    //     for (let i = 0; i < newSize; i++) {
    //       if (!this.videos[i]) {
    //         this.videos.push({
    //           isActive: false,
    //           link: '',
    //         });
    //       }
    //     }
    //   } else if (newSize < this.videos.length) {
    //     this.videos = this.videos.slice(0, newSize);
    //   }
    // } else if (type == 3) {
    //   // let matchGrid = this.grid.find((g) => g.name == grid);
    //   // let newSize = matchGrid?.block ?? 1;
    //   // if (newSize > this.buttons.length) {
    //   //   for (let i = 0; i < newSize; i++) {
    //   //     if (!this.buttons[i]) {
    //   //       this.buttons.push(
    //   //         new Button(
    //   //           this.selectedTheme.bg_color,
    //   //           '',
    //   //           this.selectedTheme.color,
    //   //           0,
    //   //           '',
    //   //           12
    //   //         )
    //   //       );
    //   //     }
    //   //   }
    //   // } else if (newSize < this.buttons.length) {
    //   //   this.buttons = this.buttons.slice(0, newSize);
    //   // }
    // }
    // this.setBlock();
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

  finishedEditing(mode = 0) {
    if (this.editingBlock == undefined) {
      return;
    }

    let blocks =
      this.editableLayout?.pages[this.editingBlock.pageIndex].blocks ?? [];

    if (blocks[this.editingBlock.blockIndex] != undefined) {
      switch (mode) {
        // @ts-ignore

        case 0:
          blocks[this.editingBlock.blockIndex] = this.copyBlock(
            this.activeBlock.block!
          );
          break;
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
    // this.bannerForm.controls.icon.setValue(icon)
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

  setBlock(gridVal?: string) {
    // let name = (this.blockForm.controls['title'].value as string) ?? '';
    // let type = (this.blockForm.controls['type'].value as number) ?? 0;
    // let html = (this.blockForm.controls['htmlText'].value ?? '').replace(
    //   /style="/g,
    //   'style="overflow-wrap: break-word;'
    // );
    // let backgroundColor =
    //   this.blockForm.controls['backgroundColor'].value ?? '#FFFFFF';
    // let corners = this.blockForm.controls['corners'].value ?? '0';
    // console.log(backgroundColor);
    // let imgs = (this.images ?? [])
    //   .filter((i) => i.img != undefined && i.img.trim() != '')
    //   .map((i) => i.img);
    // let vids = (this.videos ?? [])
    //   .filter((i) => i.link != undefined && i.link.trim() != '')
    //   .map((i) => i.link);
    // let imgLinks = (this.images ?? [])
    //   .filter((i) => i.link != undefined && i.link.trim() != '')
    //   .map((i) => i.link);
    // let htmlTemplate = this.blockForm.controls['html'].value ?? '';
    // let btns = this.buttons ?? [];
    // let products = this.prods ?? [];
    // let grid =
    //   gridVal ?? (this.blockForm.controls['grid'].value as string) ?? '1';
    // let matchGrid = this.grid.find((g) => g.name == grid)?.block;
    // let row = new Block(
    //   name,
    //   Object.assign([], products),
    //   undefined,
    //   type,
    //   Object.assign([], imgs),
    //   matchGrid,
    //   html,
    //   backgroundColor,
    //   corners,
    //   '',
    //   imgLinks,
    //   btns,
    //   vids,
    //   htmlTemplate
    // );
    // if (
    //   products.find((i) => i == '0') ||
    //   products.find((i) => i == '1') ||
    //   products.find((i) => i == '2')
    // ) {
    //   row.products = [];
    //   row.smart_products = parseInt(products[0]);
    // }
    // this.activeBlock.block = row;
    // this.activeBlock.index = this.editingBlock;
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
      this.loadService.addLayout(this.editableLayout, this.wallet, (layout) => {
        this.layoutSaved.emit(layout);
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
    });
  }

  fontSize(block: Block) {
    // if (this.rootComponent?.isMobile() || (row.grid_row ?? 1) >= 2) {
    //   return 12;
    // }
    return (0.5 / (block.grid?.rows ?? 1)) * 100;
  }

  titleFontSize(block: Block) {
    // if (this.rootComponent?.isMobile() || (row.grid_row ?? 1) >= 2) {
    //   return 12;
    // }
    return (0.3 / (block.grid?.rows ?? 1)) * 100;
  }

  // products(smartProducts?: number, products?: Array<String>) {
  //   if (smartProducts !== undefined) {
  //     if (smartProducts == 0) {
  //       return this.newArrivalProducts();
  //     } else if (smartProducts == 1) {
  //       return this.featuredProducts();
  //     }
  //   }
  //   var prod = Array<NFT>();
  //   products?.forEach((p) => {
  //     let pro = Object.values(
  //       this?.collections?.find((pr) => {
  //         let k = Object.values(pr.NFTs)?.find((n) => {
  //           return n.docID == p;
  //         });
  //         return k;
  //       })?.NFTs ?? {}
  //     )?.find((n) => {
  //       return n.docID == p;
  //     });
  //     if (pro) {
  //       prod.push(pro);
  //     }
  //   });
  //   return prod;
  // }

  // selectedThemeFn() {
  //   let co = this.wallet.colorStyle?.btn_color;
  //   let bco = this.wallet.colorStyle?.bg_color;
  //   let name = this.wallet.colorStyle?.name;

  //   let color = 'rgba(' + co[0] + ',' + co[1] + ',' + co[2] + ',' + co[3] + ')';

  //   let bg_color =
  //     'rgba(' + bco[0] + ',' + bco[1] + ',' + bco[2] + ',' + bco[3] + ')';

  //   var theme: Dict<string> = {
  //     name: name,
  //     color: color,
  //     bg_color: bg_color,
  //   };
  //   return theme;
  // }

  // newArrivalProducts() {
  //   return Object.values((this?.collections ?? [])[0].NFTs)
  //     ?.sort(function (a, b) {
  //       // if (a.timestamp > b.timestamp) {
  //       //   return -1;
  //       // }
  //       // if (a.timestamp < b.timestamp) {
  //       //   return 1;
  //       // }
  //       return 1;
  //     })
  //     .slice(0, 4);
  // }

  // featuredProducts() {
  //   return Object.values((this?.collections ?? [])[0].NFTs)
  //     ?.sort(function (a, b) {
  //       // if (a.likes > b.likes) {
  //       //   return -1;
  //       // }
  //       // if (a.likes < b.likes) {
  //       //   return 1;
  //       // }
  //       return 1;
  //     })
  //     .slice(0, 4);
  // }

  // allProducts() {
  //   return this.wallet?.collections;
  // }

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
  }

  onAddChildControl(event: MouseEvent): void {
    event.stopPropagation();
    let index = (this.editableLayout?.pages.length ?? 0) + 1;

    let oldIndex = (this.editableLayout?.pages.length ?? 0) - 1;

    let oldPage = this.editableLayout?.pages[oldIndex];

    let page = Object.assign({}, JSON.parse(JSON.stringify(oldPage))) as Page

    page.name = `new page ${index}`
    page.title = `New Page ${index}`
    page.id = `${index}`
    page.url = `new-page-${index}`
    page.blocks = []
    page.icon = 'radio_button_unchecked'

    this.editableLayout?.pages.push(page);
    this.recalculateUniqIdsForDragDrop();
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
