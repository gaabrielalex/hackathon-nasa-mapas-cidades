# EcoMind - Visualizador de Dados Geoespaciais (MVP)

Este projeto é um protótipo de um visualizador de mapas interativo desenvolvido como parte da contribuição para a equipe EcoMind durante o **NASA Space Apps Challenge - Cuiabá**. A aplicação permite a análise de dados geoespaciais da cidade de São Paulo, focando em indicadores ambientais como o Índice de Vegetação por Diferença Normalizada (NDVI) e a Profundidade Óptica do Aerossol (AOD).

## Sobre o Hackathon

O NASA Space Apps Challenge é um hackathon global que estimula o uso de dados da NASA em soluções criativas.
Nesta edição em Cuiabá, a equipe desenvolveu o EcoMind, uma proposta voltada à análise ambiental urbana por meio de visualização geoespacial.

🔗 [Acesse o protótipo interativo](https://ecomind-two.vercel.app/)

## Funcionalidades do Mapa

- **Visualização de Camadas:** Alterne entre as camadas de dados de NDVI e AOD para comparar a vegetação e a qualidade do ar.
- **Mapa Base:** Utiliza o OpenStreetMap como mapa base para contextualização geográfica.
- **Delimitação de Distritos:** Exibe os limites dos distritos de São Paulo para uma análise mais detalhada.
- **Interatividade:** O mapa é totalmente interativo, permitindo zoom e navegação.

## Tecnologias Utilizadas

- **Frontend:** Angular v18+
- **Mapeamento:** OpenLayers
- **Estilo:** CSS nativo e moderno

## Como Executar o Projeto

1.  **Instale as dependências:**
    ```bash
    npm install
    ```
2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    ng serve
    ```
3.  Abra o navegador em `http://localhost:4200/`.
