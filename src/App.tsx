import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";
import SelectFeature from "./examples/SelectFeature";
import EarthquakeClusters from "./examples/EarthquakeClusters";

function App() {
  return (
    <div className="App">
      <MapProvider>
        <div>
          <div>A map</div>
          <Map>
            {/* <SelectFeature /> */}
            <EarthquakeClusters />
          </Map>
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
