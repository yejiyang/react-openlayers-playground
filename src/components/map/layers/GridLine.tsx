import React, { useContext, useEffect } from "react";
import MapContext from "../context/MapContext";
import { Graticule } from "ol";
import { Stroke } from "ol/style";

const isDebugMode = false;

type Props = {};

const GridLine = (props: Props) => {
  const { map } = useContext(MapContext);

  // Create a grid line layer using OpenLayers Graticule function
  const gridLineLayer = new Graticule({
    strokeStyle: new Stroke({
      color: "rgba(128,128,128,0.9)",
      width: 2,
      lineDash: [0.5, 4],
    }),
    showLabels: true,
    wrapX: false,
    zIndex: 10,
  });

  useEffect(() => {
    if (isDebugMode) console.log("Adding grid line layer to map");

    if (!map) return;
    map.addLayer(gridLineLayer);

    return () => {
      map.removeLayer(gridLineLayer);
    };
  });

  return null;
};

export default GridLine;
