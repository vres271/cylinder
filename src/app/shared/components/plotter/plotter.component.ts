import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-plotter',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './plotter.component.html',
  styleUrl: './plotter.component.css'
})
export class PlotterComponent implements OnInit{

  _value!: Observable<number>

  @Input() value!: Observable<number>;

  constructor() {
  }

  ngOnInit() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = 'green';
      ctx.strokeStyle = 'silver';
      ctx.lineWidth = 0.5;
      ctx.moveTo(0,250);
    }
  
    let t = 0;
    let prevT = 0; 
    let prevV = 0; 
    const step = 5;
    this._value = this.value.pipe(
      tap(v => {
        if (ctx) {
          ctx.beginPath();
          ctx.lineTo(prevT, 500 - 0.5*prevV);
          ctx.lineTo(t, 500 - 0.5*v);
          ctx.closePath();
          ctx.stroke();
          if (t >= 1200) {
            t = 0;
            ctx.clearRect(0,0,1200,500);
          }
          prevT = t;
          prevV = v;
        }
        t+=step;
      }),
      map(v => 0.1 * v),
    )
  }

}
