import { Component, OnInit } from '@angular/core';
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
  utilCategories: Category[] = [
    new Category(
      'Great New Utilities',
      1,
      [
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
      ],
      3
    ),
    new Category(
      'Most Popular',
      2,
      [
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
        new Util(
          '123',
          '123',
          new Signature('My New Util', '123', '123', 3, 100, '123'),
          'Thred Developer',
          'My New Util',
          [
            'https://storage.googleapis.com/thred-protocol.appspot.com/Test/app_img.png',
          ],
          '123',
          'My New Util for my New NFT Collection.',
          100,
          ethers.BigNumber.from(0),
          3,
          true,
          false,
          0,
          0,
          [new Chain('Polygon', 137)],
          'https://storage.googleapis.com/thred-protocol.appspot.com/Test/img.png'
        ),
      ],
      4
    ),
  ];

  featuredUtil?: Util;

  constructor() {
    this.featuredUtil = this.utilCategories[0].utils[0];
  }

  ngOnInit(): void {}
}
