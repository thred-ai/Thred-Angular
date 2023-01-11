import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
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
import { Media } from '../media.model';
import { MediaTableComponent } from '../media-table/media-table.component';

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

  @Input() wallet!: Wallet;
  @Input() color!: string;

  @Output() layoutSaved = new EventEmitter<{ time: number; layout?: Layout }>();
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
    private loadService: LoadService
  ) {
    this.mode = 1;
  }

  selectedTheme: Dict<any> = {};

  async ngOnInit() {
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
    if (this.editableLayout) {
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

    this.saveLayout(0);
  }

  async changeLayout(mode = 1) {
    if (this.layout) {
      // let time = new Date().getTime();
      // this.layoutSaved.emit({ time });
      this.loadService.changeLayout(
        this.layout,
        this.wallet,
        mode,
        (layout) => {
          console.log(layout);
          this.layout = layout;
          // this.layoutSaved.emit({ time, layout });
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

    this.activeBlock = undefined
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
    if (
      this.activeBlock?.blockIndex == blockIndex &&
      this.activeBlock?.pageIndex == pageIndex
    ) {
      return;
    }

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
