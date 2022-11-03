import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ethers } from 'ethers';
import { filter, map } from 'rxjs/operators';
import { Chain } from '../chain.model';
import { Developer } from '../developer.model';
import { LoadService } from '../load.service';
import { Signature } from '../signature.model';
import { Util } from '../util.model';

@Component({
  selector: 'app-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrls: ['./developer-profile.component.scss'],
})
export class DeveloperProfileComponent implements OnInit, OnDestroy {
  oldUrl = '';

  private sub = this._router.events
    .pipe(
      filter((event) => event instanceof NavigationStart),
      map((event) => event as NavigationStart), // appease typescript
      filter(
        (event) => event.url !== this.oldUrl
      )
    )
    .subscribe((event) => {
      this.oldUrl = event.url;
      this.getProfile(event.url.split("/").reverse()[0])
    });

  @Input() dev?: Developer;

  openItem(id: string) {
    this.loadService.openItem(id);
  }

  scrollToRow() {
    if (isPlatformBrowser(this.platformID)) {
      const el = document.querySelector('.items-row');
      el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  getProfile(uid = this.getId()) {

    console.log(uid);
    if (uid) {
      this.loadService.getUserInfo(uid, true, true, (dev) => {
        if (dev){
          this.dev = dev;
          this.loadService.addTags(
            `${dev.name} - Thred App Store`,
            dev.url,
            `Join ${dev.name} on Thred today!`,
            'thredapps.io'
          );
        }
      });
    } else {
    }
  }

  back() {
    this._router.navigateByUrl('/home');
  }

  getId() {
    const routeParams = this.router.snapshot.paramMap;
    const id = routeParams.get('dev') as string;

    return id;
  }

  constructor(
    private loadService: LoadService,
    private router: ActivatedRoute,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  ngOnInit(): void {
    this.getProfile();
  }
}
