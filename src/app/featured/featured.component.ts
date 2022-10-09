import { Component, Input, OnInit } from '@angular/core';
import { Util } from '../util.model';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {

  @Input() item?: Util

  constructor() { }

  ngOnInit(): void {
  }

}
