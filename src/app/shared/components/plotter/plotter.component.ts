import { AsyncPipe } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export interface IPoint {
  x: number;
  y: number;
}

export interface IPlotPoint extends IPoint{
  t: number;
}

export interface IVector {
  start: IPoint;
  end: IPoint;
}

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
  bufferSize = 100;
  buffer: IPoint[] = [];

  private ctx!: CanvasRenderingContext2D | null;

  _value!: Observable<number>

  @Input() value!: Observable<IPoint>;
  @Input() scaleX: number = 1;
  @Input() scaleY: number = 1;
  @Input() frameW: number = 900;

  constructor() {
  }

  initCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
    if (this.ctx) {
      this.ctx.fillStyle = 'rgba(41, 46, 45, .8)';
      this.ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
      this.ctx.lineWidth = 1;
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.initCanvas();
    }, 100)
  }

  point0: IPlotPoint = {
    x: 0,
    y: 0,
    t: 0,
  };
  A = 1000;
  kY = this.height / this.A;
  shiftX = 0;

  ngOnInit() {
    this.kY = this.height / this.A;

    if (this.ctx) {
      this.ctx.moveTo(0, this.height/2);
    }
    this._value = this.value.pipe(
      tap(v => {
        const t = new Date().valueOf();
        const point: IPlotPoint = {
          t,
          x: v.x,
          y: v.y,
        }
        this.writeToBuffer(point);
        const screenVector = this.drawVector(this.point0, point);
        if (screenVector.end.x >= this.frameW) {
          this.shiftX -= screenVector.end.x;
          this.clearRect();
        }
        this.point0 = {...point};
      }),
      map(point => 0.1 * point.y),
    )
  }

  writeToBuffer(point: IPlotPoint) {
    this.buffer.push(point);
    if (this.buffer?.length > this.bufferSize) {
      this.buffer.shift()
    }
  }

  drawScreenSegment(screenVector: IVector) {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.lineTo(screenVector.start.x, screenVector.start.y);
    this.ctx.lineTo(screenVector.end.x, screenVector.end.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  drawVector(start: IPlotPoint, end: IPlotPoint) {
    const screenVector = {
      start: {
        x: this.scaleX * start.x + this.shiftX, 
        y: this.height - this.scaleY * this.kY * start.y
      },
      end: {
        x: this.scaleX * end.x + this.shiftX, 
        y: this.height - this.scaleY * this.kY * end.y
      },
    }
    this.drawScreenSegment(screenVector);
    return screenVector;
  }

  clearRect() {
    if (!this.ctx) return;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }



}
