import { useContext, useEffect } from "react";
import MapContext from "../../components/map/context/MapContext";

import ol_source_GeoTIFF from "ol/source/GeoTIFF";
import ol_layer_WebGLTile from "ol/layer/WebGLTile";

import geoTiffSrc from "../assets/TWN-R01.tif";

import { Extent as ol_Extent } from "ol/extent";
import { Coordinate as ol_Coordinate } from "ol/coordinate";
import { View as ol_View } from "ol";
import * as ol_control from "ol/control";
import * as ol_proj from "ol/proj";

import MapEventType from "ol/MapEventType";
import CollectionEventType from "ol/CollectionEventType";
import ViewLike from "../../util/ViewLike";
import { createPortal } from "react-dom";

type LayerSpec = {
    url: string;
    name: string;
    visible?: boolean;
    initZoom?: boolean|number;

    setVisible?: (v: boolean) => void;
    zoomToView?: (delay?: number|boolean) => void;
};

const GeoTiffLayer = (ps: {
    zoomToView?: boolean | number,

    sources: LayerSpec[],
}) => {
  let { zoomToView, sources: srcs } = ps;

  const { map } = useContext(MapContext);

  //const src2 = "https://www.dropbox.com/scl/fo/b18077o77wyyh9i7cc3rz/AIl5tyP7dXQob6aD81ZW2q0?dl=1&e=1&preview=TWN-R01.tif&rlkey=s9ogydnkjeqzfrsapr5syezf1&st=e5xbhhqt"; // geoTiffSrc; // 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';
  const src = "https://dl.dropboxusercontent.com/scl/fo/b18077o77wyyh9i7cc3rz/AOV0NbcgrJEZbGA9L7vVvJ0/TWN-R01.tif?rlkey=s9ogydnkjeqzfrsapr5syezf1&dl=1";

  let layers = srcs.map((l) => {
    let source = new ol_source_GeoTIFF({
        sources: [
          {
            url: l.url,
          },
        ],
        sourceOptions: {
            allowFullFile: true,
            forceXHR: true,
        }
        //projection: 'EPSG:4326',
      });
      let layer =  new ol_layer_WebGLTile({
        source: source,
        zIndex: 2,
        visible: l.visible,
      });

      let r = {
        l: l,
          source,
        layer,
      };

      l.setVisible = (v) => {
          r.layer.setVisible(v);
      };

      l.zoomToView = (delay) => {
        if (delay == null || typeof delay === "boolean") delay = 5000;
        r.source.getView().then((view) => {
            if (map == null) return;
            let mView = map.getView();
            ViewLike.fitToView(mView, view, {
                duration: delay,
            });
        });
      };

      return r;
  });


  useEffect(() => {
    if (map == null) return;
    for (let layer of layers) map.addLayer(layer.layer);

    for (let l of layers) {
      if (l.l.initZoom != null) {
          l.l.zoomToView?.(l.l.initZoom);
          l.l.initZoom = undefined;
      }
    }

    return () => {
        for (let layer of layers) map?.removeLayer(layer.layer);
    };
  }, [map, layers]);

  /* if (zoomToView != null) {
    let delay = undefined;
    let ok = false;
    if (typeof zoomToView === "number") {
      delay = zoomToView;
      ok = true;
    } else if (zoomToView === true) {
      delay = 5000;
      ok = true;
    }
    if (ok && layers.length > 0) {
        layers[0].source.getView().then((view) => {
        if (map == null) return;
        let mView = map.getView();
        ViewLike.fitToView(mView, view, {
          duration: delay,
        });
      });
    }
  } */
  return null;
};


export {
    GeoTiffLayer as default,
    GeoTiffLayer,
    type LayerSpec,
}
