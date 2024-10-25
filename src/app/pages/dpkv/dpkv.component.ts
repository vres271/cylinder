import { Component } from '@angular/core';
import { PlotterComponent } from '../../shared/components/plotter/plotter.component';
import { DPKVMockService } from '../../mocks/services/engine/sensors/dpkv.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-dpkv',
  standalone: true,
  imports: [
    PlotterComponent,
    AsyncPipe,
    ButtonComponent
  ],
  providers: [DPKVMockService],
  templateUrl: './dpkv.component.html',
  styleUrl: './dpkv.component.css'
})
export class DPKVComponent {

  dpkvSignal!: Observable<number>;

  constructor(private dpkv: DPKVMockService) {
    this.dpkvSignal = this.dpkv.generate$.asObservable();
    
  }

  startSignal() {
    this.dpkv.start();
  }

  stopSignal() {
    this.dpkv.stop();    
  }

  get signalStarted() {
    return this.dpkv.isActive;
  }

}
