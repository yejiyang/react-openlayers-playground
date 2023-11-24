import React from "react";
import { Map } from "ol";

interface MapContextProps {
  map?: Map; // Optional Map type
}

// Creating the context with the defined type and default value
const MapContext = React.createContext<MapContextProps>({});

export default MapContext;
