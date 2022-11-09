import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { ethers } from 'ethers';
import { Chain } from '../chain.model';
import { LoadService } from '../load.service';
import { Util } from '../util.model';

@Component({
  selector: 'app-app-list-component',
  templateUrl: './app-list-component.component.html',
  styleUrls: ['./app-list-component.component.scss'],
})
export class AppListComponentComponent implements OnInit {
  mode = 0;
  loading = false;
  apps?: Util[] = [];
  provider?: ethers.providers.Web3Provider = undefined;
  address?: string;
  chainId: Chain = this.chains[0];

  get chains() {
    return this.loadService.chains ?? [];
  }

  @Output() selected = new EventEmitter<{
    provider?: ethers.providers.Web3Provider;
    address?: string;
    chain?: number;
    app?: Util;
  }>();

  constructor(
    private loadService: LoadService,
    @Inject(PLATFORM_ID) private platformID: Object
  ) {}

  async complete(provider?: ethers.providers.Web3Provider) {
    this.provider = provider;
    let signer = provider?.getSigner();
    let user = await signer?.getAddress();
    this.address = user;
    console.log(user)

    this.loadApps();
  }

  loadApps(
    chain = this.chainId,
    provider = this.loadService.providers[chain.id].ethers,
    user = this.address
  ) {
    this.loading = true;
    this.loadService.getCoreABI(chain.id, async (result) => {
      if (result) {
        let abi = result.abi;
        let address = result.address;

        try {
          let contract = new ethers.Contract(address, abi, provider);

          let data = (await contract['fetchAppsForUser'](user)) as string[];

          let filtered = [...new Set(data.filter((d) => d != ''))];

          console.log(filtered)
          this.loadService.getItems(filtered, (apps) => {
            this.loading = false;
            this.mode = 1;
            this.apps = apps ?? [];
          });
        } catch (error) {
          this.loading = false;
          this.mode = 1;
          this.apps = [];
        }
      }
    });
  }

  open(app: Util) {
    if (this.chainId && this.provider) {
      this.loadService.checkChain(this.chainId?.id, this.provider).then(() => {
        this.selected.emit({
          provider: this.provider,
          address: this.address,
          chain: this.chainId.id,
          app,
        });
      });
    }
  }

  async changed(event: MatSelectChange) {
    this.chainId = event.value;
    this.apps = undefined

    this.loadApps();
  }

  ngOnInit(): void {}
}
