import React, { useContext, useEffect } from "react";
import KML from "ol/format/KML.js";
import { Circle as CircleStyle, Fill, RegularShape, Stroke, Style, Text } from "ol/style.js";
import { Cluster, Vector as VectorSource } from "ol/source.js";
import { Select } from "ol/interaction.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { createEmpty, extend, getHeight, getWidth } from "ol/extent.js";
import MapContext from "../components/map/context/MapContext";
import type {
  Feature as OlFeature,
} from "ol";
import { FeatureLike } from "ol/Feature";

const EarthquakeClusters = () => {
  const { map } = useContext(MapContext);

  const earthquakeFill = new Fill({
    color: "rgba(255, 153, 0, 0.8)",
  });
  const earthquakeStroke = new Stroke({
    color: "rgba(255, 204, 0, 0.2)",
    width: 1,
  });
  const textFill = new Fill({
    color: "#fff",
  });
  const textStroke = new Stroke({
    color: "rgba(0, 0, 0, 0.6)",
    width: 3,
  });
  const invisibleFill = new Fill({
    color: "rgba(255, 255, 255, 0.01)",
  });

  function createEarthquakeStyle(feature: OlFeature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it
    // from the Placemark's name instead.
    const name = feature.get("name");
    const magnitude = parseFloat(name.substr(2));
    const radius = 5 + 20 * (magnitude - 5);

    return new Style({
      geometry: feature.getGeometry(),
      image: new RegularShape({
        radius1: radius,
        radius2: 3,
        points: 5,
        angle: Math.PI,
        fill: earthquakeFill,
        stroke: earthquakeStroke,
      }),
    });
  }

  let maxFeatureCount: number|undefined;
  let vector: VectorLayer<VectorSource>|null = null;
  const calculateClusterInfo = function (resolution: number) {
    maxFeatureCount = 0;
    const features = vector!.getSource()!.getFeatures();
    let feature, radius;
    for (let i = features.length - 1; i >= 0; --i) {
      feature = features[i];
      const originalFeatures = feature.get("features");
      const extent = createEmpty();
      let j, jj;
      for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
        extend(extent, originalFeatures[j].getGeometry().getExtent());
      }
      maxFeatureCount = Math.max(maxFeatureCount, jj);
      radius = (0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
      feature.set("radius", radius);
    }
  };

  let currentResolution: number|undefined;
  function styleFunction(feature: FeatureLike, resolution: number) {
    feature = feature as OlFeature;
    if (resolution != currentResolution) {
      calculateClusterInfo(resolution);
      currentResolution = resolution;
    }
    let style;
    const size = feature.get("features").length;
    if (size > 1) {
      style = new Style({
        image: new CircleStyle({
          radius: feature.get("radius"),
          fill: new Fill({
            color: [255, 153, 0, Math.min(0.8, 0.4 + size / maxFeatureCount!)],
          }),
        }),
        text: new Text({
          text: size.toString(),
          fill: textFill,
          stroke: textStroke,
        }),
      });
    } else {
      const originalFeature = feature.get("features")[0];
      style = createEarthquakeStyle(originalFeature);
    }
    return style;
  }

  function selectStyleFunction(feature: FeatureLike) {
    const styles = [
      new Style({
        image: new CircleStyle({
          radius: feature.get("radius"),
          fill: invisibleFill,
        }),
      }),
    ];
    const originalFeatures = feature.get("features");
    let originalFeature;
    for (let i = originalFeatures.length - 1; i >= 0; --i) {
      originalFeature = originalFeatures[i];
      styles.push(createEarthquakeStyle(originalFeature));
    }
    return styles;
  }

  vector = new VectorLayer({
    source: new Cluster({
      distance: 40,
      source: new VectorSource({
        url: "/data/2012_Earthquakes_Mag5.kml",
        format: new KML({
          extractStyles: false,
        }),
      }),
    }),
    zIndex: 10,
    style: styleFunction,
  });

  vector.set("name", "earthquake-clusters");

  const selectInteraction = new Select({
    condition: function (evt) {
      return evt.type === "pointermove" || evt.type === "singleclick";
    },
    style: selectStyleFunction,
  });

  useEffect(() => {
    if (!map) return;

    map.addLayer(vector);
    map.addInteraction(selectInteraction);

    return () => {
      if (map) {
        map.removeLayer(vector);
        map.removeInteraction(selectInteraction);
      }
    };
  }, [map, selectInteraction, vector]);

  if (!map) return null;

  return <></>;
};

export default EarthquakeClusters;
