import { Component, EventEmitter, OnInit, Output, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { NameEnsLookupPipe } from '../name-ens-lookup.pipe';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  constructor(private router: Router) {}

  @Output() install = new EventEmitter<any>();

  item = new Util(
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
    'My New Util for my New NFT Collection. This utility is designed to work with all NFT Collections, regardless of the chain they are built on.',
    100,
    ethers.utils.parseEther('100'),
    3,
    true,
    false,
    0,
    0,
    [new Chain('Polygon', 137, 'MATIC'), new Chain('Ethereum', 1, 'ETH')],
    'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
  );

  category = new Category(
    'Discover More',
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
    4
  );

  back() {
    this.router.navigateByUrl('/home');
  }

  async ngOnInit() {}

  date() {
    return new Date();
  }

  installItem() {
    this.install.emit({ install: this.item });
  }

  onParentEvent(data: any) {
    // your logic here
  }

  chains(util: Util) {
    return util.chains.map((c) => c.name).join(', ');
  }
}
