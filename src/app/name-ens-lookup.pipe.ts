import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { LoadService } from './load.service';

@Pipe({
  name: 'nameEnsLookup',
})
export class NameEnsLookupPipe implements PipeTransform {
  constructor(private loadService: LoadService) {}

  transform(value: string) {
    try {
      return (this.loadService.providers as any)['1']?.resolveName(value);
    } catch (error) {
      return null
    }
  }
}
