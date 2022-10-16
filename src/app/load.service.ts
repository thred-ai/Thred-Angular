import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  providers: {
    any?: ethers.providers.JsonRpcProvider;
  } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformID)) {
      let chains = [1, 137];

      chains.forEach((chain) => {
        let str = `${chain}` as string;
        let rpcEndpoint1 = (environment.rpc as any)[str];

        let provider1 = new ethers.providers.JsonRpcProvider(rpcEndpoint1);
        (this.providers as any)[str] = provider1;
      });
    }
  }

  openItem(id: string) {
    this.router.navigateByUrl(`/utils/${id}`);
  }

  openCategory(id: string) {
    this.router.navigateByUrl(`/groups/${id}`);
  }

  openDevProfile(id: string) {
    this.router.navigateByUrl(`/developers/${id}`);
  }

  openAuth(id: string) {
    this.router.navigateByUrl(`/account?mode=${id}`);
  }

  openHome() {
    this.router.navigateByUrl(`/home`);
  }
}
