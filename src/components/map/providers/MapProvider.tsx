import React, { useEffect, useState, ReactNode } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOsm from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import MapContext from "../context/MapContext";

interface MapProviderProps {
  children: ReactNode; // Explicitly declaring children as a prop
}

const osmTileLayer = new OlLayerTile({
  // name: "OSM",
  source: new OlSourceOsm(),
  zIndex: 1,
});

const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const [olMap, setOlMap] = useState<OlMap | undefined>();

  useEffect(() => {
    const newMap = new OlMap({
      layers: [osmTileLayer],
      view: new OlView({
        center: fromLonLat([0, 0]),
        zoom: 4,
      }),
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
