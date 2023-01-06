import { Component, Input, OnInit } from '@angular/core';
import { Block } from '../block.model';
import { Grid } from '../grid.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  constructor() { }

  items: { type: number; data: any }[] = [];
  grid!: Grid;

  @Input() set block(block: Block) {
    this.grid = block.grid
    console.log(block)
    switch (block.type) {
      case 0:
        this.items = (block.nftList.nfts ?? []).map((nft) => {
          return {
            type: block.type,
            data: nft,
          };
        });
        break;
      case 1:
        this.items = (block.imgs ?? []).map((img) => {
          return {
            type: block.type,
            data: img,
          };
        });
        break;
    }
  }



  ngOnInit(): void {
  }

}
