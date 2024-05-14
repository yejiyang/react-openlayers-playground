import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import OlSourceXYZ from "ol/source/XYZ";
import TileGrid from "ol/tilegrid/TileGrid";

const zIndexBaseLayer = 1;
const opacityBaseLayer = 1;

export const osmTileLayer = new OlLayerTile({
  source: new OlSourceOsm(),
  zIndex: 1,
});

export const getOsmTileLayer = () => {
  const layer = new OlLayerTile({
    source: new OlSourceOsm(),
    zIndex: 1,
  });

  layer.set("name", "osm-tile-layer");
  return layer;
};

// Norway satellite layer: https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBilder/MapServer
const norwaySatelliteSource = new OlSourceXYZ({
  url: "https://services.geodataonline.no/arcgis/rest/services/Geocache_WMAS_WGS84/GeocacheBilder/MapServer/tile/{z}/{y}/{x}",
  crossOrigin: "anonymous",
  tileGrid: new TileGrid({
    resolutions:[
      156543.03392800014, 78271.51696399994, 39135.75848200009, 19567.87924099992, 9783.93962049996, 4891.96981024998,
      2445.98490512499, 1222.992452562495, 611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324,
      38.21851414253662, 19.10925707126831, 9.554628535634155, 4.77731426794937, 2.388657133974685, 1.1943285668550503,
      0.5971642835598172,0.298582141779908
    ],
    extent: [-20037507.842788246, -20037508.342787, 20037507.842788246, 20037508.342787],
    tileSize: [256, 256]
  })

});

export const getNorwaySatelliteLayer = () => {
  const layer = new OlLayerTile({
    source: norwaySatelliteSource,
    zIndex: zIndexBaseLayer,
    opacity: opacityBaseLayer,
  });

  layer.set("name", "norway-satellite-layer");
  layer.set("apiName", "SATELLITE_NORWAY");
  return layer;
}