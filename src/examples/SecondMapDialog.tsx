import { fromLonLat } from "ol/proj";
import { useContext, useEffect, useRef, useState } from "react";
import MapContext from "../components/map/context/MapContext";
import {
  getNorwaySatelliteLayer,
  getNorwayTopographicLayer,
  getOsmTileLayer,
} from "../components/map/layers/MapLayers";
import { OlMap, OlView } from "../components/map/types/MapTypes";
import { Collection, getUid } from "ol";

type Props = {};

const SecondMapDialog = (props: Props) => {
  const { map } = useContext(MapContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const [olMap, setOlMap] = useState<OlMap | undefined>();

  useEffect(() => {
    const layers = map?.getLayers().getArray();
    const newMap = new OlMap({
      layers: [getNorwayTopographicLayer()],
      view: new OlView({
        center: fromLonLat([10.75, 59.91]),
        zoom: 4,
      }),
      //   controls: new Collection(),
      //   interactions: new Collection(),
    });
    // layers?.forEach((layer) => newMap.addLayer(layer));

    if (!map || !mapRef.current) return;
    newMap.setTarget(mapRef.current);
    setOlMap(newMap);

    return () => newMap.setTarget(undefined);
  }, [map, mapRef]);

  return (
    <dialog open style={{ height: 500, width: 500 }}>
      <h1>Second Map Dialog</h1>
      <p>Some content for the dialog.</p>
      {/* I want to click the button and list all map layers in mapRef */}
      <button
        onClick={() => {
          console.log(olMap?.getAllLayers());
          console.log(olMap?.getAllLayers().map((layer) => layer.getKeys()));
          console.log(olMap?.getAllLayers().map((layer) => layer.get("name")));
          console.log(olMap?.getAllLayers().map((layer) => getUid(layer)));
        }}
      >
        List all layers in the map
      </button>
      <div ref={mapRef} style={{ width: 500, height: 300 }}></div>
    </dialog>
  );
};

export default SecondMapDialog;
