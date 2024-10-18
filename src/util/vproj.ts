import { Extent as ol_Extent } from "ol/extent";
import { Coordinate as ol_Coordinate } from "ol/coordinate";
import * as ol_proj from "ol/proj";

function transform_nop(p: number[], dest?: number[]): number[] {
  if (dest == null) return p.slice();
  for (let i = 0; i < p.length; i++) {
    dest[i] = p[i];
  }
  return dest;
}

function proj_getTransform(
  projFrom: ol_proj.ProjectionLike | nullish,
  projTo: ol_proj.ProjectionLike | nullish
): ol_proj.TransformFunction {
  if (projFrom == null || projTo == null) return transform_nop;
  return ol_proj.getTransform(projFrom, projTo);
}

function proj_point(
  p: ol_Coordinate | nullish,
  projFrom: ol_proj.ProjectionLike | nullish,
  projTo: ol_proj.ProjectionLike | nullish
): ol_Coordinate | nullish {
  if (p == null || projFrom == null || projTo == null) return p;
  return ol_proj.transform(p, projFrom, projTo);
}
function proj_extent(
  e: ol_Extent | nullish,
  projFrom: ol_proj.ProjectionLike | nullish,
  projTo: ol_proj.ProjectionLike | nullish
): ol_Extent | nullish {
  if (e == null || projFrom == null || projTo == null) return e;
  return ol_proj.transformExtent(e, projFrom, projTo);
}

function proj_auto(
  p: ol_Coordinate | ol_Extent | nullish,
  projFrom: ol_proj.ProjectionLike | nullish,
  projTo: ol_proj.ProjectionLike | nullish
): ol_Coordinate | ol_Extent | nullish {
  if (p == null || projFrom == null || projTo == null) return p;
  if (p.length === 4) return proj_extent(p as ol_Extent, projFrom, projTo);
  else return proj_point(p as ol_Coordinate, projFrom, projTo);
}

const vproj = (function () {
  let o = proj_auto;

  let dd = {
    point: proj_point,
    extent: proj_extent,
    getTransform: proj_getTransform,
  };

  Object.assign(o, dd);

  return o as typeof o &
    (typeof dd extends infer T
      ? {
          [K in keyof T]: T[K] extends (a0: infer A0, ...args: infer Args) => infer R
            ? [A0, R] extends [R, A0]
              ? {
                  (a0: A0 & {}, ...args: Args): R & {};
                  (a0: A0, ...args: Args): R;
                }
              : T[K]
            : T[K];
        }
      : never);
})();

export { vproj, vproj as default };
