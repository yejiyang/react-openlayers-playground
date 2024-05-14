import { Extent } from "ol/extent";
import { Options } from "ol/source/WMTS.js";
import OlTilegridWMTS from "ol/tilegrid/WMTS.js";

const getWMTSTileGrid = (extent: Extent, resolutions: number[], matrixIds: string[], tileSize: number) => {
  const tileGrid = new OlTilegridWMTS({
    extent: extent,
    resolutions: resolutions,
    matrixIds: matrixIds,
    tileSize: tileSize,
  });

  return tileGrid;
};

export const getWMTSOptionsFromStaticParams = (
  wmsLayers: string,
  matrixSet: string,
  extent: Extent,
  resolutions: number[],
  matrixIds: string[],
  tileSize: number,
  serviceUrl: string,
  crossOrigin: string
) => {
  const options: Options = {
    layer: wmsLayers,
    matrixSet: matrixSet,
    crossOrigin: crossOrigin,
    tileGrid: getWMTSTileGrid(extent, resolutions, matrixIds, tileSize),
    url: serviceUrl,
    style: "default",
  };

  return options;
};
