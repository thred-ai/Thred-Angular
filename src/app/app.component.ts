import { isPlatformBrowser, Location } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { ethers } from 'ethers';
import { AuthComponent } from './auth/auth.component';
import { LoadService } from './load.service';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Meta, Title } from '@angular/platform-browser';
import { ProfileComponent } from './profile/profile.component';
import { Developer, Wallet } from 'thred-core';
// import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  expandedSearch = false;
  mode = 0;
  selectedInstall?: Wallet;
  localStorage?: Storage;

  constructor(
    private cdr: ChangeDetectorRef,
    private loadService: LoadService,
    private _router: Router,
    public router: ActivatedRoute,
    public location: Location,
    @Inject(PLATFORM_ID) private platformID: Object,
    private dialog: MatDialog
  ) {
    if (isPlatformBrowser(this.platformID)) {
      this.localStorage = localStorage;
      this.display = true;
    } else {
      this.display = false;
    }
  }

  featuredUtil?: Wallet;
  display = false;
  connected?: string = undefined;

  sendToChildEmitter = new EventEmitter();

  onChildEvent(data: any) {
    // your logic here
    if (data && data.install) {
      console.log(data);
      this.selectedInstall = data.install;
      this.mode = 2;
      this.sidenav?.toggle();
    }
  }

  isMobile() {
    if (isPlatformBrowser(this.platformID)) {
      let height = window.innerHeight;
      let width = window.innerWidth;
      return width < height;
    }
    return false;
  }

  @ViewChild('drawer') public sidenav?: MatSidenav;

  editProfile() {
    this.loadService.currentUser.then((user) => {
      if (user) {
        let uid = user.uid;
        let email = user.email ?? '';
        let url = localStorage['url'] ?? '';
        let name = localStorage['name'];

        let dev = new Developer(name, uid, [], 0, url, email);

        const modalRef = this.dialog.open(ProfileComponent, {
          width: '750px',
          maxHeight: '80vh',
          maxWidth: '100vw',
          panelClass: 'app-full-bleed-sm-dialog',

          data: {
            dev,
          },
        });
      }
    });
  }

  viewProfile() {
    this.loadService.currentUser.then((user) => {
      if (user) {
        let uid = user.uid;
        this.loadService.openDash(uid);
      } else {
        this.loadService.openAuth('0');
      }
    });
  }

  signOut() {
    this.loadService.signOut((success) => {});
  }

  isBrowser() {
    return isPlatformBrowser(this.platformID);
  }

  close() {
    this.sidenav?.close();
    this.mode = 0;
    this.selectedInstall = undefined;
  }

  async onActivate(event: any) {
    let component = event as AuthComponent;
    if (component && component.isAuth) {
      let user = await this.loadService.currentUser;

      if (user) {
        this.loadService.openDash(user.uid);
      }
    }

    if (isPlatformBrowser(this.platformID)) {
      window.scroll(0, 0);

      let menu = document.getElementById('profile-menu');

      if (menu) {
        let toggle = document.getElementById('profile-toggle');
        toggle?.click();
      }
    }

    if (this.sidenav?.opened ?? false) {
      this.close();
    }

    this.cdr.detectChanges();

    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // });

    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }

  routeToAuth(mode = '0') {
    this.loadService.openAuth(mode);
  }

  routeToHome() {
    this.loadService.openHome();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformID)) {
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      window.addEventListener('resize', () => {
        // We execute the same script as before
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    }
  }

  updateBar(event: boolean) {
    console.log(event);
    this.expandedSearch = event;
    this.cdr.detectChanges();
  }
}
