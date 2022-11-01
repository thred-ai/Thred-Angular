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
    console.log(provider);
    let newProvider = await this.loadService.initializeProvider(provider);
    this.selected.emit(newProvider);
  }

  constructor(private loadService: LoadService) {}

  ngOnInit(): void {}
}
