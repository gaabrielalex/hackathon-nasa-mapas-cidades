import { Component, AfterViewInit, inject, NgZone } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {
  private map!: L.Map;
  private zone = inject(NgZone);

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initializeMap());
  }

  private initializeMap(): void {
    const container = document.getElementById('map');
    if (!container) {
      console.error('❌ Elemento #map não encontrado.');
      return;
    }

    container.style.height = '100vh';
    container.style.width = '100vw';
    console.log('🗺️ Iniciando mapa GreenPulse São Paulo...');

    // 🗺️ Cria o mapa centralizado em São Paulo
    this.map = L.map(container, {
      center: [-23.55, -46.63],
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      zoomControl: true,
      preferCanvas: true,
      maxBounds: L.latLngBounds(
        L.latLng(-23.9, -47.1), // sudoeste
        L.latLng(-23.2, -46.2)  // nordeste
      ),
      maxBoundsViscosity: 1.0
    });

    // 🧭 Camada base OpenStreetMap (leve e sem desalinhamento)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap | GreenPulse 2025'
    }).addTo(this.map);

    // 🌍 Carrega o GeoJSON (verifique se está em "src/assets/greenpulse_mock.geojson")
    fetch('assets/greenpulse_mock.geojson')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const text = await res.text();
        if (text.trim().startsWith('<')) {
          throw new Error('O arquivo retornado não é JSON válido (recebeu HTML).');
        }
        return JSON.parse(text);
      })
      .then(data => {
        const geoLayer = L.geoJSON(data, {
          style: (feature: any) => ({
            color: '#333',
            weight: 1,
            fillOpacity: 0.7,
            fillColor:
              feature.properties.gpi > 0.5 ? '#2ecc71' :
              feature.properties.gpi > 0.25 ? '#f1c40f' : '#e74c3c'
          }),
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            layer.bindPopup(`
              <b>${p.bairro}</b><br/>
              🌿 NDVI: ${p.ndvi}<br/>
              🌫️ AOD: ${p.aod}<br/>
              🧮 GPI: ${p.gpi}<br/>
              ${p.classificacao}
            `);
          }
        }).addTo(this.map);

        // Centraliza o mapa conforme os dados
        const bounds = geoLayer.getBounds();
        this.map.fitBounds(bounds, { padding: [20, 20] });
        setTimeout(() => this.map.invalidateSize(true), 400);
      })
      .catch(err => console.error('⚠️ Erro ao carregar GeoJSON:', err));

    // 📊 Legenda
    const legend = (L as any).control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <b>Índice GreenPulse</b><br/>
        <span style="background:#2ecc71"></span> Saudável<br/>
        <span style="background:#f1c40f"></span> Moderado<br/>
        <span style="background:#e74c3c"></span> Crítico<br/>
      `;
      return div;
    };
    legend.addTo(this.map);

    // 🔄 Recalcula tamanho no resize
    window.addEventListener('resize', () => this.map.invalidateSize(true));

    // 📍 Botão para recentralizar
    const recenter = (L as any).control({ position: 'bottomleft' });
    recenter.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = '<a href="#" title="Centralizar São Paulo">📍</a>';
      div.onclick = () => {
        this.map.flyTo([-23.55, -46.63], 12);
      };
      return div;
    };
    recenter.addTo(this.map);
  }
}
