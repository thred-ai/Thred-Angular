import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ethers } from 'ethers';
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
export class DeveloperProfileComponent implements OnInit {
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

  getProfile() {
    let uid = this.getId();

    console.log(uid)
    if (uid) {
      this.loadService.getUserInfo(uid, (dev) => {
        this.dev = dev;
        console.log(dev);
      });
    } else {
    }
  }

  getId() {
    const routeParams = this.router.snapshot.paramMap;
    const id = routeParams.get('dev') as string;

    return id;
  }

  constructor(
    private loadService: LoadService,
    private router: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  ngOnInit(): void {
    this.getProfile()
  }
}
