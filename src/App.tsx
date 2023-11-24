import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";

function App() {
  return (
    <div className="App">
      <MapProvider>
        <div>
          <div>A map</div>
          <Map>
            <></>
          </Map>
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
