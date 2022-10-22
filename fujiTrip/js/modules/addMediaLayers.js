// import ---
import * as reactiveUtils from "https://js.arcgis.com/4.24/@arcgis/core/core/reactiveUtils.js";
import MediaLayer from "https://js.arcgis.com/4.24/@arcgis/core/layers/MediaLayer.js";
import ImageElement from "https://js.arcgis.com/4.24/@arcgis/core/layers/support/ImageElement.js";
import ExtentAndRotationGeoreference from "https://js.arcgis.com/4.24/@arcgis/core/layers/support/ExtentAndRotationGeoreference.js";

import GraphicsLayer from "https://js.arcgis.com/4.24/@arcgis/core/layers/GraphicsLayer.js";
import Polyline from "https://js.arcgis.com/4.24/@arcgis/core/geometry/Polyline.js";
import Graphic from "https://js.arcgis.com/4.24/@arcgis/core/Graphic.js";

import { mapView } from "./createMap.js";

// ----------

// Web マップ、レイヤーの load 完了後に実行
reactiveUtils.once(() => mapView.map.loaded === true)
  .then(() => {

    // moduleVars
    const mapLayers = mapView.map.layers.items[0].allLayers.items;
    let extentFs, attachmentInfos;
    let mediaElements = [];

    reactiveUtils.once(() => mapLayers[0].loaded === true)
      .then(async () => {
        // 画像範囲用のフィーチャ、添付ファイルを検索
        for(let i = 0; mapLayers.length > i; i++){

          const fl = mapLayers[i];

          if(fl.geometryType === "polygon"){
            const query = fl.createQuery();
            query.where = "1 = 1";
            query.outFields = ["*"]
  
            await fl.queryFeatures(query)
              .then(async resultFs => {
                extentFs = resultFs.features;
              })

            await fl.queryAttachments({where:"1 = 1"})
              .then(resultAttachments => {
                attachmentInfos = resultAttachments;
              })
          }

        }

        console.log(extentFs)
        console.log(attachmentInfos)

        // 取得したフィーチャ毎に MediaLayer 用の情報を作成
        extentFs.forEach(feature => {

          const element = new ImageElement({
            image:attachmentInfos[feature.attributes.OBJECTID][0].url,
            georeference:new ExtentAndRotationGeoreference({
              extent:feature.geometry.extent
            })
          });
          mediaElements.push(element);

          addUnderLine(mapLayers,feature);

        });

        const mediaLayer = new MediaLayer({
          source:mediaElements
        });
        mapView.map.add(mediaLayer);

      })

  })

const addUnderLine = (mapLayers,extentFeature) => {

  const gl = new GraphicsLayer();
  mapView.map.add(gl,3);


  let pointLayer;

  for(let i = 0; mapLayers.length > i; i++){

    if(mapLayers[i].geometryType === "point"){
      pointLayer = mapLayers[i]
    }

  }

  const query = pointLayer.createQuery();
  query.where = "picID = " + extentFeature.attributes.extentID;
  pointLayer.queryFeatures(query)
    .then(pointFs => {

      const point = pointFs.features[0];

      const undeLineGeom = new Polyline({
        paths:[[point.geometry.x,point.geometry.y],[extentFeature.geometry.centroid.x,extentFeature.geometry.centroid.y]],
        spatialReference:mapView.spatialReference
      });

      const underLine = new Graphic({
        geometry:undeLineGeom,
        symbol:{
          type:"simple-line",
          color:"red",
          width:1.5,
          style:"dash"
        }
      });

      gl.graphics.add(underLine);

    })

}


