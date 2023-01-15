import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NFT, NFTList } from 'thred-core';
import { LoadService } from '../load.service';

@Component({
  selector: 'app-add-nft',
  templateUrl: './add-nft.component.html',
  styleUrls: ['./add-nft.component.scss'],
})
export class AddNftComponent implements OnInit {
  @Input() data?: any;
  @Output() saved = new EventEmitter<{ nft: NFT } | "0">();

  nft?: NFT;

  constructor(private loadService: LoadService) {}

  chains?: any;
  chainList?: any[];

  async ngOnInit() {
    let nft = this.data as NFT;
    this.nft = nft ?? new NFT('', '', '', '', 0, 1, undefined);

    console.log(this.nft);
    this.loadService.loadedChains.subscribe((chains) => {
      this.chains = {};
      chains.forEach((chain) => {
        console.log(chain);
        this.chains[chain.id] = chain;
      });
      this.chainList = chains ?? [];
    });
  }

  loading = false;
  err: string = '';

  async save() {
    let address = this.nft?.address?.trim() ?? '';
    let tokenId = Number(this.nft?.tokenId) ?? 0;
    let chain = this.nft?.chainId ?? 0;
    this.err = '';
    if (this.nft && address != '' && tokenId > 0 && chain > 0) {
      this.loading = true;

      try {
        this.loadService.loadNFTs(
          new NFTList(0, [this.nft], undefined),
          (nfts) => {
            this.loading = false;
            let nft = nfts[0];
            if (nft && nft.title != '' && nft.img != '') {
              this.finish(nft);
            } else {
              this.err = 'NFT does not exist.';
            }
            console.log(nfts);
          }
        );
      } catch (error) {
        this.loading = false;
      }
    }
  }

  finish(nft: NFT) {
    this.saved.emit({ nft });
  }

  delete(){
    this.saved.emit("0");
  }

  // contains(chain: Chain) {
  //   return (
  //     ((this.utilForm.controls['networks'].value as Chain[]) ?? []).findIndex(
  //       (n) => n.id == chain.id
  //     ) >= 0
  //   );
  // }
}
