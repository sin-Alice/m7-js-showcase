import { domLists } from "./domCreator.js";

import Map from "https://js.arcgis.com/4.23/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.23/@arcgis/core/views/MapView.js";

import GraphicsLayer from "https://js.arcgis.com/4.23/@arcgis/core/layers/GraphicsLayer.js";

import * as query from "https://js.arcgis.com/4.23/@arcgis/core/rest/query.js";
import Query from "https://js.arcgis.com/4.23/@arcgis/core/rest/support/Query.js";

import * as projection from "https://js.arcgis.com/4.23/@arcgis/core/geometry/projection.js";
import {project} from "https://js.arcgis.com/4.23/@arcgis/core/rest/geometryService.js";
import ProjectParameters from "https://js.arcgis.com/4.23/@arcgis/core/rest/support/ProjectParameters.js";
import SpatialReference from "https://js.arcgis.com/4.23/@arcgis/core/geometry/SpatialReference.js";

import Graphic from "https://js.arcgis.com/4.23/@arcgis/core/Graphic.js";

import Compass from "https://js.arcgis.com/4.23/@arcgis/core/widgets/Compass.js";

// ----------

const baseSR = new SpatialReference({
  // wkt:'"PROJCS["North_Pole_Lambert_Azimuthal_Equal_Area",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Lambert_Azimuthal_Equal_Area"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",0],PARAMETER["Latitude_Of_Origin",90],UNIT["Meter",1]]"'
  wkid:102017
});

const mapMain = new Map();
const gl = new GraphicsLayer();
mapMain.add(gl);

const mapView = new MapView({
  map:mapMain,
  container:domLists.mapViewDiv
});

// ----------

let baseFeatures;

query.executeQueryJSON(
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
  new Query({
    where:"1 = 1",
    returnGeometry:true,
    outFields:["*"],
    outSpatialReference:baseSR
  })
)
  .then((resultFS) => {

    baseFeatures = resultFS.features;

    const geometriesArr = baseFeatures.map(feature => feature.geometry);

    // project(
    //   "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    //   new ProjectParameters({
    //     geometries:geometriesArr,
    //     outSpatialReference:baseSR
    //   })
    //   )
    //     .then((projectResult) => {
    //       console.log(projectResult);
    //     },(error) => {
    //       console.log(error);
    //     })

    projection.load()
      .then(() => {
        const projectedGeometries = projection.project(
          geometriesArr,
          baseSR
        )
    
        projectedGeometries.forEach((projectedGeometry) => {
          const graphic = new Graphic({
            geometry:projectedGeometry,
            symbol:{
              type: "simple-fill",
              color: [255,0,0,0.5],
              style: "solid",
              outline: {
                color: "red",
                width: 1
              }
            }
          });
    
          gl.add(graphic);
    
        })

        mapView.spatialReference = baseSR;

        query.executeForExtent(
          "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0",
          new Query({
            where:"1 = 1",
            outSpatialReference:baseSR
          })
        )
        .then(resultExt => {

          console.log(resultExt);

          const viewPoint = new Viewpoint({
            targetGeometry:resultExt.extent
          })
          mapView.goTo(viewPoint)
        });

      })

  });

// ----------

const compass = new Compass({
  view:mapView
});
mapView.ui.add(compass,"top-left");

// ----------

export {
  mapView as MainMapView
}