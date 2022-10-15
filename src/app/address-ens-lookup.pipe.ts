import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { LoadService } from './load.service';

@Pipe({
  name: 'addressEnsLookup',
})
export class AddressEnsLookupPipe implements PipeTransform {
  constructor(private loadService: LoadService) {}

  transform(value: string) {
    try {
      return (this.loadService.providers as any)['1']?.lookupAddress(value);
    } catch (error) {
      console.log(error)
      return null;
    }
  }
}
