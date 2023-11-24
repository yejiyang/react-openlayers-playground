import React, { useContext, useEffect } from "react";
import MapContext from "../components/map/context/MapContext";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Fill from "ol/style/Fill.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Stroke from "ol/style/Stroke.js";
import Select from "ol/interaction/Select.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Icon, Style, RegularShape } from "ol/style.js";

const SelectFeature = () => {
  const { map } = useContext(MapContext);

  //   const selected = new Style({
  //     fill: new Fill({
  //       color: "#eeeeee",
  //     }),
  //     stroke: new Stroke({
  //       color: "rgba(255, 255, 255, 0.7)",
  //       width: 2,
  //     }),
  //   });

  //   function selectStyle(feature: any) {
  //     const color = feature.get("COLOR") || "#eeeeee";
  //     selected.getFill().setColor(color);
  //     return selected;
  //   }

  //   // select interaction working on "click"
  //   const selectClick = new Select({
  //     condition: "click",
  //     style: selectStyle,
  //   });

  //   const highlightStyle = new Style({
  //     fill: new Fill({
  //       color: "#EEE",
  //     }),
  //     stroke: new Stroke({
  //       color: "#3399CC",
  //       width: 2,
  //     }),
  //   });

  const iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: "Null Island",
    population: 4000,
    rainfall: 500,
  });

  const iconStyle = new Style({
    geometry: iconFeature.getGeometry(),
    image: new RegularShape({
      radius1: 10,
      radius2: 3,
      points: 5,
      angle: Math.PI,
      fill: new Fill({
        color: "rgba(255, 153, 0, 0.8)",
      }),
      stroke: new Stroke({
        color: "rgba(255, 204, 0, 0.2)",
        width: 1,
      }),
    }),
  });

  iconFeature.setStyle(iconStyle);

  const iconFeature2 = new Feature({
    geometry: new Point([5, 5]),
    name: "Null Island 2",
    population: 4000,
    rainfall: 500,
  });

  const iconStyle2 = new Style({
    geometry: iconFeature2.getGeometry(),
    image: new RegularShape({
      radius1: 10,
      radius2: 3,
      points: 5,
      angle: Math.PI,
      fill: new Fill({
        color: "rgba(255, 153, 0, 0.8)",
      }),
      stroke: new Stroke({
        color: "rgba(255, 204, 0, 0.2)",
        width: 1,
      }),
    }),
  });

  iconFeature2.setStyle(iconStyle2);

  //   const getFeatureStyle = (feature: any) => {
  //     return new Style({
  //       geometry: iconFeature.getGeometry(),
  //       image: new RegularShape({
  //         radius1: 10,
  //         radius2: 3,
  //         points: 5,
  //         angle: Math.PI,
  //         fill: new Fill({
  //           color: "rgba(255, 153, 0, 0.8)",
  //         }),
  //         stroke: new Stroke({
  //           color: "rgba(255, 204, 0, 0.2)",
  //           width: 1,
  //         }),
  //       }),
  //     });
  //   };

  //   const generateDummyIconFeatures = () => {
  //     const features = [];
  //     for (let i = 0; i < 100; i++) {
  //       // Generate random coordinates within the specified range
  //       const longitude = Math.random() * 10; // Longitude between 0 and 10
  //       const latitude = Math.random() * 10; // Latitude between 0 and 10

  //       console.log(longitude, latitude);

  //       const iconFeature = new Feature({
  //         geometry: new Point([longitude, latitude]),
  //         name: `Dummy Location ${i}`,
  //         population: 4000, // Random population
  //         rainfall: 500, // Random rainfall
  //       });

  //       iconFeature.setStyle(iconStyle);

  //       features.push(iconFeature);
  //     }
  //     return features;
  //   };

  const vector = new VectorLayer({
    // background: "blue",
    source: new VectorSource({
      features: [iconFeature2, iconFeature],
    }),
    zIndex: 10,
    opacity: 1,
  });

  vector.set("name", "VectorLayer");

  useEffect(() => {
    if (!map) return;

    map.addLayer(vector);

    return () => {
      if (map) {
        map.removeLayer(vector);
      }
    };
  }, [map]);

  if (!map) return null;

  return <></>;
};

export default SelectFeature;
