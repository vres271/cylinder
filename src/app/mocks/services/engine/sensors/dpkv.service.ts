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

  prevY = 0;
  prevdY = 0;
  counter = 0;
  toothStart = 5; 
  toothW = 1; 

  dpkv() {
    const t = new Date().valueOf();
    let minY: number | undefined = undefined;
    let maxY: number | undefined = undefined;
    let setupCounter = 0;
    const noise = 200 * Math.random() - 100;
    let A = 500;
    let v = 0.04;
    if (this.counter > this.toothStart) {
      A = 1000;
      v = 0.01;
    }
    if (this.counter > this.toothStart + this.toothW) {
      this.counter = 0;
    }
    const y = (0.5 * A * Math.sin(v * t)) + 500;
    let dY = y - this.prevY;
    // if (setupCounter++ < 1000) {
    //   minY = minY === undefined || A <= minY ? y : minY;
    //   maxY = maxY === undefined || A >= maxY ? y : maxY;
    // } else {
      if (dY > 0 && this.prevdY < 0) {
        console.log(this.counter)
        this.counter++;
      }
    // }
    this.prevdY = dY;
    this.prevY = y;
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
