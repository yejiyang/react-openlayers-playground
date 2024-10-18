import { ReactNode } from "react";
import { FunctionComponent, useContext, useEffect, useRef } from "react";
import MapContext from "./context/MapContext";

import "ol/ol.css";

interface Props {
  children: ReactNode; // Explicitly declaring children as a prop
}

const Map: FunctionComponent<Props> = ({ children }) => {
  const { map } = useContext(MapContext);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !mapRef.current) return;
    map.setTarget(mapRef.current);
  }, [map, mapRef]);

  return (
    <div ref={mapRef} style={{ position: "absolute", width: "100%", height: "95%" }}>
      {children}
    </div>
  );
};
export default Map;
