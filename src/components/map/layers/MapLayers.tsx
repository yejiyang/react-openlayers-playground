import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";

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
