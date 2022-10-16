import { Component, Input, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Input() category?: Category = new Category(
    'Discover More',
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
    4
  );

  openItem(id: string){
    this.loadService.openItem(id)
  }
  
  constructor(private loadService: LoadService) { }

  ngOnInit(): void {
  }

}
