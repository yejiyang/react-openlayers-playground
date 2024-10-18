import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";
import EarthquakeClusters from "./examples/EarthquakeClusters";
import { useState } from "react";
import SecondMapDialog from "./examples/SecondMapDialog";
import {GeoTiffLayer, LayerSpec } from "./examples/geotiff/GeoTiff";
import LayerControlList from "./examples/geotiff/LayerControlList";

function App() {
  const [showDialog, setShowDialog] = useState(false);

  let [sources2, setSources2] = useState([/* {
    name: "TWN-R01",
    url: "https://dl.dropboxusercontent.com/scl/fo/b18077o77wyyh9i7cc3rz/AOV0NbcgrJEZbGA9L7vVvJ0/TWN-R01.tif?rlkey=s9ogydnkjeqzfrsapr5syezf1&dl=1",
  } */] as LayerSpec[]);

  return (
    <div className="App">
      <input type="text" onBlur={(e) => {
        let v = e.target.value;
        if (!v) return;
        // eslint-disable-next-line no-useless-escape -- omitting escapes based on context and flags is a bad idea and can lead to bugs.
        let name = /^(?:[^\?\/]*\/)*([^\?\/]*)/.exec(v)?.[1] ?? v;
        if (sources2.find((s) => s.url === v)) return;
        e.target.value = "";
        setSources2([...sources2, { name: name, url: v }]);
      }} />
      <MapProvider>
        <div>
          <div>A map</div>
          <button onClick={() => setShowDialog(true)}>Show second map dialog</button>
          <Map>
            <LayerControlList layers={sources2} />
            {/* <SelectFeature /> */}
           {/*  <EarthquakeClusters /> */}
            <GeoTiffLayer zoomToView={true} sources={sources2} />
          </Map>
          {showDialog && <SecondMapDialog />}
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
