require([
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",

  "esri/layers/MediaLayer",
  "esri/layers/support/ImageElement",
  "esri/layers/support/ExtentAndRotationGeoreference",
  "esri/geometry/Extent"

], (
  Map,
  MapView,
  SceneView,

  MediaLayer,
  ImageElement,
  ExtentAndRotationGeoreference,
  Extent

  ) => {
    
    const mapMain = new Map();

    const sceneView = new MapView({
      map:mapMain,
      container:"viewDiv"
    });

    const imageElement = new ImageElement({
      image:"./images/DSC_0001_6.jpg",
      georeference:new ExtentAndRotationGeoreference({
        extent:new Extent({
          spatialReference:{
            wkid:4326
          },
          xmin:-180,
          xmax:180,
          ymin:-90,
          ymax:90
        })
      })
    });

    const mediaLayer = new MediaLayer({
      source:[imageElement]
    });

    mapMain.add(mediaLayer);


  });