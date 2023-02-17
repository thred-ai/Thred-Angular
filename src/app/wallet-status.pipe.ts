import { Pipe, PipeTransform } from '@angular/core';
import { Wallet } from 'thred-core';

@Pipe({
  name: 'walletStatus',
})
export class WalletStatusPipe implements PipeTransform {
  transform(value: Wallet[], status: number[]): Wallet[] {
    return value.filter((v) => {
      return status.find((s) => s == v.status) != undefined;
    });
  }
}
