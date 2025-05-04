import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'toRequired'})

export class RequiredPipe implements PipeTransform {
  transform(value: string) {
    return value + ' không được để trống';
  }
}
