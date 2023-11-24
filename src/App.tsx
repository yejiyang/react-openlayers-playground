import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";

function App() {
  return (
    <div className="App">
      <MapProvider>
        <div>A mapxx</div>
      </MapProvider>
    </div>
  );
}

export default App;
