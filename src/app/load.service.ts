import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  
  providers: {
    any? : ethers.providers.JsonRpcProvider
  } = {}

  constructor() { 

    let chains = [1, 137]

    chains.forEach(chain => {
      let str = `${chain}` as string
      let rpcEndpoint1 = (environment.rpc as any)[str];
  
      let provider1 = new ethers.providers.JsonRpcProvider(rpcEndpoint1);
      (this.providers as any)[str] = provider1
    })
    console.log(this.providers)
  }

  

}
