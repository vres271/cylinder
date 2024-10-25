import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DPKVMockService {

  public generate$ = new BehaviorSubject<number>(0);
  isActive = false;

  constructor() { }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.next();
  }
  
  stop() {
    this.isActive = false;
  }
  
  next() {
    if (!this.isActive) return;
    const dt = Math.round(1000 - 500 * Math.random());
    this.generate$.next(dt);
    setTimeout(() => {
      this.next()
    }, dt / 100)
  }

}
