import { Component, OnInit } from '@angular/core';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  constructor() { }

  item = new Util(
    '123',
    '123',
    new Signature('My New Util', '123', '123', 3, 100, '123'),
    'Thred Developer',
    'My New Util',
    [
      'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
    ],
    '123',
    'My New Util for my New NFT Collection. This utility is designed to work with all NFT Collections, regardless of the chain they are built on.',
    100,
    3,
    true,
    false,
    0,
    0,
    [new Chain('Polygon', 137)],
    'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
  )

  category = new Category(
    'Discover More',
    1,
    [
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
      new Util(
        '123',
        '123',
        new Signature('My New Util', '123', '123', 3, 100, '123'),
        'Thred Developer',
        'My New Util',
        [
          'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fthumbnail_image%20(69).png?alt=media',
        ],
        '123',
        'My New Util for my New NFT Collection.',
        100,
        3,
        true,
        false,
        0,
        0,
        [new Chain('Polygon', 137)],
        'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
      ),
    ],
    4
  )

  ngOnInit(): void {
  }

  date(){
    return new Date()
  }

}
