import { Component, EventEmitter, OnInit, Output, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { Category } from '../category.model';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { NameEnsLookupPipe } from '../name-ens-lookup.pipe';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  constructor(private router: Router, private _router: ActivatedRoute, private loadService: LoadService) {
    this.loadService.getNewItems((result) => {
      this.category.utils = this.shuffle(result);
    });
  }

  @Output() install = new EventEmitter<any>();

  item?: Util = undefined 

  category = new Category(
    'Discover More',
    '1',
    [],
    4
  );

  shuffle(arr: any[]) {
    let m = arr.length,
      i;
    while (m) {
      i = (Math.random() * m--) >>> 0;
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  back() {
    this.router.navigateByUrl('/home');
  }

  getItem(){
    let id = this.getId()
    this.loadService.getItem(id, result => {
      this.item = result
    }, true)
  }

  getId() {
    const routeParams = this._router.snapshot.paramMap;
    const id = routeParams.get('util') as string;

    return id;
  }

  viewDev(){
    this.loadService.openDevProfile(this.item!.creator)
  }

  async ngOnInit() {
    this.getItem()
  }

  date() {
    return new Date();
  }

  installItem() {
    if (this.item?.status == 1) { return }
    this.install.emit({ install: this.item });
  }

  onParentEvent(data: any) {
    // your logic here
  }

  chains(util: Util) {
    return util.chains.map((c) => c.name).join(', ');
  }
}
