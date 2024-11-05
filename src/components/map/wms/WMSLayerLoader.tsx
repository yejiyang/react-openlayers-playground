import React, { useState, useEffect } from "react";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import MapContext from "../context/MapContext";

type WMSLayer = {
  name: string;
  title: string;
  children?: WMSLayer[];
};

const defaultWMSURL =
  "https://factmaps.sodir.no/arcgis/services/FactMaps/3_0/MapServer/WMSServer?request=GetCapabilities&service=WMS";

const WMSLayerLoader = () => {
  const { map } = React.useContext(MapContext);
  const [wmsUrl, setWmsUrl] = useState(defaultWMSURL);
  const [wmsVersion, setWmsVersion] = useState("1.3.0");
  const [layers, setLayers] = useState<WMSLayer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);

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

    return topLayerNodes.map(parseLayer);
  };

  const parseLayer = (layerNode: Element): WMSLayer => {
    const nameNode = layerNode.getElementsByTagName("Name")[0];
    const titleNode = layerNode.getElementsByTagName("Title")[0];

    const name = nameNode?.textContent || "";
    const title = titleNode?.textContent || "";

    const childLayerNodes = Array.from(layerNode.childNodes).filter((node) => node.nodeName === "Layer") as Element[];

    const children = childLayerNodes.map(parseLayer);

    const layer: WMSLayer = { name, title };
    if (children.length > 0) {
      layer.children = children;
    }

    return layer;
  };

  const handleLayerSelection = (layerName: string) => {
    setSelectedLayers((prevSelected) => {
      if (prevSelected.includes(layerName)) {
        return prevSelected.filter((name) => name !== layerName);
      } else {
        return [...prevSelected, layerName];
      }
    });
  };

  useEffect(() => {
    if (!map) return;

    const mapLayers = map.getLayers().getArray();
    const existingLayerNames = mapLayers
      .filter((layer) => layer.get("wmsLayer") === true)
      .map((layer) => layer.get("name"));

    // Remove layers that are no longer selected
    existingLayerNames.forEach((name) => {
      if (!selectedLayers.includes(name)) {
        const layerToRemove = mapLayers.find((layer) => layer.get("name") === name);
        if (layerToRemove) {
          map.removeLayer(layerToRemove);
        }
      }
    });

    // Add new layers
    selectedLayers.forEach((layerName) => {
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
  }, [selectedLayers, map, wmsUrl, wmsVersion]);

  const renderLayerTree = (layers: WMSLayer[], level = 0) => {
    return layers.map((layer) => {
      const hasChildren = layer.children && layer.children.length > 0;
      const paddingLeft = level * 20;
      return (
        <div key={`${layer.name}-${layer.title}`}>
          <div style={{ paddingLeft: `${paddingLeft}px` }}>
            {layer.name && (
              <>
                <input
                  type="checkbox"
                  id={layer.name}
                  checked={selectedLayers.includes(layer.name)}
                  onChange={() => handleLayerSelection(layer.name)}
                />
                <label htmlFor={layer.name}>{layer.title}</label>
              </>
            )}
            {!layer.name && <span>{layer.title}</span>}
          </div>
          {hasChildren && renderLayerTree(layer.children!, level + 1)}
        </div>
      );
    });
  };

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
