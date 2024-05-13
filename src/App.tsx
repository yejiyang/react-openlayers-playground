import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";
import SelectFeature from "./examples/SelectFeature";
import EarthquakeClusters from "./examples/EarthquakeClusters";
import { useState } from "react";
import SecondMapDialog from "./examples/SecondMapDialog";

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
            <EarthquakeClusters />
          </Map>
          {showDialog && <SecondMapDialog />}
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
