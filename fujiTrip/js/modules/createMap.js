// import ---
import WebMap from "https://js.arcgis.com/4.24/@arcgis/core/WebMap.js";
import MapView from "https://js.arcgis.com/4.24/@arcgis/core/views/MapView.js";

// ----------

const webmap = new WebMap({
  portalItem:{
    id:"6b181eab632f42e7a5ee945a3d03b0fa"
  }
});

const mapView = new MapView({
  map:webmap,
  container:"viewDiv"
});

export {
  mapView as mapView
};