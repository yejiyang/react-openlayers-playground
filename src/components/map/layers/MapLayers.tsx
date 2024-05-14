import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import OlSourceXYZ from "ol/source/XYZ";
import OlSourceWMTS from "ol/source/WMTS";
import TileGrid from "ol/tilegrid/TileGrid";
import { getWMTSOptionsFromStaticParams } from "../utils/getWMTSOptions";

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
    resolutions: [
      156543.03392800014, 78271.51696399994, 39135.75848200009, 19567.87924099992, 9783.93962049996, 4891.96981024998,
      2445.98490512499, 1222.992452562495, 611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324,
      38.21851414253662, 19.10925707126831, 9.554628535634155, 4.77731426794937, 2.388657133974685, 1.1943285668550503,
      0.5971642835598172, 0.298582141779908,
    ],
    extent: [-20037507.842788246, -20037508.342787, 20037507.842788246, 20037508.342787],
    tileSize: [256, 256],
  }),
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
};

const norwayTopographicSource = new OlSourceWMTS(
  getWMTSOptionsFromStaticParams(
    "topo",
    "googlemaps",
    [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
    [
      156543.033928041, 78271.51696402048, 39135.758482010235, 19567.87924100512, 9783.93962050256, 4891.96981025128,
      2445.98490512564, 1222.99245256282, 611.49622628141, 305.7481131407048, 152.8740565703525, 76.43702828517624,
      38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879,
      0.5971642834779395, 0.2985821417389698,
    ],
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
    256,
    "https://cache.kartverket.no/topo/v1/wmts/1.0.0/?",
    "anonymous"
  )
);

export const getNorwayTopographicLayer = () => {
  const layer = new OlLayerTile({
    source: norwayTopographicSource,
    zIndex: zIndexBaseLayer,
    opacity: opacityBaseLayer,
  });

  layer.set("name", "norway-topographic-layer");
  layer.set("apiName", "NORWAY_TOPOGRAPHIC");
  return layer;
};
