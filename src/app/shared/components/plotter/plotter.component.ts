import { AsyncPipe } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ButtonComponent } from '../../../ui/button/button.component';

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
  imports: [AsyncPipe, ButtonComponent],
  templateUrl: './plotter.component.html',
  styleUrl: './plotter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})  

export class PlotterComponent implements OnInit, OnDestroy, AfterViewInit{

  height = 200;
  width = 900;
  bufferSize = 10000;
  buffer: IPlotPoint[] = [];

  point0: IPlotPoint = {x: 0, y: 0, t: 0}
  A = 1000;
  kY = this.height / this.A;
  shiftX = 0;
  i = 0;

  private ctx: CanvasRenderingContext2D | null = null;

  _value!: Observable<number>

  @Input() value!: Observable<IPoint>;
  @Input() scaleX: number = 1;
  @Input() scaleY: number = 1;
  @Input() frameW: number = 900;

  @ViewChild('canvasContainer', {read: ElementRef}) canvasContainerElem!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas', {read: ElementRef}) canvasElem!: ElementRef<HTMLCanvasElement>;

  private resizeObserver: ResizeObserver | null = null;

  constructor(private cd: ChangeDetectorRef) { }

  initCanvas(container: HTMLCanvasElement) {

    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.frameW = this.width;
    this.kY = this.height / this.A;
    this.cd.detectChanges();

    this.ctx = this.canvasElem.nativeElement.getContext("2d");
    if (this.ctx) {
      this.ctx.fillStyle = 'rgba(41, 46, 45, .8)';
      this.ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
      this.ctx.lineWidth = 1;
    }
  
  }

  ngAfterViewInit() {
  
    const container = this.canvasContainerElem.nativeElement;

    let lastResizeTime = 0;
    new ResizeObserver((a, observer) => {
      this.resizeObserver = observer;
      const t = new Date().valueOf();
      if (t - lastResizeTime > 10) {
        this.initCanvas(container);
        this.drawFromBuffer();
        lastResizeTime = t;
      }
    }).observe(container);

    this.initCanvas(container);

  }

  ngOnInit() {
    this.resetVars();
    this._value = this.value.pipe(
      tap(v => {
        const t = new Date().valueOf();
        const point: IPlotPoint = {
          t,
          x: v.x,
          y: v.y,
        }
        this.writeToBuffer(point);
        this.draw(point);
      }),
      map(point => 0.1 * point.y),
    )
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  drawFromBuffer() {
    this.resetVars();
    this.buffer.forEach(point => this.draw(point))
  }

  draw(point: IPlotPoint) {
    this.moveToPoint(point);
    const screenVector = this.drawVector(this.point0, point);
    if (screenVector.end.x >= this.frameW) {
      this.shiftX -= screenVector.end.x;
      this.clearRect();
    }
    this.point0 = {...point};
    this.i++;
  }

  resetVars() {
    this.point0 = {x: 0, y: 0, t: 0};
    this.i = 0;
    this.shiftX = 0;
    this.kY = this.height / this.A;
    this.clearAll();
  }

  moveToPoint(point: IPlotPoint) {
    if (!this.i) {
      const firstVector = this.toScreenVector(point, point);
      this.ctx?.moveTo(firstVector.start.x, firstVector.end.y);
    }
  }

  clearAll() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }

  writeToBuffer(point: IPlotPoint) {
    this.buffer.push(point);
    if (this.buffer?.length > this.bufferSize) {
      this.buffer.shift()
    }
  }

  drawScreenSegment(screenVector: IVector) {
    this.ctx?.beginPath();
    this.ctx?.lineTo(screenVector.start.x, screenVector.start.y);
    this.ctx?.lineTo(screenVector.end.x, screenVector.end.y);
    this.ctx?.closePath();
    this.ctx?.stroke();
  }

  drawVector(start: IPlotPoint, end: IPlotPoint) {
    const screenVector = this.toScreenVector(start, end)
    this.drawScreenSegment(screenVector);
    return screenVector;
  }

  toScreenVector(start: IPlotPoint, end: IPlotPoint) {
    return {
      start: {
        x: this.scaleX * start.x + this.shiftX, 
        y: this.height - this.scaleY * this.kY * start.y
      },
      end: {
        x: this.scaleX * end.x + this.shiftX, 
        y: this.height - this.scaleY * this.kY * end.y
      },
    }
  }

  clearRect() {
    this.ctx?.fillRect(0, 0, this.width, this.height);
  }



}
