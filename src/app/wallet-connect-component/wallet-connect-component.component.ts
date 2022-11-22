import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ethers } from 'ethers';
import { LoadService } from '../load.service';

@Component({
  selector: 'app-wallet-connect-component',
  templateUrl: './wallet-connect-component.component.html',
  styleUrls: ['./wallet-connect-component.component.scss'],
})
export class WalletConnectComponentComponent implements OnInit {
  savedProviders: {
    name: string;
    img: string;
    id: string;
    code: number;
    mobile: boolean;
  }[] = [];

  @Input() set providers(value: string[]) {
    this.savedProviders = value.map((v: string, index: number) => {
      let id = v.split('-').join('');
      return {
        name: v
          .split('-')
          .map((l) => {
            return l.charAt(0).toUpperCase() + l.slice(1);
          })
          .join(''),
        img: `assets/${id}.svg`,
        id,
        code: index,
        mobile: index != 0,
      };
    });
  }

  @Output() selected = new EventEmitter<
    ethers.providers.Web3Provider | undefined
  >();

  async selectedProvider(provider: number) {
    // (window as any).ethereum = null;
    // (window as any).ethereum = new PClass();
    // console.log((window as any).ethereum);

    //   try {
    //     // Request account access if needed
    //     const accounts = await ethereum.send('eth_requestAccounts');
    //     // Accounts now exposed, use them
    //     ethereum.send('eth_sendTransaction', { from: accounts[0], /* ... */ })
    // } catch (error) {
    //     // User denied account access
    // }

    let newProvider = await this.loadService.initializeProvider(provider);
    this.selected.emit(newProvider);
  }

  constructor(private loadService: LoadService) {}

  ngOnInit(): void {}
}

export class PClass {
  chainId: number = 1;

  async request(req: any) {
    let method = (req.method as string) ?? '';
    let params = (req.params as any[]) ?? [];
    console.log(req);

    if (method == 'eth_chainId') {
      return Promise.resolve(this.chainId);
    }
    else if (method == 'eth_blockNumber'){
      const p = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/6ITDh9cH13O7QaI61cL0QRvBQS-Js1km")
      return p.getBlockNumber()
    }
    else if (method == 'eth_estimateGas'){
      const p = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/6ITDh9cH13O7QaI61cL0QRvBQS-Js1km")
      let tx = params.find((p) => p)
      let from = tx.from
      let to = tx.to
      let value = tx.value
      let data = tx.data
      return p.estimateGas({to, data, value, from})
    }
    else if (method == 'eth_sendTransaction') {

      let str = ['0xb26Af90041B13A3b795c45DC2F2b7E6B6ac6b593'];
      return Promise.all(str);
    } else if (method == 'eth_accounts' || method == 'eth_requestAccounts') {
      let str = ['0xb26Af90041B13A3b795c45DC2F2b7E6B6ac6b593'];
      return Promise.all(str);
    } else if (method == 'wallet_switchEthereumChain') {
      let chain = params.find((p) => p)?.chainId ?? '0x1';
      this.chainId = ethers.BigNumber.from(chain).toNumber();
      return Promise.resolve(this.chainId);
    }
    
    return null;
  }
}
