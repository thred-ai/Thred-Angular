import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoPipe'
})
export class VideoPipePipe implements PipeTransform {

  transform(value: string) {
    return value.replace('youtu.be', 'youtube.com/embed').replace('watch?v=', 'embed/');
  }


}
