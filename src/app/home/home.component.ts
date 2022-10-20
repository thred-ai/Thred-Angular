import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() install = new EventEmitter<any>();

  utilCategories: Category[] = [
    new Category('Great New Utilities', '1', [], 3),
    new Category('Most Popular', '2', [], 4),
  ];

  featuredUtil?: Util;
  display = true;
  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private loadService: LoadService
  ) {
    if (isPlatformBrowser(this.platformID)) {
      this.loadService.getFeaturedItem((result) => {
        this.featuredUtil = result;
      });
      this.loadService.getNewItems((result) => {
        this.utilCategories[0].utils = result;
      });
      this.loadService.getNewItems((result) => {
        this.utilCategories[1].utils = result.reverse();
      });
    } else {
      this.display = false;
    }
  }

  ngOnInit(): void {}

  onParentEvent(data: any) {
    // your logic here
  }
}
