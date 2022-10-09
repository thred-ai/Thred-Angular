import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { Util } from '../util.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  constructor() {}

  @Input() headline: string = '';

  @Input() items: Util[] = [];

  @ViewChild('carousel', { read: DragScrollComponent })
  ds?: DragScrollComponent;

  ngOnInit(): void {}

  moveRight() {
    console.log(this.ds?.currIndex);
    if (
      this.ds?.currIndex ==
      this.items.length - 1 - (this.isMobile() ? 0 : this.items.length / 2)
    ) {
      return;
    }
    this.ds?.moveRight();
  }

  moveLeft() {
    this.ds?.moveLeft();
  }

  isMobile = function () {
    if (window.innerWidth < 768) {
      return true;
    }
    return false;
  };
}
