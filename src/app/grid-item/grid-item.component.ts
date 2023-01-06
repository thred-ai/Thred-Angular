import { Component, Input, OnInit } from '@angular/core';
import { Grid } from '../grid.model';

@Component({
  selector: 'app-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss'],
})
export class GridItemComponent implements OnInit {
  constructor() {}
  @Input() item!: { type: number; data: any };
  @Input() grid!: Grid;


  ngOnInit(): void {}

}
