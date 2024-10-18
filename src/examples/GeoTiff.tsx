import { useContext, useEffect } from "react";
import MapContext from "../components/map/context/MapContext";

import ol_source_GeoTIFF from "ol/source/GeoTIFF";
import ol_layer_WebGLTile from "ol/layer/WebGLTile";

import geoTiffSrc from "../assets/TWN-R01.tif";

import { Extent as ol_Extent } from "ol/extent";
import { Coordinate as ol_Coordinate } from "ol/coordinate";
import { View as ol_View } from "ol";
import * as ol_proj from "ol/proj";

import MapEventType from "ol/MapEventType";
import CollectionEventType from "ol/CollectionEventType";
import ViewLike from "../util/ViewLike";

const GeoTiffLayer = (ps: { zoomToView?: boolean | number }) => {
  let { zoomToView } = ps;

  const { map } = useContext(MapContext);

  const src2 = "https://www.dropbox.com/scl/fo/b18077o77wyyh9i7cc3rz/AIl5tyP7dXQob6aD81ZW2q0?dl=1&e=1&preview=TWN-R01.tif&rlkey=s9ogydnkjeqzfrsapr5syezf1&st=e5xbhhqt"; // geoTiffSrc; // 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';
  const src = "https://dl.dropboxusercontent.com/scl/fo/b18077o77wyyh9i7cc3rz/AOV0NbcgrJEZbGA9L7vVvJ0/TWN-R01.tif?rlkey=s9ogydnkjeqzfrsapr5syezf1&dl=1";

  const source = new ol_source_GeoTIFF({
    sources: [
      {
        url: src,
      },
    ],
    sourceOptions: {
        allowFullFile: true,
        forceXHR: true,
    }
    //projection: 'EPSG:4326',
  });

  const layer = new ol_layer_WebGLTile({
    source: source,
    zIndex: 2,
  });

  useEffect(() => {
    if (map == null) return;
    map.addLayer(layer);

    return () => {
      map?.removeLayer(layer);
    };
  }, [map, layer]);

  if (zoomToView != null) {
    let delay = undefined;
    let ok = false;
    if (typeof zoomToView === "number") {
      delay = zoomToView;
      ok = true;
    } else if (zoomToView === true) {
      delay = 5000;
      ok = true;
    }
    if (ok) {
      source.getView().then((view) => {
        if (map == null) return;
        let mView = map.getView();
        ViewLike.fitToView(mView, view, {
          duration: delay,
        });
      });
    }
  }
  useEffect(() => {
    return () => {
      if (map == null) return;
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return null;
};

export default GeoTiffLayer;
