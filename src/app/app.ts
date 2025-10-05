import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';
import OSM from 'ol/source/OSM';
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
    // 🗺️ Extent do NDVI (extraído do GeoTIFF original)
    const extent: [number, number, number, number] = [
      -46.826929972940356,
      -24.00972175630451,
      -46.3642976016188,
      -23.35619738710756
    ];

    // 🌍 Camada base do OpenStreetMap
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // 🌿 Camada NDVI como imagem georreferenciada (PNG)
    const ndviLayer = new ImageLayer({
      source: new ImageStatic({
        url: 'NDVI_SP_RGB_2024_3_TRANSP.png', // ✅ caminho para o PNG
        imageExtent: extent,                     // área real de São Paulo
        projection: 'EPSG:4326',                 // mesmo CRS do GEE
        interpolate: true                        // suaviza pixels
      }),
      opacity: 0.5                              // transparência da camada NDVI
    });

    // 🛰️ Inicializa o mapa
    new Map({
      target: 'map',
      layers: [baseLayer, ndviLayer],
      view: new View({
        projection: 'EPSG:3857',                 // reprojeta para o OSM
        center: fromLonLat(getCenter(extent)),   // centraliza na RMSP
        zoom: 9
      })
    });
  }
}
