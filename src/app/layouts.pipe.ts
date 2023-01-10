import { Pipe, PipeTransform } from '@angular/core';
import { Layout } from './layout.model';
import { Dict } from './load.service';

@Pipe({
  name: 'layouts',
})
export class LayoutsPipe implements PipeTransform {
  transform(value: string[], layouts: Dict<Layout>): Layout[] {
    return (
      Object.values(layouts).filter(
        (layout) => value.findIndex((v) => layout.type == v) > -1
      ) ?? []
    );
  }
}
