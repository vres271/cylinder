import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DPKVMockService {

  public generate$ = new BehaviorSubject<number>(0);
  isActive = false;
  private state = {
    level: false,
    lastSwitchTime: 0,
  }

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
    this.dpkv();
    //this.meandr();
  }

  dpkv() {
    const t = new Date().valueOf();
    let counter = 0;
    let minY: number | undefined = undefined;
    let maxY: number | undefined = undefined;
    let setupCounter = 0;
    const noise = 200 * Math.random() - 100;
    let A = 1000;
    if (counter > 20) {
      A = 2000;
    }
    if (counter > 23) {
      counter = 0;
    }
    let prevY = 0;
    let prevdY = 0;
    const y = 0.5 * A * Math.sin(0.02 * t) + 0.5 * A;
    let dY = y - prevY;
    // if (setupCounter++ < 1000) {
    //   minY = minY === undefined || A <= minY ? y : minY;
    //   maxY = maxY === undefined || A >= maxY ? y : maxY;
    // } else {
      console.log(y, prevY, dY)
      if (dY > 0 && prevdY < 0) {
        console.log(counter)
        counter++;
      }
    // }
    prevdY = dY;
    prevY = y;
    this.generate$.next(y);
    setTimeout(() => {
      this.next()
    }, 10)

  }

  meandr() {
    const t = new Date().valueOf();
    if (t - this.state.lastSwitchTime > 50) {
      this.state.lastSwitchTime = t;
      this.state.level = !this.state.level;
    }
    const dt = Math.round((this.state.level ? 800 : 300) - 200 * Math.random());
    this.generate$.next(dt);
    setTimeout(() => {
      this.next()
    }, dt / 100)

  }

}
