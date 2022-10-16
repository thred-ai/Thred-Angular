import { Component, EventEmitter, OnInit, Output, Pipe } from '@angular/core';
import { Router } from '@angular/router';
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
    [new Chain('Polygon', 137), new Chain("Ethereum", 1)],
    'https://firebasestorage.googleapis.com/v0/b/clothingapp-ed125.appspot.com/o/Resources%2Fimg.jpeg?alt=media'
  );

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
  );

  back() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
   
  }

  date() {
    return new Date();
  }

  open() {
    console.log('installing');
    this.install.emit({ install: this.item });
  }

  onParentEvent(data: any) {
    // your logic here
  }

  chains(util: Util) {
    return util.chains.map((c) => c.name).join(', ');
  }
}
