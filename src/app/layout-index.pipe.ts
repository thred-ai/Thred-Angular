import { Pipe, PipeTransform } from '@angular/core';
import { Layout } from './layout.model';

@Pipe({
  name: 'layoutIndex'
})
export class LayoutIndexPipe implements PipeTransform {

  transform(value: number, titles: string[], layouts: Layout[]): number {

    let title = titles[value]

    return layouts.findIndex(layout => layout.type == title);
  }

}
