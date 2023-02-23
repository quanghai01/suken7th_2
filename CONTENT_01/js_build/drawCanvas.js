"use strict";

/* eslint-disable no-redeclare */

/* eslint-disable prefer-destructuring */

/* eslint-disable no-shadow */

/* eslint-disable no-lonely-if */

/* eslint-disable no-unused-expressions */
var g_shape;
var g_isPlaying = false;
var g_actionState = CONST.ACTION_CLOSE;
var g_stepCount = 0;
var g_initNumberOfFrames = 200;
var g_initNumberOfRotateFrames = 25;
var g_totalFrames = g_initNumberOfFrames + g_initNumberOfRotateFrames;
var g_numberOfFrames = g_initNumberOfFrames;
var g_numberOfRotateFrames = g_initNumberOfRotateFrames;
var g_lengthUnit = CONFIG.EDGE_UNIT || "cm";
var g_duration = 5000;
var g_isShowLog = false;
var g_isShowVertexId = false;
var g_interval;
var g_interval2;
var g_isAnimatingButton = false;
var g_layoutWidth = 1024;
var g_layoutHeight = 648;
var g_isRotated = false; // var g_isRotated2 = false;

var g_shapeType = CONST.SHAPE_TYPES.PAPER;
var g_isDisabledOpen = false;
var g_isDisabledClose = false;
var g_isDisabledReload = false;
var g_mouseState;
var g_isRenderShape = false;
var g_latestMousePress = "";
var g_msgLog = "";
var g_resizeCount = 0;
var g_dragablePosition = {}; // store initial dragable area position
// var g_snapSVG = Snap("#svg");

var g_zoomRatio = 1;
var g_coordinateUnit = 4.5;
var g_history = [];
var g_shapes = [];
var g_selectedShapeIdx = 1;
var g_selectedRadio = {
  rotate: true,
  show_hide: false
};
var g_cameraInitPos;
var g_cameraPrevPos = {};
var radius = 3;
var x0 = 0;
var y0 = radius * 2 * Math.sqrt(2);
var z0 = 6;
var edgeLength = radius * 2 * Math.sqrt(2);
var camera;
var projector;
var lightHolderLeft;
var lightHolderRight;
var lightHolderBack;
var lightHolderUp;
var scene;
var renderer;
var uniforms = {};
var lightLeft;
var lightUp;
var lightRight;
var lightBack;
var spotlight;
var object;
var lightHelper;
var planeMaterial;
var planeGeometry;
var floor;
var ambientLight;
var directionalLight;
var sphere;
var loader;
var cube;
var controls;
var dragControls;
var singleShape;
var container;
var axesHelper;
var g_shape_1;
var g_shape_2;
var g_shape_3;
var g_unionShapeScripts;
var g_isShowLight = false;
var g_cameraRotationInit;
var g_shadowMapSize = [1024, 1024].map(function (x) {
  return x * 2;
});
var svgRootWidth = $("#divBody").width();
var svgRootHeight = $("#divBody").height();
var windowRatio = [0.5, 0.68];
var windowWidth = windowRatio[0] * svgRootWidth;
var windowHeight = windowRatio[1] * svgRootHeight;
var backgroundColor = "white";
var lightColor = "white";
var g_isShowAxist = true;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersects = [];
$(document).ready(function () {
  initCanvas();
  hideCanvas();
});

