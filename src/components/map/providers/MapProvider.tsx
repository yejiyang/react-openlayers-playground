import React, { useEffect, useState, ReactNode } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import { fromLonLat } from "ol/proj";
import MapContext from "../context/MapContext";
import { osmTileLayer } from "../layers/MapLayers";

import { defaults as ol_control_defaults } from "ol/control/defaults";

interface MapProviderProps {
  children: ReactNode; // Explicitly declaring children as a prop
}

const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [olMap, setOlMap] = useState<OlMap | undefined>();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [osmTileLayer],
      view: new OlView({
        center: fromLonLat([0, 0]),
        zoom: 4,
      }),
      controls: ol_control_defaults({}),
    });
    setOlMap(newMap);

    return () => newMap.setTarget(undefined);
  }, []);

  useEffect(() => {
    console.log("all layers on map", olMap?.getAllLayers());
  }, [olMap]);

  return <MapContext.Provider value={{ map: olMap }}>{children}</MapContext.Provider>;
};

export default MapProvider;
