import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import {CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart} from '@angular/cdk/drag-drop';
import { MapObjectComponent } from './components/map-object/map-object.component';

interface Point {
  x: number;
  y: number;
}

interface MapObject {
  id: string;
  position: Point;
  size: { width: number, height: number };
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  borderRadius?: number;
  zIndex?: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  adjustPosition: Point;
  rotation?: number;
}

@Component({
  selector: 'app-line-status',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    MapObjectComponent
  ],
  templateUrl: './line-status.component.html',
  styleUrl: './line-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineStatusComponent implements AfterViewInit {
  @ViewChild('zoomContainer') zoomContainer: ElementRef;
  @ViewChild('visor') visor: ElementRef;
  @ViewChild('map') map: ElementRef;

  mapObjects: MapObject[] = [
    {
      id: '1',
      position: { x: 100, y: 100 },
      adjustPosition: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      backgroundColor: 'red',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '1',
      fontSize: 16,
      fontColor: 'white',
      rotation: 45
    },
    {
      id: '2',
      position: { x: 300, y: 300 },
      adjustPosition: { x: 300, y: 300 },
      size: { width: 200, height: 100 },
      backgroundColor: 'green',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '2',
      fontSize: 16,
      fontColor: 'white'
    },
    {
      id: '3',
      position: { x: 500, y: 500 },
      adjustPosition: { x: 500, y: 500 },
      size: { width: 100, height: 100 },
      backgroundColor: 'blue',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '3',
      fontSize: 16,
      fontColor: 'white'
    },
    {
      id: '3',
      position: { x: 1900, y: 1900 },
      adjustPosition: { x: 2000, y: 2000 },
      size: { width: 100, height: 100 },
      backgroundColor: 'blue',
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 1,
      text: '3',
      fontSize: 16,
      fontColor: 'white'
    }
  ]

  zoomLevel = 1;
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  ngAfterViewInit() {
    this.checkLimits();
  }

  adjustZoom(event: any) {
    console.log(event);
    const element = this.zoomContainer.nativeElement;
    const rect = element.getBoundingClientRect();
    const prevZoomLevel = this.zoomLevel;

    const mouseX = event.clientX - rect.left; // Posición X del ratón relativa al elemento
    const mouseY = event.clientY - rect.top;  // Posición Y del ratón relativa al elemento

    const delta = event.deltaY < 0 ? 1 : -1;  // Determinar dirección del zoom
    const zoomIntensity = 0.1;
    this.zoomLevel += delta * zoomIntensity;



    // Limitar el nivel de zoom entre 0.5 y 4 (o cualquier rango deseado)
    this.zoomLevel = Math.min(Math.max(this.zoomLevel, 0.5), 4);

    // si el zoom no cambia, no hagas nada más
    if (prevZoomLevel === this.zoomLevel) {
      return;
    }




    // Cálculo de las nuevas posiciones basado en el punto de zoom
    // Estos cálculos intentan mantener el punto bajo el cursor del ratón estático relativo al documento al aplicar el zoom
    const newLeft = mouseX * (1 - this.zoomLevel / prevZoomLevel) + rect.left;
    const newTop = mouseY * (1 - this.zoomLevel / prevZoomLevel) + rect.top;

    // Aplicar el nuevo zoom y las posiciones al elemento
    element.style.transform = `translate(${newLeft}px, ${newTop}px) scale(${this.zoomLevel})`;

  }




  moveObject(event: any) {
    console.log(event);
  }

  onDrag(event: CdkDragMove<any>) {
    // Actualiza la posición ajustada basándote en la posición inicial más la distancia movida
    this.adjustedPosition.x = this.position.x + event.distance.x;
    this.adjustedPosition.y = this.position.y + event.distance.y;

    // Aplica la transformación al elemento basándote en la posición ajustada acumulada
    const element = event.source.element.nativeElement;

    this.checkLimits();



  }

  checkLimits() {
    // Si el ancho del mapa es menor que el ancho del visor, no permitas que el mapa se mueva horizontalmente lo mismo con el eje Y y centra el mapa
    if (this.canvasSize.width < this.visor.nativeElement.clientWidth) {
      console.log('si');
      this.adjustedPosition.x = (this.visor.nativeElement.clientWidth - this.canvasSize.width) / 2;
    } else {
      if (this.adjustedPosition.x > 0) {
        this.adjustedPosition.x = 0;
      }

      if (this.adjustedPosition.x < -this.canvasSize.width + this.visor.nativeElement.clientWidth) {
        this.adjustedPosition.x = -this.canvasSize.width + this.visor.nativeElement.clientWidth;
      }
    }

    if (this.canvasSize.height < this.visor.nativeElement.clientHeight) {
      this.adjustedPosition.y = (this.visor.nativeElement.clientHeight - this.canvasSize.height) / 2;
    } else {
      if (this.adjustedPosition.y > 0) {
        this.adjustedPosition.y = 0;
      }

      if (this.adjustedPosition.y < -this.canvasSize.height + this.visor.nativeElement.clientHeight) {
        this.adjustedPosition.y = -this.canvasSize.height + this.visor.nativeElement.clientHeight;
      }
    }


    this.map.nativeElement.style.transform = `translate(${this.adjustedPosition.x}px, ${this.adjustedPosition.y}px)`;
  }

  onDragEnd(event: CdkDragEnd) {

  }

  onDragStart(event: CdkDragStart) {
    // Cuando el arrastre comienza, guarda la posición actual como la posición inicial
    this.position.x = this.adjustedPosition.x;
    this.position.y = this.adjustedPosition.y;
  }

  onDragMapObject(event: CdkDragMove<any>, mapObject: MapObject) {
    // Calcula la distancia movida ajustada por el nivel de zoom
    const adjustedX = event.distance.x / this.zoomLevel;
    const adjustedY = event.distance.y / this.zoomLevel;

    // Actualiza la posición ajustada basándote en la posición inicial más la distancia movida
    mapObject.adjustPosition.x = mapObject.position.x + adjustedX;
    mapObject.adjustPosition.y = mapObject.position.y + adjustedY;

    // Aplica la transformación al elemento basándote en la posición ajustada acumulada
    const element = event.source.element.nativeElement;
    element.style.transform = `translate(${mapObject.adjustPosition.x}px, ${mapObject.adjustPosition.y}px) rotate(${mapObject.rotation || 0}deg)`;
  }

  onDragStartMapObject(event: CdkDragStart, mapObject: MapObject) {
    // Cuando el arrastre termina, actualiza la posición del objeto del mapa con la posición ajustada
    mapObject.position.x = mapObject.adjustPosition.x;
    mapObject.position.y = mapObject.adjustPosition.y;
  }



}
