import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPipe',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currency: string = 'VND', locale: string = 'vi-VN') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }
}
