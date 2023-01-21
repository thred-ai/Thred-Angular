import { Pipe, PipeTransform } from '@angular/core';
import { Page } from 'thred-core';

@Pipe({
  name: 'pageList'
})
export class PageListPipe implements PipeTransform {

  transform(value: Page[], authPage: Page): Page[] {
    return [authPage].concat(value);
  }

}
