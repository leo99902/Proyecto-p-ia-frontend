import { Injectable, input, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValuePathnameServiceService {
  public valuePathname: any = '';
  public pathname(pathname: string): any {
    if(pathname === '/home') {
      this.valuePathname = '/home';
      return this.valuePathname;
    }else if(pathname === '/usuarios') {
      this.valuePathname = '/usuarios';
    }
  }
}
