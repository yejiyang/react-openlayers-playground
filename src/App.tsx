import "./App.css";
import MapProvider from "./components/map/providers/MapProvider";
import Map from "./components/map/Map";
import EarthquakeClusters from "./examples/EarthquakeClusters";
import React, { useState } from "react";
import SecondMapDialog from "./examples/SecondMapDialog";
import {GeoTiffLayer, LayerSpec } from "./examples/geotiff/GeoTiff";
import LayerControlList from "./examples/geotiff/LayerControlList";

function inputUrlUpdate(sources: LayerSpec[], v: string|undefined): string|undefined {
  if (!v) return v;
  if (sources.find((s) => s.url === v)) {
    v += "#";
    for (let i = 2; i < 1000; i++) {
      let url2 = v + i;
      if (!sources.find((s) => s.url === url2)) {
        v = url2;
        return v;
      }
    }
    return undefined;
  }
  return v;
}

function nameFromUrl(url: string) {
  if (!url) return url;
  // eslint-disable-next-line no-useless-escape -- omitting escapes based on context and flags is a bad idea and can lead to bugs.
  let name = /^(?:[^\?\/]*\/)*([^\?\/]*)/.exec(url)?.[1];
  if (name == null) return url;
  let suf = /#(\d+)$/.exec(url)?.[1];
  if (suf != null) {
    name += " " + suf;
  }
  return name;
}

function LayerInput(ps: { sources: LayerSpec[], setSources: (sources: LayerSpec[]) => void }) {
  let { sources, setSources } = ps;

  let [url, setUrl] = useState("");

  let addSource = (url: string, clearUrl: boolean=false) => {
    let v: string|undefined = url;
    v = inputUrlUpdate(sources, v) ?? v;
    if (!v) return false;
    let name = nameFromUrl(v);
    setSources([...sources, sourceInit({ name: name, url: v, })]);
    if (clearUrl) setUrl("");
    return true;
  };

  return (
    <div>
      <input value={url} type="text" onChange={(e) => setUrl(e.target.value)} />
      <button onClick={() => addSource(url, true)}>Add</button>
    </div>
  )
}
function sourceInit(s: LayerSpec) {
  //s.visible ??= true;
  return s;
}

function sourceSerialize(s: LayerSpec) {
  return { name: s.name, url: s.url };
}
function sourceDeserialize(s: LayerSpec) {
  return sourceInit(s);
}

function useLayerSources() {
  let [sources, setSources] = useState(()=> {
    let s = localStorage.getItem("sources");
    if (!s) return [];
    return (JSON.parse(s) as LayerSpec[]).map(sourceDeserialize);
  });
  localStorage.setItem("sources", JSON.stringify(sources.map(sourceSerialize)));

  let removeLayer = (url: string) => {
    let i = sources.findIndex((s) => s.url === url);
    if (i === -1) return;
    let newSources = sources.toSpliced(i, 1);
    setSources(newSources);
  };

  return {
    sources,
    setSources,
    removeLayer,
  };
}

function App() {
  const [showDialog, setShowDialog] = useState(false);

  let { sources, setSources, removeLayer } = useLayerSources();

  return (
    <div className="App">
      <LayerInput sources={sources} setSources={setSources} />
      <MapProvider>
        <div>
          <div>A map</div>
          <button onClick={() => setShowDialog(true)}>Show second map dialog</button>
          <Map>
            <LayerControlList layers={sources} removeLayer={removeLayer} />
            <GeoTiffLayer sources={sources} />
          </Map>
          {showDialog && <SecondMapDialog />}
        </div>
      </MapProvider>
    </div>
  );
}

export default App;
