import { Location } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isAdmin',
})
export class IsAdminPipe implements PipeTransform {
  transform(value: string): boolean {
    return value.includes("dashboard")
  }
}
