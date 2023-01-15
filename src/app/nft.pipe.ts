import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NftTokenType } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { NFT } from 'thred-core';
import { LoadService } from './load.service';

@Pipe({
  name: 'nft'
})
export class nftPipe implements PipeTransform {
  constructor(private loadService: LoadService) {}

  transform(nft: NFT) {

    
    // let tokenType = NftTokenType[type]
    // return this.loadService.providers[chainId].alchemy.nft.getNftMetadata(address, tokenId, tokenType)
  }

}
