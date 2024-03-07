import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LineStatusComponent } from './line-status/line-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LineStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'line-status';
}
