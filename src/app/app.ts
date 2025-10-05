import { Component, AfterViewInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';
import Feature from 'ol/Feature';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  private map!: Map;
  private ndviLayer!: ImageLayer<any>;
  private aodLayer!: ImageLayer<any>;
  isNDVIVisible = true;
  isAODVisible = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // 🗺️ Extent da área de São Paulo
    const extent: [number, number, number, number] = [
      -46.826929972940356,
      -24.00972175630451,
      -46.3642976016188,
      -23.35619738710756
    ];

    // 🌍 Camada base OSM
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // 🌿 NDVI (vegetação)
    this.ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: 'NDVI_SP_RGB_2024_3_TRANSP.png',
        imageExtent: extent,
        projection: 'EPSG:4326',
        interpolate: true
      }),
      opacity: 0.8,
      visible: true
    });

    // 🌫️ AOD (poluição atmosférica)
    this.aodLayer = new ImageLayer({
      source: new ImageStatic({
        url: 'AOD_SP_RGB_2024_TRANSP.png',
        imageExtent: extent,
        projection: 'EPSG:4326',
        interpolate: true
      }),
      opacity: 0.8,
      visible: false
    });

    // 🧭 Distritos (GeoJSON)
    const districtLayer = new VectorLayer({
      source: new VectorSource({
        url: 'Distritos_SP_GeoJSON.geojson',
        format: new GeoJSON()
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#222',
          width: 1.2
        }),
        fill: new Fill({
          color: 'rgba(255,255,255,0.05)'
        })
      })
    });

    // 🛰️ Cria o mapa
    this.map = new Map({
      target: 'map',
      layers: [baseLayer, this.ndviLayer, this.aodLayer, districtLayer],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat(getCenter(extent)),
        zoom: 9
      })
    });

    // 🧾 Tooltip dinâmica
    const tooltip = document.createElement('div');
    tooltip.id = 'district-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '6px 10px';
    tooltip.style.background = 'rgba(0, 0, 0, 0.75)';
    tooltip.style.color = 'white';
    tooltip.style.borderRadius = '6px';
    tooltip.style.font = '12px "Segoe UI", Arial, sans-serif';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.opacity = '0';
    this.el.nativeElement.appendChild(tooltip);

    // 🔍 Atualiza tooltip no hover
    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (f) => f as Feature);
      if (feature) {
        const nome = feature.get('nm_distrit');
        tooltip.innerText = nome;
        tooltip.style.left = evt.pixel[0] + 10 + 'px';
        tooltip.style.top = evt.pixel[1] + 10 + 'px';
        tooltip.style.opacity = '1';
      } else {
        tooltip.style.opacity = '0';
      }
    });
  }

  // 🌿 Mostrar NDVI
  showNDVI() {
    this.ndviLayer.setVisible(true);
    this.aodLayer.setVisible(false);
    this.isNDVIVisible = true;
    this.isAODVisible = false;
  }

  // 🌫️ Mostrar AOD
  showAOD() {
    this.ndviLayer.setVisible(false);
    this.aodLayer.setVisible(true);
    this.isNDVIVisible = false;
    this.isAODVisible = true;
  }
}
