import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() category?: Category = new Category(
    'Discover More',
    '1',
    [],
    4
  );

  openItem(id: string) {
    this.loadService.openItem(id);
  }

  scrollToRow() {
    if (isPlatformBrowser(this.platformID)) {
      const el = document.querySelector('.items-row');
      el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  constructor(
    private loadService: LoadService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  ngOnInit(): void {}
}
