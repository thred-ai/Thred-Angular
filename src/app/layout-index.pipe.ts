import { Pipe, PipeTransform } from '@angular/core';
import { Layout } from 'thred-core';
import { Dict } from './load.service';

@Pipe({
  name: 'layoutIndex'
})
export class LayoutIndexPipe implements PipeTransform {

  transform(value: number, titles: string[], layouts: Dict<Layout>): Layout {

    console.log(titles)
    console.log(value)
    let title = titles[value]

    return layouts[title];
  }

}
