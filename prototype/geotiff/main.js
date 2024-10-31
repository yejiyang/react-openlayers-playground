import GeoTIFF from "ol/source/GeoTIFF.js";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/WebGLTile.js";

const source = new GeoTIFF({
  sources: [
    {
      //   url: "https://openlayers.org/data/raster/no-overviews.tif",
      //   url: "https://ngimapservicestorage.blob.core.windows.net/geotiff/TNW/TWN-R01_cog.tif",
      url: "https://ngimapservicestorage.blob.core.windows.net/geotiff/TNW/TWN-R01.tif",
      //   overviews: ["https://openlayers.org/data/raster/no-overviews.tif.ovr"],
    },
  ],
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: source,
    }),
  ],
  view: source.getView(),
});
