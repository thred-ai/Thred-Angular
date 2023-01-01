import { Pipe, PipeTransform } from '@angular/core';
import { Dict } from './load.service';
import { Wallet } from './wallet.model';

@Pipe({
  name: 'storeTheme',
})
export class StoreThemePipe implements PipeTransform {
  transform(wallet: Wallet | undefined) {
    // let co = wallet?.colorStyle?.btn_color;
    // let bco = wallet?.colorStyle?.bg_color;
    // let name = wallet?.colorStyle?.name;

    // if (co && bco && name) {
    //   let color =
    //     'rgba(' + co[0] + ',' + co[1] + ',' + co[2] + ',' + co[3] + ')';

    //   let bg_color =
    //     'rgba(' + bco[0] + ',' + bco[1] + ',' + bco[2] + ',' + bco[3] + ')';

    //   var theme: Dict<string> = {
    //     name: name,
    //     color: color,
    //     bg_color: bg_color,
    //   };
    //   return theme;
    // }

    return undefined;
  }
}
