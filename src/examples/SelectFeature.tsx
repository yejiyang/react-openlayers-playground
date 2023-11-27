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
import CircleStyle from "ol/style/Circle";
import { Cluster } from "ol/source";
import { fromLonLat } from "ol/proj";

const coordinates = [
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [0, 2],
  [1, 3],
  [2, 0],
  [3, 1],
].map((coordinate) => fromLonLat(coordinate));

const styleFunction = (feature) => {
  return new Style({
    geometry: feature.getGeometry(),
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({
        color: "rgba(255, 153, 0, 0.8)",
      }),
    }),
  });
};

const pointsLayer = new VectorLayer({
  source: new Cluster({
    distance: 1,
    source: new VectorSource({
      features: coordinates.map((coordinate) => {
        return new Feature({
          geometry: new Point(coordinate),
        });
      }),
    }),
  }),
  style: styleFunction,
  zIndex: 10,
});

const SelectFeature = () => {
  const { map } = useContext(MapContext);

  pointsLayer.set("name", "PointsLayer");

  useEffect(() => {
    if (!map) return;

    map.addLayer(pointsLayer);

    return () => {
      if (map) {
        map.removeLayer(pointsLayer);
      }
    };
  }, [map]);

  if (!map) return null;

  return <></>;
};

export default SelectFeature;
