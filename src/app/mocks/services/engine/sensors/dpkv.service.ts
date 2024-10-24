import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DPKVMockService {

  public generate$ = new BehaviorSubject<number>(0);
  private isActive = false;

  constructor() { }

  start() {
    this.isActive = true;
    this.next();
  }
  
  next() {
    if (!this.isActive) return;
    const dt = Math.round(1000 - 100 * Math.random());
    this.generate$.next(dt);
    setTimeout(() => {
      this.next()
    }, dt / 100)
  }

}
