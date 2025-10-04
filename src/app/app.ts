import { Component, AfterViewInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    // 🗺️ Camada base (OpenStreetMap)
    const base = new TileLayer({
      source: new OSM()
    });

    // 🎨 Função de cor por índice GPI
    const getColorByGPI = (gpi: number): string => {
      if (gpi < 0.1) return '#d73027';   // 🔴 crítico
      if (gpi < 0.3) return '#fc8d59';   // 🟠 alerta
      if (gpi < 0.5) return '#fee08b';   // 🟡 moderado
      return '#1a9850';                  // 🟢 saudável
    };

    // 🌿 Camada GeoJSON
    const vector = new VectorLayer({
      source: new VectorSource({
        url: 'greenpulse_mock.geojson',
        format: new GeoJSON()
      }),
      style: (feature) => {
        const gpi = feature.get('gpi') ?? 0;
        const color = getColorByGPI(gpi);
        return new Style({
          fill: new Fill({ color: color + '99' }),
          stroke: new Stroke({ color: '#333', width: 1 })
        });
      }
    });

    // 🧭 Inicializa o mapa
    const map = new Map({
      target: 'map',
      layers: [base, vector],
      view: new View({
        center: fromLonLat([-46.63, -23.55]),
        zoom: 12
      })
    });

    // 📍 Popup (Overlay)
    const popup = document.createElement('div');
    popup.className = 'popup';
    const overlay = new Overlay({
      element: popup,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10]
    });
    map.addOverlay(overlay);

    // 🎯 Clique nos bairros → exibe popup
    map.on('singleclick', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const props = feature.getProperties();
        popup.innerHTML = `
          <b>${props['bairro']}</b><br>
          🌿 NDVI: ${props['ndvi']}<br>
          💨 AOD: ${props['aod']}<br>
          🧮 GPI: ${props['gpi']}<br>
          ${props['classificacao']}
        `;
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // 🧾 Legenda fixa
    const legend = document.createElement('div');
    legend.className = 'legend';
    legend.innerHTML = `
      <h4>Índice GreenPulse (GPI)</h4>
      <div><span style="background:#1a9850"></span>🟢 Saudável</div>
      <div><span style="background:#fee08b"></span>🟡 Moderado</div>
      <div><span style="background:#fc8d59"></span>🟠 Alerta</div>
      <div><span style="background:#d73027"></span>🔴 Crítico</div>
    `;
    document.body.appendChild(legend);
  }
}
