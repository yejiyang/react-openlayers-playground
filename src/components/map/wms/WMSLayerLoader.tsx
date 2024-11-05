import React, { useState, useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import MapContext from "../context/MapContext";
import { fromLonLat } from "ol/proj";

type SelectionState = "selected" | "unselected" | "indeterminate";

type WMSLayer = {
  name: string;
  title: string;
  children?: WMSLayer[];
  parent?: WMSLayer;
};

const defaultWMSURL =
  "https://factmaps.sodir.no/arcgis/services/FactMaps/3_0/MapServer/WMSServer?request=GetCapabilities&service=WMS";

const WMSLayerLoader = () => {
  const { map } = React.useContext(MapContext);
  const [wmsUrl, setWmsUrl] = useState(defaultWMSURL);
  const [wmsVersion, setWmsVersion] = useState("1.3.0");
  const [layers, setLayers] = useState<WMSLayer[]>([]);
  const [layerSelectionState, setLayerSelectionState] = useState<{
    [layerName: string]: SelectionState;
  }>({});

  const fetchAndParseCapabilities = async () => {
    try {
      const response = await fetch(wmsUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const parsedLayers = parseLayersFromCapabilities(xmlDoc);
      setLayers(parsedLayers);

      const version = getWMSVersion(xmlDoc);
      setWmsVersion(version);
    } catch (error) {
      console.error("Error fetching or parsing GetCapabilities:", error);
    }
  };

  const getWMSVersion = (xmlDoc: Document): string => {
    const wmsCapability = xmlDoc.getElementsByTagName("WMS_Capabilities")[0];
    if (wmsCapability) {
      return wmsCapability.getAttribute("version") || "1.3.0";
    }
    const wmtMsCapabilities = xmlDoc.getElementsByTagName("WMT_MS_Capabilities")[0];
    if (wmtMsCapabilities) {
      return wmtMsCapabilities.getAttribute("version") || "1.1.1";
    }
    return "1.3.0"; // Default version
  };

  const parseLayersFromCapabilities = (xmlDoc: Document): WMSLayer[] => {
    const capability = xmlDoc.getElementsByTagName("Capability")[0];
    if (!capability) return [];

    const topLayerNodes = Array.from(capability.childNodes).filter((node) => node.nodeName === "Layer") as Element[];

    return topLayerNodes.map((node) => parseLayer(node));
  };

  const parseLayer = (layerNode: Element, parentLayer?: WMSLayer): WMSLayer => {
    const nameNode = layerNode.getElementsByTagName("Name")[0];
    const titleNode = layerNode.getElementsByTagName("Title")[0];

    const name = nameNode?.textContent || "";
    const title = titleNode?.textContent || "";

    const layer: WMSLayer = { name, title, parent: parentLayer };

    const childLayerNodes = Array.from(layerNode.childNodes).filter((node) => node.nodeName === "Layer") as Element[];

    if (childLayerNodes.length > 0) {
      layer.children = childLayerNodes.map((childNode) => parseLayer(childNode, layer));
    }

    return layer;
  };

  const handleLayerSelection = (layer: WMSLayer, newState?: SelectionState) => {
    const currentState = layerSelectionState[layer.name] || "unselected";
    const nextState = newState || (currentState === "selected" ? "unselected" : "selected");

    const updatedSelectionState = { ...layerSelectionState };
    updatedSelectionState[layer.name] = nextState;

    // Update children
    if (layer.children && layer.children.length > 0) {
      updateChildSelectionState(layer, nextState, updatedSelectionState);
    }

    // Update parents
    updateParentSelectionState(layer.parent, updatedSelectionState);

    setLayerSelectionState(updatedSelectionState);
  };

  const updateChildSelectionState = (
    layer: WMSLayer,
    state: SelectionState,
    selectionState: { [layerName: string]: SelectionState }
  ) => {
    if (layer.children) {
      layer.children.forEach((child) => {
        selectionState[child.name] = state;
        updateChildSelectionState(child, state, selectionState);
      });
    }
  };

  const updateParentSelectionState = (
    layer: WMSLayer | undefined,
    selectionState: { [layerName: string]: SelectionState }
  ) => {
    if (!layer) return;

    const childStates = layer.children?.map((child) => selectionState[child.name]) || [];

    let newState: SelectionState;
    if (childStates.every((state) => state === "selected")) {
      newState = "selected";
    } else if (childStates.every((state) => state === "unselected")) {
      newState = "unselected";
    } else {
      newState = "indeterminate";
    }

    selectionState[layer.name] = newState;

    updateParentSelectionState(layer.parent, selectionState);
  };

  const renderLayerTree = (layers: WMSLayer[], level = 0) => {
    return layers.map((layer) => {
      const hasChildren = layer.children && layer.children.length > 0;
      const paddingLeft = level * 20;
      const selectionState = layerSelectionState[layer.name] || "unselected";

      const isChecked = selectionState === "selected";
      const isIndeterminate = selectionState === "indeterminate";

      return (
        <div key={`${layer.name}-${layer.title}`}>
          <div style={{ paddingLeft: `${paddingLeft}px` }}>
            {layer.name && (
              <IndeterminateCheckbox
                id={layer.name}
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={() => handleLayerSelection(layer)}
                label={layer.title}
              />
            )}
            {!layer.name && <span>{layer.title}</span>}
          </div>
          {hasChildren && renderLayerTree(layer.children!, level + 1)}
        </div>
      );
    });
  };

  const IndeterminateCheckbox = ({ id, checked, indeterminate, onChange, label }: CheckboxProps) => {
    const ref = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <>
        <input type="checkbox" id={id} checked={checked} ref={ref} onChange={onChange} />
        <label htmlFor={id}>{label}</label>
      </>
    );
  };

  interface CheckboxProps {
    id: string;
    checked: boolean;
    indeterminate: boolean;
    onChange: () => void;
    label: string;
  }

  useEffect(() => {
    if (!map) return;

    const selectedLayerNames = Object.entries(layerSelectionState)
      .filter(([_, state]) => state === "selected")
      .map(([layerName]) => layerName);

    const mapLayers = map.getLayers().getArray();
    const existingLayerNames = mapLayers
      .filter((layer) => layer.get("wmsLayer") === true)
      .map((layer) => layer.get("name"));

    // Remove layers that are no longer selected
    existingLayerNames.forEach((name) => {
      if (!selectedLayerNames.includes(name)) {
        const layerToRemove = mapLayers.find((layer) => layer.get("name") === name);
        if (layerToRemove) {
          map.removeLayer(layerToRemove);
        }
      }
    });

    // Add new layers
    selectedLayerNames.forEach((layerName) => {
      if (!existingLayerNames.includes(layerName)) {
        const wmsLayer = new TileLayer({
          source: new TileWMS({
            url: wmsUrl.split("?")[0],
            params: {
              LAYERS: layerName,
              TILED: true,
              VERSION: wmsVersion,
            },
            crossOrigin: "anonymous",
          }),
          opacity: 0.7,
          zIndex: 100,
        });
        wmsLayer.set("name", layerName);
        wmsLayer.set("wmsLayer", true);
        map.addLayer(wmsLayer);
      }
    });

    // Adjust map view
    if (selectedLayerNames.length > 0) {
      map.getView().setCenter(fromLonLat([15, 65]));
      map.getView().setZoom(4);
    }
  }, [layerSelectionState, map, wmsUrl, wmsVersion]);

  return (
    <div>
      <input
        type="text"
        value={wmsUrl}
        onChange={(e) => setWmsUrl(e.target.value)}
        placeholder="Enter WMS GetCapabilities URL"
      />
      <button onClick={fetchAndParseCapabilities}>Load Layers</button>

      {layers.length > 0 && (
        <div>
          <h3>Select Layers to Add:</h3>
          {renderLayerTree(layers)}
        </div>
      )}
    </div>
  );
};

export default WMSLayerLoader;
