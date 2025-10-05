import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    // 🗺️ Extent do NDVI (mesmo usado antes)
    const extent: [number, number, number, number] = [
      -46.826929972940356,
      -24.00972175630451,
      -46.3642976016188,
      -23.35619738710756
    ];

    // 🌍 Base OSM
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // 🌿 NDVI (imagem PNG georreferenciada)
    const ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: 'NDVI_SP_RGB_2024_3_TRANSP.png', // com transparência
        imageExtent: extent,
        projection: 'EPSG:4326',
        interpolate: true
      }),
      opacity: 0.8
    });

    // 🧭 Distritos municipais (GeoJSON)
    const districtLayer = new VectorLayer({
      source: new VectorSource({
        url: 'Distritos_SP_GeoJSON.geojson', // seu arquivo GeoJSON
        format: new GeoJSON()
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#222222',
          width: 1.3
        })
      })
    });

    // 🛰️ Cria o mapa
    new Map({
      target: 'map',
      layers: [baseLayer, ndviLayer, districtLayer],
      view: new View({
        projection: 'EPSG:3857',
        center: fromLonLat(getCenter(extent)),
        zoom: 9
      })
    });
  }
}
