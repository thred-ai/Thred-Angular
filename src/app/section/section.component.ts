import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { LoadService } from '../load.service';
import { Util } from '../util.model';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformID: Object, private loadService: LoadService) {}

  @Input() headline: string = '';

  @Input() cols: number = 0;

  @Input() items: Util[] = [];

  @ViewChild('carousel', { read: DragScrollComponent })
  ds?: DragScrollComponent;

  ngOnInit(): void {}

  openItem(id: string){
    this.loadService.openItem(id)
  }

  width(){
    if (isPlatformBrowser(this.platformID)){
      return window.innerWidth
    }
    return globalThis.innerWidth
  }

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
