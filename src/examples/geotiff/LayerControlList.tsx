import { useContext, useEffect } from "react";
import MapContext from "../../components/map/context/MapContext";
import { LayerSpec } from "./GeoTiff";
import * as ol_control from "ol/control";
import * as ol_proj from "ol/proj";
import { createPortal } from "react-dom";


const LayerControl = (props: {
    layer: LayerSpec,
    removeLayer: (url: string) => void,
}) => {
    let layer = props.layer;
    let removeLayer = props.removeLayer;
    return (
        <div style={{
            display: "flex",
        }}>
            <button style={{
                display: "flex",
                flexGrow: 1,
                height: "auto",
            }} onClick={(e) => {
                if (layer.zoomToView != null) {
                    layer.zoomToView();
                }
                else {
                    layer.initZoom = true;
                }
            }} title="zoom to layer">{layer.name}</button>
            <input style={{
                display: "flex",
                width: "1em",
            }} type="checkbox" ref={(e) => (e && (e.checked = !!(layer.visible ?? true)))} onChange={(e) => {
                layer.visible = e.target.checked;
                if (layer.setVisible != null) {
                    layer.setVisible(e.target.checked);
                }
            }} />
            <button style={{
                display: "flex",
                width: "1em",
            }} onClick={(e) => {
                removeLayer(layer.url);
            }} title="remove layer">X</button>
        </div>
    );
};

const ControlContainer = (props: {
    children: React.ReactNode,
}) => {
    let { map } = useContext(MapContext);

    let d = document.createElement("div");
    d.className = "ol-unselectable ol-control";
    Object.assign(d.style, {
        right: "0.5em",
        bottom: "0.5em",
        position: "absolute",
        width: "10em",
        display: "flex",
        flexDirection: "column",
    } satisfies Partial<typeof d.style>);

    let ft = new ol_control.Control({
        element: d,
    });

    useEffect(() => {
        if (map == null) return;
        map.addControl(ft);
        return () => {
            map.removeControl(ft);
        };
    }, [map]);

    return createPortal(props.children, d);
}

const LayerControlList = (props: {
    layers: LayerSpec[],
    removeLayer: (url: string) => void,
}) => {
    let ll = props.layers.map((l) => {
        return <LayerControl key={l.url} layer={l} removeLayer={props.removeLayer} />;
    });

    console.log(ll.length);

    return <ControlContainer key={Math.random()}>
        {...ll}
        </ControlContainer>;

};

export {
    LayerControlList as default,
    LayerControlList,
    LayerControl,
};