import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';

import {
  moveItemInArray,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CDK_DRAG_CONFIG,
} from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DomSanitizer } from '@angular/platform-browser';
import { SummernoteOptions } from 'ngx-summernote/lib/summernote-options';
import { LoadService, Dict } from '../load.service';
import { MatTabGroup } from '@angular/material/tabs';
import * as html2canvas from 'html2canvas';
import { Block, Layout, NFT, NFTList, Page, Wallet } from 'thred-core';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000,
};

@Component({
  selector: 'app-layout-builder',
  templateUrl: './layout-builder.component.html',
  styleUrls: ['./layout-builder.component.scss'],
  providers: [{ provide: CDK_DRAG_CONFIG, useValue: DragConfig }],
})
export class LayoutBuilderComponent implements OnInit {
  loaded = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  items = {};

  @HostListener('document:keydown.control.z') undo(event: KeyboardEvent) {
    console.log('oy');
    // responds to control+z
  }

  @HostListener('document:keydown.meta.z') undoApple(event: KeyboardEvent) {
    console.log('apple oy');
    // responds to control+z
    this.changeLayout(-1);
  }

  mode = 0;
  codeMode = false;
  pageDisplay?: string;

  changeSetting() {
    this.mode = this.mode == 0 ? 1 : 0;
  }


  // config2: SummernoteOptions = {
  //   placeholder: '',
  //   tabsize: 2,
  //   height: 200,
  //   toolbar: [['misc', ['undo', 'redo', 'codeview']]],
  //   fontNames: [],
  // };

  title = 'LAUNCHING LAYOUT BUILDER';

  @Input() wallet!: Wallet;
  @Input() color!: string;

  @Output() layoutSaved = new EventEmitter<{ time: number; layout?: Layout }>();
  @Output() layoutChanged = new EventEmitter<{
    time: number;
    layout?: Layout;
    mode: number;
  }>();

  @Output() clickedCanvas = new EventEmitter<boolean>();

  @Input() set layout(value: Layout) {
    if (!this.editableLayout) {
      console.log(value.pages[0])
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
    private loadService: LoadService
  ) {
    this.mode = 1;
  }

  selectedTheme: Dict<any> = {};

  async ngOnInit() {
    await this.refreshNFTS();

    this.recalculateUniqIdsForDragDrop();

    this.cdr.detectChanges();
  }

  defaultNFTs = [
    new NFT(
      '',
      '',
      'https://cdn.simplehash.com/assets/9d1b2dc7a3ae37f313efce97b1bb8af53365809b82be47c169a2fdf61c9f26b1.png',
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      1,
      1
    ),
    new NFT(
      '',
      '',
      'https://cdn.simplehash.com/assets/b3df9c78238ba23b0b65b5de687e1232e2a709c3ed091c6f20ec374967a4f29b.png',
      '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
      1,
      1
    ),
    new NFT(
      '',
      '',
      'https://cdn.simplehash.com/assets/a200bf39b8c8ec73d1f42aaa579c688a37837090e1eed7cfe461be204448d680.png',
      '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
      1,
      1
    ),
  ]

  async refreshNFTS() {
    if (this.editableLayout) {
      await Promise.all(
        this.editableLayout.pages?.map((page, index) => {
          if (page.blocks) {
            return Promise.all(
              page.blocks!.map((block) => {
                if (block.type == 0) {
                  return this.loadService.loadNFTs(block.nftList, (nfts) => {
                    console.log(nfts);
                    console.log(block.nftList);
                    block.nftList.nfts = nfts;
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
      this.saveLayout(0);
    }

    await this.loadService.loadNFTs(new NFTList(0, this.defaultNFTs), (nfts) => {
      console.log(nfts);
      this.defaultNFTs = nfts;
    });
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

  openBar = true;

  activeBlock?: {
    block: Block;
    blockIndex: number;
    pageIndex: number;
  };

  drop(event: any, pageIndex: number) {
    let arr = this.editableLayout?.pages[pageIndex].blocks ?? [];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    if (
      this.activeBlock &&
      this.activeBlock?.blockIndex == event.previousIndex
    ) {
      this.activeBlock.blockIndex = event.currentIndex;
    }
    this.saveLayout(0);
  }

  saveLayout(delay = 750) {
    console.log(delay);
    setTimeout(() => {
      this.save();
    }, delay);
  }

  async save() {
    let display = document.getElementById('display');
    if (this.editableLayout && display) {
      // html2canvas
      //   .default(display, { allowTaint: true, useCORS: true })
      //   .then((canvas) => {
      //     document.body.appendChild(canvas);

      //     let url = canvas.toDataURL();

      //     console.log(url);
      //   });

      let time = new Date().getTime();
      this.layoutSaved.emit({ time });
      this.loadService.addLayout(this.editableLayout, this.wallet, (layout) => {
        this.editableLayout!.id = layout.id;
        this.layoutSaved.emit({ time, layout: this.editableLayout });
      });
    }
  }

  removeBlocks(index: number, pageIndex: number) {
    this.editableLayout?.pages[pageIndex]?.blocks?.splice(index, 1);
    // this.saveLayout(0);

    this.cdr.detectChanges();
  }

  addBlock(pageIndex: number, block: Block) {
    let rows =
      (this.editableLayout?.pages[pageIndex]?.blocks as Array<Block>) ?? [];
    rows.push(block);

    this.edit(rows.length - 1, pageIndex);

    this.saveLayout(0);
  }

  async changeLayout(mode = 1) {
    if (this.editableLayout) {
      let time = new Date().getTime();
      this.layoutChanged.emit({ time, layout: undefined, mode });
      this.loadService.changeLayout(
        this.editableLayout,
        this.wallet,
        mode,
        (layout) => {
          console.log(layout);
          this.editableLayout = layout;
          this.layoutChanged.emit({ time, layout, mode });
        }
      );
    }
  }

  finishedEditing(mode: number = 0, blockIndex: number, pageIndex: number) {
    let blocks = this.editableLayout?.pages[pageIndex].blocks ?? [];

    if (blocks[blockIndex] != undefined) {
      switch (mode) {
        // @ts-ignore
        case 1:
          this.removeBlocks(blockIndex, pageIndex);
          break;
        default:
          break;
      }
    }

    this.activeBlock = undefined;
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

  updatePages(event: CdkDragDrop<Page[]>) {
    console.log(event);
    moveItemInArray(
      this.editableLayout?.pages ?? [],
      event.previousIndex,
      event.currentIndex
    );

    if (this.activeBlock?.pageIndex == event.previousIndex) {
      this.activeBlock.pageIndex = event.currentIndex;
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

  async edit(blockIndex: number, pageIndex: number) {
    console.log(blockIndex);
    console.log(pageIndex);
    if (
      this.activeBlock?.blockIndex == blockIndex &&
      this.activeBlock?.pageIndex == pageIndex
    ) {
      return;
    }

    this.activeBlock = undefined;

    console.log(blockIndex);
    console.log(pageIndex);
    console.log(this.editableLayout?.pages[pageIndex].blocks![blockIndex]);

    this.activeBlock = {
      block: Object.assign(
        {},
        JSON.parse(
          JSON.stringify(
            this.editableLayout?.pages[pageIndex].blocks![blockIndex]
          )
        )
      ),
      blockIndex,
      pageIndex,
    };

    this.cdr.detectChanges();
  }
}
