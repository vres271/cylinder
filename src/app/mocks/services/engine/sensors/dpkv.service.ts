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
    const t = new Date().valueOf();
    let subLevel;
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
