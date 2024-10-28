import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlotterComponent } from '../../shared/components/plotter/plotter.component';
import { DPKVMockService } from '../../mocks/services/engine/sensors/dpkv.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'app-dpkv',
  standalone: true,
  imports: [
    PlotterComponent,
    AsyncPipe,
    ButtonComponent,
    InputComponent,
  ],
  providers: [DPKVMockService],
  templateUrl: './dpkv.component.html',
  styleUrl: './dpkv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DPKVComponent {

  dpkvSignal!: Observable<number>;
  test = 123;
  xScale = 10;
  yScale = 1;
  frameW = 998;

  constructor(private dpkv: DPKVMockService) {
    this.dpkvSignal = this.dpkv.generate$;
    
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
