import { Component, signal } from '@angular/core';

import { SimulacionComponent } from './simulacion/simulacion';

@Component({
  selector: 'app-root',
  imports: [SimulacionComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Monte-Carlo');
}
