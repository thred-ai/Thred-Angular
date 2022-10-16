import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadService } from '../load.service';
import { Util } from '../util.model';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
})
export class FeaturedComponent implements OnInit {
  @Input() item?: Util;

  @Output() install = new EventEmitter<any>();

  constructor(private loadService: LoadService) {}

  openItem(id: string) {
    this.loadService.openItem(id);
  }

  ngOnInit(): void {}


  installItem() {
    this.install.emit({ install: this.item });
  }
}
