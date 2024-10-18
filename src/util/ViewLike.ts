import { Extent as ol_Extent } from "ol/extent";
import { Coordinate as ol_Coordinate } from "ol/coordinate";
import { View as ol_View } from "ol";
import * as ol_proj from "ol/proj";
import vproj from "./vproj";

interface ViewLikeOpts {
  center?: ol_Coordinate | nullish;
  zoom?: number | nullish;
  resolution?: number | nullish;
  resolutions?: number[] | nullish;
  extent?: ol_Extent | nullish;
  projection?: ol_proj.ProjectionLike | nullish;
}
interface ViewLikeViewRo {
  getCenter?(): ol_Coordinate | nullish;
  getZoom?(): number | nullish;
  getResolution?(): number | nullish;
  getResolutions?(): number[] | nullish;
  calculateExtent?(): ol_Extent | nullish;
  getProjection?(): ol_proj.Projection | nullish;
}
interface ViewLikeView extends ViewLikeViewRo {
  setCenter?(center: ol_Coordinate): void;
  setZoom?(zoom: number): void;
  setResolution?(resolution: number | undefined): void;
  fit?: ol_View["fit"];
}

type View_fit_Options = Parameters<ol_View["fit"]> extends [a: unknown, b?: infer T] ? T : never;

type ViewLikeRo = ViewLikeOpts & ViewLikeViewRo;
type ViewLike = ViewLikeOpts & ViewLikeView;

/**
 * is Object (ecmascript Object type)
 */
function isObj(o: unknown): o is object {
  return typeof o === "object" ? o !== null : typeof o === "function";
}

const ViewLike = (() => {
  //
  function getCenter(v: ViewLikeRo | nullish, proj?: ol_proj.ProjectionLike | nullish) {
    if (!isObj(v)) return undefined;
    let p = typeof v.getCenter === "function" ? v.getCenter() : v.center;
    if (proj != null) {
      p = vproj.point(p, getProjection(v), proj);
    }
    return p;
  }
  function getZoom(v: ViewLikeRo | nullish) {
    return !isObj(v) ? undefined : typeof v.getZoom === "function" ? v.getZoom() : v.zoom;
  }
  function getResolution(v: ViewLikeRo | nullish) {
    return !isObj(v) ? undefined : typeof v.getResolution === "function" ? v.getResolution() : v.resolution;
  }
  function getResolutions(v: ViewLikeRo | nullish) {
    return !isObj(v) ? undefined : typeof v.getResolutions === "function" ? v.getResolutions() : v.resolutions;
  }
  function calculateExtent(v: ViewLikeRo | nullish, proj?: ol_proj.ProjectionLike | nullish) {
    if (!isObj(v)) return undefined;
    let p = typeof v.calculateExtent === "function" ? v.calculateExtent() : v.extent;
    if (proj != null) {
      p = vproj.extent(p, getProjection(v), proj);
    }
    return p;
  }
  function getProjection(v: ViewLikeRo | nullish) {
    return !isObj(v) ? undefined : typeof v.getProjection === "function" ? v.getProjection() : v.projection;
  }

  function setCenter(
    v: ViewLike | nullish,
    center: ol_Coordinate | nullish,
    proj?: ol_proj.ProjectionLike | nullish
  ): number {
    if (!isObj(v) || center == null) return 0;
    if (proj != null) {
      center = vproj.point(center, proj, getProjection(v));
    }
    if (typeof v.setCenter === "function") {
      v.setCenter(center);
      return 1;
    } else {
      v.center = center;
      return 2;
    }
  }
  function fitToExtent(
    v: ViewLike | nullish,
    extent: ol_Extent | nullish,
    proj?: ol_proj.ProjectionLike | nullish,
    opts?: View_fit_Options
  ): number {
    if (!isObj(v) || extent == null) return 0;
    if (proj != null) {
      extent = vproj.extent(extent, proj, getProjection(v));
    }
    if (typeof v.fit === "function") {
      v.fit(extent, opts);
      return 1;
    } else {
      if (v.extent == null && v.center != null) {
        v.center = undefined;
      }
      v.extent = extent;
      if (opts != null) {
        if (opts.callback != null) {
          opts.callback(true);
        }
      }
      return 2;
    }
  }
  function setZoom(v: ViewLike | nullish, zoom: number | nullish): number {
    if (!isObj(v) || zoom == null) return 0;
    if (typeof v.setZoom === "function") {
      v.setZoom(zoom);
      return 1;
    } else {
      v.zoom = zoom;
      return 2;
    }
  }
  function fitToView(v: ViewLike | nullish, view: ViewLikeRo | nullish, opts?: View_fit_Options): number {
    if (!isObj(v) || !isObj(view)) return 0;
    let extent = calculateExtent(view);
    if (extent != null) {
      return fitToExtent(v, extent, getProjection(view), opts);
    }
    let center = getCenter(view);
    if (center != null) {
      setCenter(v, center, getProjection(view));
      setZoom(v, getZoom(view));
      if (opts != null) {
        if (opts.callback != null) {
          opts.callback(true);
        }
      }
      return 1;
    }
    return 0;
  }

  return {
    getCenter,
    getZoom,
    getResolution,
    getResolutions,
    calculateExtent,
    getProjection,

    setCenter,
    setZoom,
    fitToExtent,

    fitToView,
  };
})();

export { ViewLike, ViewLike as default };
