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
    new Category('Great New Apps', '1', [], 3),
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
        this.utilCategories[0].utils = result.slice(0, 6);
      });
      this.loadService.getPopularItems((result) => {
        this.utilCategories[1].utils = result.slice(0, 6);
      });
    } else {
      this.display = false;
    }
  }

  ngOnInit(): void {
    this.loadService.addTags(
      `Thred | App Store`,
      `https://storage.googleapis.com/thred-protocol.appspot.com/resources/thred_link.png`,
      `Buy, Sell, Discover Smart Contract Apps`,
      'thredapps.io'
    );
  }

  onParentEvent(data: any) {
    // your logic here
  }
}
