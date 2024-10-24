import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';

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
    this._value = this.value.pipe(
      map(v => 0.1*v)
    )
  }

}
