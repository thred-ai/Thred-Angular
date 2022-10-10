import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { Util } from '../util.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformID: Object) {}

  @Input() headline: string = '';

  @Input() cols: number = 0;

  @Input() items: Util[] = [];

  @ViewChild('carousel', { read: DragScrollComponent })
  ds?: DragScrollComponent;

  ngOnInit(): void {}

  moveRight() {
    if (
      this.ds?.currIndex ==
      this.items.length - this.cols
    ) {
      return;
    }
    this.ds?.moveRight();
  }

  moveLeft() {
    this.ds?.moveLeft();
  }

  isMobile() {
    if (isPlatformBrowser(this.platformID)) {
      if (window.innerWidth < 768) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
}
