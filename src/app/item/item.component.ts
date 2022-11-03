import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ethers } from 'ethers';
import { filter, map } from 'rxjs/operators';
import { AppComponent } from '../app.component';
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
export class ItemComponent implements OnInit, OnDestroy {
  oldUrl = '';

  private sub = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationStart),
      map((event) => event as NavigationStart), // appease typescript
      filter((event) => event.url !== this.oldUrl)
    )
    .subscribe((event) => {
      this.oldUrl = event.url;
      this.getItem(event.url.split('/').reverse()[0]);
    });

  constructor(
    private router: Router,
    private _router: ActivatedRoute,
    private loadService: LoadService
  ) {
    this.loadService.getNewItems((result) => {
      this.category.utils = this.shuffle(result);
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @Output() install = new EventEmitter<any>();

  item?: Util = undefined;

  category = new Category('Discover More', '1', [], 4);

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

  getItem(id = this.getId()) {
    this.loadService.getItem(
      id,
      (result) => {
        this.item = result;
        if (result) {
          console.log(result)
          this.loadService.addTags(
            `${result.name} - ${result.creatorName}`,
            result.coverUrl ?? result.displayUrls[0],
            result.description ?? '',
            'thredapps.io'
          );
          this.loadService.logView(result.id, result.creator);
        }
      },
      true
    );
  }

  getId() {
    const routeParams = this._router.snapshot.paramMap;
    const id = routeParams.get('app') as string;

    return id;
  }

  viewDev() {
    this.loadService.openDevProfile(this.item!.creator);
  }

  async ngOnInit() {
    this.getItem();
  }

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
