import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CdkDrag, CdkDragMove, CdkDragStart} from '@angular/cdk/drag-drop';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-line-status',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag
  ],
  templateUrl: './line-status.component.html',
  styleUrl: './line-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineStatusComponent {
  zoomLevel = 1;
  zoomOrigin = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };
  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };
  initialPosition = { x: 0, y: 0 };

  adjustZoom(event: any) {
    console.log(event);
    const delta = event.deltaY;

    // max zoom level 4 min zoom level 0.5
    if (delta > 0 && this.zoomLevel <= 0.5) {
      return;
    }

    if (delta < 0 && this.zoomLevel >= 4) {
      return;
    }

    this.zoomLevel = delta > 0 ? this.zoomLevel - 0.1 : this.zoomLevel + 0.1;

    this.zoomOrigin = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  moveObject(event: any) {
    console.log(event);
  }

  onDrag(event: CdkDragMove<any>) {
    // Calcula la distancia movida ajustada por el nivel de zoom
    const adjustedX = event.distance.x / this.zoomLevel;
    const adjustedY = event.distance.y / this.zoomLevel;

    // Actualiza la posición ajustada basándote en la posición inicial más la distancia movida
    this.adjustedPosition.x = this.initialPosition.x + adjustedX;
    this.adjustedPosition.y = this.initialPosition.y + adjustedY;

    // Aplica la transformación al elemento basándote en la posición ajustada acumulada
    const element = event.source.element.nativeElement;
    element.style.transform = `translate(${this.adjustedPosition.x}px, ${this.adjustedPosition.y}px)`;
  }




  onDragStart(event: CdkDragStart) {
    // Cuando el arrastre comienza, guarda la posición actual como la posición inicial
    this.initialPosition.x = this.adjustedPosition.x;
    this.initialPosition.y = this.adjustedPosition.y;
  }




}
