import { Pipe, PipeTransform } from '@angular/core';
import { Layout } from './layout.model';

@Pipe({
  name: 'layouts',
})
export class LayoutsPipe implements PipeTransform {
  transform(value: string[], layouts: Layout[]): Layout[] {
    return (
      layouts.filter(
        (layout) => value.findIndex((v) => layout.type == v) > -1
      ) ?? []
    );
  }
}
