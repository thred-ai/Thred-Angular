import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
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
    new Category(
      'Great New Utilities',
      '1',
      [
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
      ],
      3
    ),
    new Category(
      'Most Popular',
      '2',
      [
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            '123'
          ),
          1665828483000,
          1665828483000,
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.utils.parseEther('100'),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137, 'MATIC')],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
      ],
      4
    ),
  ];

  featuredUtil?: Util;
  display = true;
  constructor(@Inject(PLATFORM_ID) private platformID: Object) {
    this.featuredUtil = this.utilCategories[0].utils[0];
    if (!isPlatformBrowser(this.platformID)) {
      this.display = false;
    }
  }

  ngOnInit(): void {}

  onParentEvent(data: any) {
    // your logic here
  }
}


