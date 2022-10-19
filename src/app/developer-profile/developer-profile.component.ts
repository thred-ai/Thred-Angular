import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ethers } from 'ethers';
import { Chain } from '../chain.model';
import { Developer } from '../developer.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrls: ['./developer-profile.component.scss'],
})
export class DeveloperProfileComponent implements OnInit {
  @Input() dev?: Developer = new Developer(
    'Arta Koroushnia',
    '1',
    [
      new Util(
        '123',
        '123',
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
        [
          new Signature(
            'My New Util',
            '123',
            '123',
            3,
            100,
            1665828483000,
            1665828483000,
            1,
            '123'
          ),
        ],
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
    1665828483000,
    'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
    ""
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