function initCanvas() {
  singleShape = new THREE.Object3D();
  container = document.getElementById("container");
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(windowWidth / -50, windowWidth / 50, windowHeight / 50, windowHeight / -50, 1, 1000);
  camera.initCamera = [0, 0, 10];
  camera.position.set(camera.initCamera[0], camera.initCamera[1], camera.initCamera[2]);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.shadowMap.enabled = false;
  renderer.setSize(windowWidth, windowHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.append(renderer.domElement);
  projector = new THREE.Projector();
  window.addEventListener("resize", onWindowCanvasResize, false);
  sphere = new THREE.SphereGeometry(0.5, 16, 8);
  var lightInsentive = 0.4;
  var lightUpInsentive = 0.1;
  var lightAmbientInsentive = 0.3;
  var lightY = edgeLength * 0.6 * 1.2;
  var lightX = edgeLength * 0.55 * 2.1;
  var lightZ = edgeLength * 2;
  lightLeft = new THREE.DirectionalLight(lightColor, lightInsentive);
  if (g_isShowLight) lightLeft.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: "red",
    size: THREE.FrontSide
  })));
  lightLeft.position.set(-edgeLength / 2, -lightY, lightZ);
  lightHolderLeft = new THREE.Group();
  lightHolderLeft.add(lightLeft);
  lightRight = new THREE.DirectionalLight(lightColor, lightInsentive);
  lightRight.castShadow = true;
  lightRight.shadow.mapSize.width = g_shadowMapSize[0];
  lightRight.shadow.mapSize.height = g_shadowMapSize[1];
  if (g_isShowLight) lightRight.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: "red",
    size: THREE.FrontSide
  })));
  lightRight.position.set(lightX, lightY, lightZ);
  lightHolderRight = new THREE.Group();
  lightHolderRight.add(lightRight);
  lightBack = new THREE.DirectionalLight(lightColor);
  lightBack.castShadow = true;
  lightBack.shadow.mapSize.width = g_shadowMapSize[0];
  lightBack.shadow.mapSize.height = g_shadowMapSize[1];
  if (g_isShowLight) lightBack.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: "red",
    size: THREE.FrontSide
  })));
  lightBack.position.set(0, edgeLength * 1, -lightZ);
  lightHolderBack = new THREE.Group();
  lightHolderBack.add(lightBack);
  lightUp = new THREE.DirectionalLight(lightColor, lightUpInsentive);
  if (g_isShowLight) lightUp.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: "red",
    size: THREE.FrontSide
  })));
  lightHolderUp = new THREE.Group();
  lightHolderUp.add(lightUp);
  lightHolderUp.position.set(0, edgeLength * 0.7, 0);
  singleShape.add(new THREE.AmbientLight(lightColor, lightAmbientInsentive));
  singleShape.add(lightHolderUp);
  singleShape.add(lightHolderRight);
  singleShape.add(lightHolderLeft);
  camera.zoom = 3.39; // if (
  //     [CONST.BROWSER_TYPE.IE11, CONST.BROWSER_TYPE.IE10].indexOf(
  //         getBrowserType()
  //     ) > -1
  // ) {
  //     camera.zoom = 2.7;
  // }

  camera.originZoom = camera.zoom;
  camera.updateProjectionMatrix();
  var lookPoint = new THREE.Vector3(camera.x, camera.y, 0);
  console.log("cube.position", lookPoint);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableKeys = false;
  controls.enabled = false;
  scene.add(singleShape);
  console.log("camera", camera.rotation);
  g_cameraRotationInit = camera.rotation.clone();
  animate();
}

var g_currentShapes = null;

function getGeoShape(vertices, rings) {
  // console.log("rings Geo", rings);
  var geoShape = new THREE.Geometry();
  var validIds = [];
  var idMap = {};
  rings.map(function (r) {
    r.map(function (id) {
      if (validIds.indexOf(id) < 0) {
        idMap[id] = id;
        validIds.push(id);
      }
    });
  }); // console.log(idMap);

  for (var i = 0; i < vertices.length; i++) {
    var ratio = isIEBrower() ? 1.4 : 1.32;
    var p = vertices[i].multiple(ratio);
    geoShape.vertices.push(new THREE.Vector3(p.x, -p.y, p.z));
  }

  var n = rings[0].length;
  console.log("n", n);

  for (var i = 0; i < rings.length - 1; i++) {
    for (var j = 0; j < n; j++) {
      var j1 = rings[i][j];
      var j2 = rings[i][(j + 1) % n];
      var j3 = rings[i + 1][(j + 1) % n];
      var j4 = rings[i + 1][j];
      geoShape.faces.push(new THREE.Face3(idMap[j4], idMap[j3], idMap[j2]));
      geoShape.faces.push(new THREE.Face3(idMap[j4], idMap[j2], idMap[j1]));
    }
  }

  return geoShape;
}

