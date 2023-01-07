import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Block } from '../block.model';
import { Layout } from '../layout.model';
import { Page } from '../page.model';
import { Tab } from '../tab.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  @Input() currentPage!: {
    page: Page;
    index: number;
  };
  @Input() editable!: boolean;
  @Input() layout!: Layout;
  @Input() overrideBlock?: {
    block: Block;
    index: number;
  };

  @Output() updatePages = new EventEmitter<any>();

  @Output() updateBlocks = new EventEmitter<any>();
  @Output() clickedLayout = new EventEmitter<any>();

  @Output() edit = new EventEmitter<{
    blockIndex: number;
    pageIndex: number;
  }>();

  @Output() pageChanged = new EventEmitter<number>();

  @ViewChild('mainFrame') mainFrame!: HTMLElement;

  constructor() {}

  ngOnInit(): void {}
}
