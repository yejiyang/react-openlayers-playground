import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import OlSourceXYZ from "ol/source/XYZ";
import OlSourceWMTS from "ol/source/WMTS";
import OlSourceTileWMS from "ol/source/TileWMS";
import TileGrid from "ol/tilegrid/TileGrid";
import { getWMTSOptionsFromStaticParams } from "../utils/getWMTSOptions";

const defaultZIndexBaseLayer = 1;
const defaultOpacityBaseLayer = 1;
const defaultTileSize = 256;
const defaultMatrixIds0_19 = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
];
const defaultResolutions0_19 = [
  156543.03392800014, 78271.51696399994, 39135.75848200009, 19567.87924099992, 9783.93962049996, 4891.96981024998,
  2445.98490512499, 1222.992452562495, 611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324,
  38.21851414253662, 19.10925707126831, 9.554628535634155, 4.77731426794937, 2.388657133974685, 1.1943285668550503,
  0.5971642835598172, 0.298582141779908,
];
const defaultExtent3857 = [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244];

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
    resolutions: defaultResolutions0_19,
    extent: defaultExtent3857,
    tileSize: [defaultTileSize, defaultTileSize],
  }),
});

export const getNorwaySatelliteLayer = () => {
  const layer = new OlLayerTile({
    source: norwaySatelliteSource,
    zIndex: defaultZIndexBaseLayer,
    opacity: defaultOpacityBaseLayer,
  });

  layer.set("name", "norway-satellite-layer");
  layer.set("apiName", "SATELLITE_NORWAY");
  return layer;
};

const norwayTopographicSource = new OlSourceWMTS(
  getWMTSOptionsFromStaticParams(
    "topo",
    "googlemaps",
    defaultExtent3857,
    defaultResolutions0_19,
    defaultMatrixIds0_19,
    defaultTileSize,
    "https://cache.kartverket.no/topo/v1/wmts/1.0.0/?",
    "anonymous"
  )
);

export const getNorwayTopographicLayer = () => {
  const layer = new OlLayerTile({
    source: norwayTopographicSource,
    zIndex: defaultZIndexBaseLayer,
    opacity: defaultOpacityBaseLayer,
  });

  layer.set("name", "norway-topographic-layer");
  layer.set("apiName", "NORWAY_TOPOGRAPHIC");
  return layer;
};

const norwayTopographicGreySource = new OlSourceWMTS(
  getWMTSOptionsFromStaticParams(
    "topograatone",
    "googlemaps",
    defaultExtent3857,
    defaultResolutions0_19,
    defaultMatrixIds0_19,
    defaultTileSize,
    "https://cache.kartverket.no/topograatone/v1/wmts/1.0.0/?",
    "anonymous"
  )
);

export const getNorwayTopographicGreyLayer = () => {
  const layer = new OlLayerTile({
    source: norwayTopographicGreySource,
    zIndex: defaultZIndexBaseLayer,
    opacity: defaultOpacityBaseLayer,
  });

  layer.set("name", "norway-topographic-grey-layer");
  layer.set("apiName", "NORWAY_TOPOGRAPHIC_GRAYSCALE");
  return layer;
};

const gebcoGlobalShadedReliefSource = new OlSourceTileWMS({
  url: "https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?",
  params: {
    layers: "GEBCO_LATEST",
  },
  crossOrigin: "anonymous",
});

export const getGebcoGlobalShadedReliefLayer = () => {
  const layer = new OlLayerTile({
    source: gebcoGlobalShadedReliefSource,
    zIndex: defaultZIndexBaseLayer,
    opacity: defaultOpacityBaseLayer,
  });

  layer.set("name", "gebco-global-shaded-relief-layer");
  layer.set("apiName", "GEBCO_WORLD");
  return layer;
};
