import { NFT } from './nft.model';

export class NFTList {
  type: number;
  nfts?: NFT[];
  contract?: string;

  constructor(type: number, nfts?: NFT[], contract?: string) {
    this.type = type;
    this.nfts = nfts;
    this.contract = contract;
  }
}
