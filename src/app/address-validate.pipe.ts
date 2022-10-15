import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'addressValidate',
})
export class AddressValidatePipe implements PipeTransform {
  transform(value: string) {
    try {
      let address = ethers.utils.isAddress(value);
      return address;
    } catch (error) {
      return false;
    }
  }
}
