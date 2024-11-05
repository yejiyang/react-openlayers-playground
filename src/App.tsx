import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";
import SelectFeature from "./examples/SelectFeature";
import EarthquakeClusters from "./examples/EarthquakeClusters";
import { useState } from "react";
import SecondMapDialog from "./examples/SecondMapDialog";
import GridLine from "./components/map/layers/GridLine";
import WMSLayerLoader from "./components/map/wms/WMSLayerLoader";
import WMSExample from "./components/map/wms/WMSExample";

function App() {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <div className="App">
      <MapProvider>
        <div>
          <div>A map</div>
          <button onClick={() => setShowDialog(true)}>Show second map dialog</button>
          <Map>
            {/* <SelectFeature /> */}
            {/* <EarthquakeClusters /> */}
            <GridLine />
            <WMSLayerLoader />
            {/* <WMSExample /> */}
          </Map>
          {showDialog && <SecondMapDialog />}
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
