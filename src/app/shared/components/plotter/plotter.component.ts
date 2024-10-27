import { AsyncPipe } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-plotter',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './plotter.component.html',
  styleUrl: './plotter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PlotterComponent implements OnInit, AfterContentInit{

  height = 200;
  width = 900;
  private ctx!: CanvasRenderingContext2D | null;

  _value!: Observable<number>

  @Input() value!: Observable<number>;
  @Input() scaleX: number = 1;
  @Input() scaleY: number = 1;
  @Input() frameW: number = 900;

  constructor() {
  }

  initCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.fillStyle = 'rgba(41, 46, 45, .9)';
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 0.5;
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.initCanvas();
    }, 100)
  }


  ngOnInit() {
    const cH = this.height;
    const cW = this.width;

    if (this.ctx) {
      this.ctx.moveTo(0,cH/2);
    }
  
    let t = 0;
    let prevT = 0; 
    let prevV = 0; 
    const A = 1000;
    const kY = cH / A;
    this._value = this.value.pipe(
      tap(v => {
        if (this.ctx) {
          const ctx = this.ctx;
          ctx.beginPath();
          ctx.lineTo(prevT, cH - this.scaleY * kY * prevV);
          ctx.lineTo(t, cH - this.scaleY * kY * v);
          ctx.closePath();
          ctx.stroke();
          if (t >= this.frameW) {
            t = 0;
            ctx.fillRect(0,0,cW,cH);
          }
          prevT = t;
          prevV = v;
        }
        t+=+this.scaleX;
      }),
      map(v => 0.1 * v),
    )
  }


}
