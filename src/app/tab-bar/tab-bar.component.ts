import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Page } from '../page.model';
import { Tab } from '../tab.model';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss'],
})
export class TabBarComponent implements OnInit {
  constructor() {}

  @Input() position!: number;
  @Input() tab!: Tab;
  @Input() pages!: Page[];
  @Input() selectedIndex!: number;

  @Output() indexChanged = new EventEmitter<number>();

  @Output() update = new EventEmitter<CdkDragDrop<Page[]>>();

  ngOnInit(): void {}

  onDropPage(event: CdkDragDrop<Page[]>): void {

    this.update.emit(event);
  }
}
