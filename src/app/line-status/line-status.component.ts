import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, viewChild } from '@angular/core';
import {CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart} from '@angular/cdk/drag-drop';
import { MapObjectComponent } from './components/map-object/map-object.component';
import Panzoom from '@panzoom/panzoom'

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
    MapObjectComponent,
  ],
  templateUrl: './line-status.component.html',
  styleUrl: './line-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineStatusComponent implements AfterViewInit {
  @ViewChild('map') map: ElementRef;
  @ViewChild('visor') visor: ElementRef;

  mapObjects: MapObject[] = [
    {
      id: '1',
      position: { x: 100, y: 100 },
      adjustPosition: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
      backgroundColor: 'pink',
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
    }
  ]

  zoomLevel = 1;
  zoomOrigin: Point = { x: 0, y: 0 };
  canvasSize = { width: 2000, height: 2000 };

  position = { x: 0, y: 0 };
  adjustedPosition = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    const elem = document.getElementById('map')
    console.log(elem);
    const panzoom = Panzoom(elem, {
      maxScale: 5,
      minScale: 0.5,
      canvas: true,
      excludeClass: 'ls-map-object',
      contain: 'outside',
    });
    console.log(panzoom);
    panzoom.pan(0, 0)
    panzoom.zoom(1, { animate: true })


    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    // There are several available methods for zooming
    // that can be bound on button clicks or mousewheel.
    elem.parentElement.addEventListener('wheel', (e) => {
      const zoom = panzoom.zoomWithWheel(e);
      this.zoomLevel = zoom.scale;
    });
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