function createOutlineElement(geometry, size, lineWidth) {
  var material;
  var outline;
  var scale;
  var EDGE_LINE_WIDTH = 2;

  if (lineWidth === undefined) {
    lineWidth = EDGE_LINE_WIDTH;
  } else {
    lineWidth = Math.abs(lineWidth);
  }

  scale = 1 + EDGE_LINE_WIDTH * 1.4 / size;
  material = new THREE.MeshBasicMaterial({
    color: "#005aff",
    transparent: true,
    side: THREE.BackSide
  });
  outline = new THREE.Mesh(geometry, material);
  outline.flipSided = true;
  outline.castShadow = false;
  outline.scale.x = scale;
  outline.scale.y = scale;
  outline.scale.z = scale;
  outline.renderOrder = 1;
  return outline;
}

function drawCanvasShape(vertices, faces, rings, id) {
  camera.position.set(camera.initCamera[0], camera.initCamera[1], camera.initCamera[2]);

  if (id == 12) {
    camera.up.set(2, 3, 0);
  } else {
    camera.up.set(0, 1, 0);
  }

  if (g_currentShapes) {
    g_currentShapes.forEach(function (sh) {
      return singleShape.remove(sh);
    });
    g_currentShapes = null;
  }

  var color = id <= 13 ? CONFIG.STROKE_COLOR_3D : CONFIG.STROKE_COLOR_3D_DRAW;
  var fillColor = id <= 13 ? CONFIG.FILL_COLOR_3D : CONFIG.FILL_COLOR_3D_DRAW;
  var geoShape = getGeoShape(vertices, rings);
  var shapeMesh = new THREE.Mesh(geoShape, new THREE.MeshBasicMaterial({
    color: fillColor,
    side: THREE.DoubleSide,
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  }));
  var edgesMesh = new THREE.LineSegments(new THREE.EdgesGeometry(geoShape, 0.5), new THREE.LineBasicMaterial({
    color: color,
    //"#005aff",
    // linewidth: 1.5,
    // side: THREE.FrontSide
    depthTest: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  }));
  var edgesMeshDashed = new THREE.LineSegments(new THREE.EdgesGeometry(geoShape), new THREE.LineDashedMaterial({
    color: color,
    //"#005aff", // "#005aff",
    transparent: true,
    opacity: 0.2,
    scale: 30,
    linewidth: 1,
    dashSize: 3,
    gapSize: 0,
    depthTest: false,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  }));
  edgesMeshDashed.computeLineDistances();
  g_currentShapes = [shapeMesh, edgesMesh, edgesMeshDashed];
  g_currentShapes.forEach(function (sh) {
    return singleShape.add(sh);
  });
  onWindowCanvasResize();
}

function removeCanvasShape() {
  if (g_currentShapes) {
    g_currentShapes.forEach(function (sh) {
      return singleShape.remove(sh);
    });
    g_currentShapes = null;
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // $(".text-log").text(["zoom " + controls.object.zoom, window.isMobileOrTabLet ? " isMobile" : "", window.factor, navigator.userAgent].join(" | "));
  controls.update();
  camera.updateMatrixWorld();
  lightHolderUp.quaternion.copy(camera.quaternion);
  lightHolderLeft.quaternion.copy(camera.quaternion);
  lightHolderRight.quaternion.copy(camera.quaternion);
  lightHolderBack.quaternion.copy(camera.quaternion);
  renderer.render(scene, camera);
}

function onWindowCanvasResize() {
  var count = 0;

  var fn = function fn() {
    svgRootWidth = $("#divBody").width();
    svgRootHeight = $("#divBody").height();
    windowWidth = windowRatio[0] * svgRootWidth;
    windowHeight = windowRatio[1] * svgRootHeight;
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    console.log("onWindowCanvasResize", count, windowWidth, windowHeight);
    renderer.setSize(windowWidth, windowHeight);
  };

  fn();
  var itv = setInterval(function () {
    if (count > 10) {
      clearInterval(itv);
      return;
    }

    count += 1;
    fn();
  }, 50); // if(controls) controls.handleResize();
}

function showCanvas() {
  scene.visible = true;

  if (!$("#container").parent().attr("origin-left")) {
    $("#container").parent().attr("origin-left", "50%");
  }

  $("#container").parent().css("left", $("#container").parent().attr("origin-left"));
}

function hideCanvas() {
  scene.visible = false;

  if (!$("#container").parent().attr("origin-left")) {
    $("#container").parent().attr("origin-left", "50%");
  }

  $("#container").parent().css("left", "300%");
}