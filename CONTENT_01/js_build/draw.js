
var updateData14 = false;
var g_shape2D,g_shape2D_check=Array(14).fill(false);
var g_isRemove=false
var g_shape2D_copy =[] ;

console.log(g_shape2D_copy,g_shape2D_check)
var g_shape3D;
var g_isPlaying = false;
var g_isPlaying_check = Array(14).fill(false);
var g_duration = 5000;
var g_isShowLog = false;
var g_isShowVertexId = false;
var g_isAnimatingButton = false;
var g_layoutWidth = 1024;
var g_layoutHeight = 648;
var g_isRotated = false;
var g_mouseState;
var g_shape2DType = -1;
var g_isRenderShape = false;
var g_latestMousePress = "";
var g_msgLog = "";
var g_dragablePosition = {}; // store initial dragable area position

var g_dragableDrawPosition = {}; // store initial dragable area position

var g_snapSVG = Snap("#svg");
var g_zoomRatio = 1;
var g_showOH = false;
var g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;
var g_selectedShapeId = 1;
var g_radioCheckedStates = [true, false, false],g_radioCheckedStatesRect = [true, false, false],g_radioCheckedStatesTri = [true, false, false],g_radioCheckedStatesDraw = [true, false, false];
var g_checkboxShow3D = CONFIG.SHOW_3D;var g_checkboxShow3D_1 = Array(14).fill(false);

var g_intervalBtn;
var g_interval1;
var g_interval2;
var g_interval3;
var g_interval1Flag = -1;
var g_gridData = {
  width: 336,
  height: 504,
  numberX: 12,
  sizeX: 28,
  numberY: 18,
  sizeY: 28,
  axisXValue: 336,
  minX: 0
}; // var g_pointData14Step = -1;

var g_pointData14 = [];
var g_hasGrid14 = true;
var g_totalStep14 = -1;
var g_currentStep14 = -1;
var g_minStep_14_0 = -1;
var g_minStep_14_1 = -1;
var g_stepCount14 = 0;
var g_pointData15 = [];
var g_hasGrid15 = true;
var g_totalStep15 = -1;
var g_currentStep15 = -1;
var g_minStep_15_0 = -1;
var g_minStep_15_1 = -1;
var g_stepCount15 = 0;
var g_msgLog = "";
var g_count = 0;
var g_finishDrawingNoGrid14 = false;
var g_finishDrawingNoGrid15 = false;
var g_isDisableBack = false;
var g_isDisableNext = false;
var g_isDisableSave = false;
var g_pressTime0;
var g_pressTime1; 


// ---------------------------------------------------------

window.addEventListener("touchmove", function (ev) {
  ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
}, {
  passive: false
});
window.addEventListener("mousemove", function (ev) {
  ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
}); // ---------------------------------------------------------

var Draw = {
  setting: {
    svgDom: function svgDom() {
      return $("#svg");
    },
    grid: 110,
    lineStyle: {
      stroke: "black",
      "stroke-width": "2.5px"
    }
  },
  init: function init() {
    var svgShape = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
      id: "svg_shapes",
      transform: SVGLib.getStrMatrix(1, 0, 0, 1, 512, 374)
    });
    this.setting.svgDom().append(svgShape);

    this.shapeGroup = function () {
      return $("#svg_shapes");
    };
  },
  rotateEvent: function rotateEvent(element) {
    var prevX = 0;
    var prevY = 0;
    $(element).draggable({
      start: function start(event, ui) {
        prevX = event.clientX;
        prevY = event.clientY;
        enableReload(); // event.preventDefault();

        event.stopPropagation();
      },
      drag: function drag(event, ui) {
        var x = event.clientX;
        var y = event.clientY;
        var w = window.innerWidth;
        var h = window.innerHeight;
        w = Math.min(w, h * g_layoutWidth / g_layoutHeight);
        var dx = x - prevX;
        var dy = y - prevY;
        var ratio = 0.4 * g_layoutWidth / w;
        var r = (Math.abs(dx) + 0.0001) / (Math.abs(dy) + 0.0001); // $(".shape_layer").remove();
        // shape 2D

        if (r < 0.2) {
          g_shape2D.rotateX(dy * ratio); // g_shape3D.rotateX(dy * ratio);
        } else if (r > 1 / 0.2) {
          g_shape2D.rotateY2(dx * ratio); // g_shape3D.rotateY2(-dx * ratio);
        } else {
          g_shape2D.rotateX(dy * ratio);
          g_shape2D.rotateY2(dx * ratio); // g_shape3D.rotateX(dy * ratio);
          // g_shape3D.rotateY2(-dx * ratio);
        }

        if (singleShape) {
          singleShape.rotation.set((g_shape2D.rotateTotalY - 0) * Math.PI / 180, g_shape2D.rotateTotalX * Math.PI / 180, singleShape.rotation.z);
        }
        g_shape2D_copy[g_selectedShapeId-1] = g_shape2D
        

       
       
        g_shape2D.render(); // g_shape3D.render();

        keepDraggableSvgNotMove();
        prevX = x;
        prevY = y; // event.preventDefault();

        event.stopPropagation(); // writeLog();
      }
    });
  },
  appendToShapeGroup: function appendToShapeGroup(childElement) {
    this.shapeGroup().append(childElement);
    return childElement;
  },
  appendToFloatingShapeGroup: function appendToFloatingShapeGroup(childElement) {
    this.floatingShapeGroup.append(childElement);
  }
}; // ---------------------------------------------------------

function showElement(element, visible) {
  $(element).css("opacity", visible ? 1 : 0);
  $(element).css("visibility", visible ? "visible" : "hidden");
}

function updateLog() {
  $("#log-text").html(g_msgLog);
}

function minifyNumber(str) {
  var n = 2;
  var p = Math.pow(10, n);
  var str2 = str;
  var i = 0;

  while (i < str.length) {
    if (str[i] == ".") {
      var j = i - 1;

      while (j >= 0 && str[j] >= "0" && str[j] <= "9") {
        j--;
      }

      var k = i + 1;

      while (k < str.length && str[k] >= "0" && str[k] <= "9") {
        k++;
      }

      var s = str.substring(j + 1, k);
      var x = Math.round(parseFloat(s) * p) / p;
      str2 = str2.replace(s, x.toString());
      i = k;
    } else {
      i++;
    }
  }

  return str2;
}

function writeLog() {
  // $("#text-log").text(msg);
  $(".text-log").text(g_msgLog);
}

var itvKeepSVGNotMove;

function keepDraggableSvgNotMove() {
  if (g_dragablePosition.top === undefined) {
    g_dragablePosition.top = parseInt($(".draggable-zone").css("top"), 10) || 0;
    g_dragablePosition.left = parseInt($(".draggable-zone").css("left"), 10) || 0;
  } else {
    setTimeout(function () {
      $(".draggable-zone").css("top", g_dragablePosition.top);
      $(".draggable-zone").css("left", g_dragablePosition.left);
    }, 50);
  }

  if (g_dragableDrawPosition.top === undefined) {
    g_dragableDrawPosition.top = parseInt($("#drawing-area").css("top"), 10) || 0;
    g_dragableDrawPosition.left = parseInt($("#drawing-area").css("left"), 10) || 0;
  } else {
    setTimeout(function () {
      $("#drawing-area").css("top", g_dragableDrawPosition.top);
      $("#drawing-area").css("left", g_dragableDrawPosition.left);
    }, 50);
  }

  if (!itvKeepSVGNotMove) itvKeepSVGNotMove = setInterval(function () {
    keepDraggableSvgNotMove();
  }, 200);
}

function animateButtonEffect(id, isDown) {
  if (g_isAnimatingButton) return;
  g_isAnimatingButton = true;
  if (g_intervalBtn) clearInterval(g_intervalBtn);
  var self = $(id);
  var duration = 200;
  var nFrame = 10;
  var dy1 = isDown ? 0 : 4;
  var dy2 = isDown ? 4 : 0;
  var ddy = (dy2 - dy1) / nFrame;
  g_intervalBtn = setInterval(function () {
    dy1 += ddy;
    self.attr("transform", SVGLib.getStrMatrix(1, 0, 0, 1, 0, dy1));

    if (Math.abs(dy1 - dy2) < CONST.EPSILON) {
      clearInterval(g_intervalBtn);
      g_isAnimatingButton = false;
    }
  }, duration / nFrame);
}

var g_isMouseDown = false;

var groupStaticButton = function groupStaticButton(buttonName, showEl) {
  $("#btn-".concat(buttonName, "-group")).prepend("<g id=\"btn-".concat(buttonName, "-down\">  <rect class=\"rect-button\" width=\"146\" height=\"44\" style=\"fill: transparent\"></rect> </g>")).prepend("<g id=\"btn-".concat(buttonName, "-active\">  <rect class=\"rect-button\" width=\"146\" height=\"44\" style=\"fill: transparent\"></rect> </g>")).prepend("<g id=\"btn-".concat(buttonName, "-inactive\">  <rect class=\"rect-button\" width=\"146\" height=\"44\" style=\"fill: transparent\"></rect> ></g>")).prepend("<g id=\"btn-".concat(buttonName, "-disabled\">  <rect class=\"rect-button\" width=\"146\" height=\"44\" style=\"fill: transparent\"></rect> </g>"));
  var hardCodeSufix = "<script type=\"text/javascript\">\n        //      <![CDATA[  <-- For SVG support\n        //          ]]>\n        </script></svg>";
  var buttonStatus = ["down", "active", "inactive", "disabled"];
  var btnConfigKey = buttonName.replace(/-/g, "_");
  buttonStatus.forEach(function (status) {
    if (CONFIG_SVG["btn_".concat(btnConfigKey, "_").concat(status)]) {
      $("#btn-".concat(buttonName, "-").concat(status)).prepend(CONFIG_SVG["btn_".concat(btnConfigKey, "_").concat(status)].replace("</svg>", hardCodeSufix).replace(/clip-path:url\(#clip-path(-\d)*\)/g, ""));
      $("#btn-".concat(buttonName, "-").concat(status)).find("svg").removeAttr("viewBox");
      $("#btn-".concat(buttonName, "-").concat(status)).find("script").remove();
      $("#btn-".concat(buttonName, "-").concat(status)).find("defs").remove();
      $("#btn-".concat(buttonName, "-").concat(status)).find("title").remove();
      if (status != showEl) showElement("#btn-".concat(buttonName, "-").concat(status), false);
    }
  });
};

var staticElement = function staticElement(element, svg) {
  var hardCodeSufix = "<script type=\"text/javascript\">\n          //      <![CDATA[  <-- For SVG support\n          //          ]]>\n          </script></svg>";
  $(element).html((svg || "").replace("</svg>", hardCodeSufix).replace(/clip-path:url\(#clip-path(-\d)*\)/g, ""));
  $(element).find("svg").removeAttr("viewBox");
  $(element).find("script").remove();
  $(element).find("defs").remove();
  $(element).find("title").remove();
};

var loadConfigAndStaticSVG = function loadConfigAndStaticSVG() {
  groupStaticButton("open", "inactive");
  groupStaticButton("close", "disabled");
  groupStaticButton("reload", "inactive"); // $("#buttons-group").html($("#buttons-group").html());
  // staticElement("#seekbar-icon-start-2", CONFIG_SVG.seekbar_icon_start);
  // staticElement("#seekbar-icon-end-2", CONFIG_SVG.seekbar_icon_end);
  // staticElement("#seekbar-handler", CONFIG_SVG.seekbar_cursor);
  // staticElement("#seekbar-line", CONFIG_SVG.seekbar_line);
  // $("#data-shape-2").html($("#data-shape-2").html());

  $("#divBody").html($("#divBody").html());
  $("#seekbar-icon-start-2").find("polygon:first").css("fill", CONFIG.FACE_COLOR_INSIDE);
};

var renderRadioButtons = function renderRadioButtons() {
  if(g_selectedShapeId==1) g_radioCheckedStates = g_radioCheckedStatesRect
  else if (g_selectedShapeId==2) g_radioCheckedStates = g_radioCheckedStatesTri
  else g_radioCheckedStates = g_radioCheckedStatesDraw


  for (var i = 0; i < g_radioCheckedStates.length; i++) {
    var checked = g_radioCheckedStates[i];
    showElement(["#btn-radio", i + 1, "true"].join("-"), checked);
    showElement(["#btn-radio", i + 1, "false"].join("-"), !checked);
  }
};

var g_itvEvent = false;
var g_isEnableEvent = true;

function disableMouseEvent() {
  if (g_itvEvent) clearTimeout(g_itvEvent);
  g_isEnableEvent = false;
  g_itvEvent = setTimeout(function () {
    g_isEnableEvent = true;
  }, 200);
}

function initShape(data) {
    console.log("updaye14",updateData14, "g_shape2D_check[13]",g_shape2D_check[13])
    if(g_shape2D_check[g_selectedShapeId-1] ) {
      g_shape2D = g_shape2D_copy[g_selectedShapeId-1]
      Draw.appendToShapeGroup(g_shape2D.initDom());
    }
    else {

      var translateVector1 = new Point3D(-1.27, -0.41, 0).multiple(2);
      g_shape2D = new Shape3D(CONST.SHAPE_TYPES.SHAPE_2D, new Point3D(0, 0.02, 0), Draw.setting.grid, g_selectedShapeId, translateVector1, data);
      Draw.appendToShapeGroup(g_shape2D.initDom());
      if(g_selectedShapeId==14) {
        g_shape2D_check[13]=true
      }
    }
    g_shape2D_check[g_selectedShapeId-1] =true
    g_shape2D_copy[g_selectedShapeId-1] = g_shape2D
  console.log("initShape", data);
  console.log("shap2d_copy: ",g_shape2D_copy)
  console.log("shap2d: ",g_shape2D)
  console.log("shap2d_check: ",g_shape2D_check)
  g_shape2D.render();



  var translateVector2 = new Point3D(1.27, -0.41, 0).multiple(2);
  g_shape3D = new Shape3D(CONST.SHAPE_TYPES.SHAPE_3D, new Point3D(0, 0, 0), Draw.setting.grid, g_selectedShapeId, translateVector2, data);
  Draw.appendToShapeGroup(g_shape3D.initDom()); // g_shape3D.render();
  g_shape3D.render();

  updateVisibility3DShape();
  
}

function enableReload() {
  showElement("#btn-reload-inactive", true);
  showElement("#btn-reload-active", false);
  showElement("#btn-reload-disabled", false);
}

function disableReload() {
  showElement("#btn-reload-inactive", false);
  showElement("#btn-reload-active", false);
  showElement("#btn-reload-disabled", true);
}

function removeShape() {
  g_interval1 = null;
  g_interval1Flag = 0;
  g_interval2 = null;
  g_interval3 = null;
  $("#svg_shapes").empty();
  Draw.init();
}

function reload() {
  renderRadioButtons();
}

function playShape() {
  
  g_interval1 = setInterval(function () {
    if (!g_isPlaying && g_shape2D && g_radioCheckedStates[0]) {
      // g_shape2D.updateLayer2(32);
      // $(".shape_layer").remove();
      g_shape2D.showInitLayer();
    }

    if (!g_isPlaying || !g_shape2D || !g_shape3D || !g_radioCheckedStates[0]) return;
    if (g_selectedShapeId == 14) g_stepCount14++;else g_stepCount15++;
    enableReload();
    g_shape2D.alphaY = Math.floor(g_shape2D.alphaY / 10) * 10;
    console.log("g_shape2D.alphaY", g_shape2D.alphaY);

    if (g_interval1Flag >= 0 && g_shape2D.alphaY % 90 == 0 && g_interval1Flag < 15) {
      g_interval1Flag++;
      g_shape2D.showInitLayer(); // g_shape2D.updateLayer2(5);

      if (g_selectedShapeId == 14) g_stepCount14 = 0;else g_stepCount15 = 0;
    } else {
      g_interval1Flag = 0;
      g_shape2D.rotateY2(10); // g_shape3D.rotateY2(5);
      g_shape2D.render();
      g_shape2D.updateLayer(Math.min(6, g_selectedShapeId == 14 ? g_stepCount14 : g_stepCount15), 2); // g_shape3D.render();
    }
    g_shape2D_copy[g_selectedShapeId-1] = g_shape2D
  }, 60);
  g_interval2 = setInterval(function () {
    if (!g_isPlaying && g_shape2D && g_radioCheckedStates[1]) {
      // g_shape2D.updateLayer2(32);
      g_shape2D.showInitLayer();
    }

    if (!g_isPlaying || !g_shape2D || !g_shape3D || !g_radioCheckedStates[1]) return;
    if (g_selectedShapeId == 14) g_stepCount14++;else g_stepCount15++;
    enableReload();
    g_shape2D.rotateY2(5); // g_shape3D.rotateY2(10);
 
    g_shape2D.render();
    g_shape2D.updateLayer(Math.min(8, g_selectedShapeId == 14 ? g_stepCount14 : g_stepCount15)); // g_shape3D.render();
    g_shape2D_copy[g_selectedShapeId-1] = g_shape2D
  }, 50);
  g_interval3 = setInterval(function () {
    if (!g_isPlaying && g_shape2D && g_radioCheckedStates[2]) {
      // g_shape2D.updateLayer2(32);
      g_shape2D.showInitLayer();
    }

    if (!g_isPlaying || !g_shape2D || !g_shape3D || !g_radioCheckedStates[2]) return;
    g_stepCount14 += 2;
    enableReload();
    g_shape2D.rotateY2(10); // g_shape3D.rotateY2(20);

    g_shape2D.render();
    g_shape2D.updateLayer(Math.max(50, g_selectedShapeId == 14 ? g_stepCount14 : g_stepCount15)); // g_shape3D.render();
    g_shape2D_copy[g_selectedShapeId-1] = g_shape2D
  }, 30);


}

function updateVisibility3DShape() {
  $("#".concat(["shape_dom", g_shape3D.shapeId].join("_"))).attr("opacity", g_checkboxShow3D ? 1 : 0);
} // DRAW


function updateGridPoint14() {
 updateData14=true
 g_shape2D_check[13]=false 
  console.log("updateGridPoint14");
  var minStep = g_hasGrid14 ? g_minStep_14_1 : g_minStep_14_0;
  showElement("#btn-drawing-save-inactive", true);
  showElement("#btn-drawing-save-active", false);
  showElement("#btn-drawing-save-disabled", false);
  g_isDisableBack = false;
  g_isDisableNext = false;
  g_isDisableSave = false;

  var _pointData = g_pointData14.filter(function (p) {
    return p[2] <= g_currentStep14;
  });

  if (_pointData.length < 2) g_isDisableSave = true;

  if (_pointData.length == 0) {
    g_isDisableBack = true;
    g_isDisableNext = true; // showElement("#btn-drawing-back-active", false);
    // showElement("#btn-drawing-back-inactive", true);
    // showElement("#btn-drawing-next-active", false);
    // showElement("#btn-drawing-next-inactive", true);
    // showElement("#btn-drawing-save-inactive", false);
    // showElement("#btn-drawing-save-active", false);
    // showElement("#btn-drawing-save-disabled", true);
  }

  if (g_currentStep14 <= minStep) {
    if (!g_isDisableBack) g_isDisableBack = true; // showElement("#btn-drawing-back-active", false);
    // showElement("#btn-drawing-back-inactive", true);
  }

  if (g_currentStep14 == g_totalStep14) {
    if (!g_isDisableNext) g_isDisableNext = true; // showElement("#btn-drawing-back-active", true);
    // showElement("#btn-drawing-back-inactive", false);
    // showElement("#btn-drawing-next-active", false);
    // showElement("#btn-drawing-next-inactive", true);
  } else if (g_currentStep14 < g_totalStep14) {
    g_isDisableNext = false; // if (g_currentStep14 == -1) {
    // showElement("#btn-drawing-back-active", false);
    // showElement("#btn-drawing-back-inactive", true);
    // showElement("#btn-drawing-save-inactive", false);
    // showElement("#btn-drawing-save-active", false);
    // showElement("#btn-drawing-save-disabled", true);
    // } else {
    //     showElement("#btn-drawing-back-active", true);
    //     showElement("#btn-drawing-back-inactive", false);
    // }
    // showElement("#btn-drawing-next-active", true);
    // showElement("#btn-drawing-next-inactive", false);
  }

  showElement("#btn-drawing-back-active", !g_isDisableBack);
  showElement("#btn-drawing-back-inactive", g_isDisableBack);
  showElement("#btn-drawing-next-active", !g_isDisableNext);
  showElement("#btn-drawing-next-inactive", g_isDisableNext);
  showElement("#btn-drawing-save-inactive", !g_isDisableSave); // showElement("#btn-drawing-save-active", !g_isDisableSave);

  showElement("#btn-drawing-save-disabled", g_isDisableSave); // reset

  $("#grid-point-group").empty();
  $("#grid-line-group").empty();
  var l = _pointData.length;

  if (g_hasGrid14 && l > 0) {
    for (var i = 0; i < l; i++) {
      var id = ["grid_point", i].join("_");
      var el = $("#".concat(id));
      var m = _pointData[i][0];
      var n = _pointData[i][1];
      var x = m * g_gridData.sizeX;
      var y = n * g_gridData.sizeY;

      if (el.length > 0) {
        $(el).attr("cx", x);
        $(el).attr("cy", y);
      } else {
        var pointStyle = {
          r: 5,
          fill: i < l - 1 ? "#000" : "#ff4b00"
        };
        var svgPoint = SVGLib.drawPoint2(x, y, pointStyle, id, "grid_point");
        $("#grid-point-group").append(svgPoint);
      }
    }
  }

  var id = "grid_line";
  var el = $("#".concat(id));

  var pointData = _pointData.map(function (v) {
    return new Point3D(v[0] * (g_hasGrid14 ? g_gridData.sizeX : 1), v[1] * (g_hasGrid14 ? g_gridData.sizeY : 1), 0);
  });

  if (el.length > 0) {
    var d = SVGLib.getFacePath2(pointData, true);
    $(el).attr("d", d);
  } else {
    var lineStyle = {
      fill: "none",
      "stroke-width": "4px",
      stroke: "#03af7a",
      "stroke-linejoin": "round"
    };
    var svgLine = SVGLib.drawFace2(pointData, lineStyle, id, true);
    $("#grid-line-group").append(svgLine);
  }
}

function updateGridPoint15() {
  var minStep = g_hasGrid15 ? g_minStep_15_1 : g_minStep_15_0;
  showElement("#btn-drawing-save-inactive", true);
  showElement("#btn-drawing-save-active", false);
  showElement("#btn-drawing-save-disabled", false);
  g_isDisableBack = false;
  g_isDisableNext = false;
  g_isDisableSave = false;

  var _pointData = g_pointData15.filter(function (p) {
    return p[2] <= g_currentStep15;
  });

  console.log("updateGridPoint15", g_hasGrid15, _pointData);
  if (_pointData.length < 2) g_isDisableSave = true;

  if (_pointData.length == 0) {
    g_isDisableBack = true;
    g_isDisableNext = true;
  }

  if (g_currentStep15 <= minStep) {
    if (!g_isDisableBack) g_isDisableBack = true;
  }

  if (g_currentStep15 == g_totalStep15) {
    if (!g_isDisableNext) g_isDisableNext = true;
  } else if (g_currentStep15 < g_totalStep15) {
    g_isDisableNext = false;
  }

  showElement("#btn-drawing-back-active", !g_isDisableBack);
  showElement("#btn-drawing-back-inactive", g_isDisableBack);
  showElement("#btn-drawing-next-active", !g_isDisableNext);
  showElement("#btn-drawing-next-inactive", g_isDisableNext);
  showElement("#btn-drawing-save-inactive", !g_isDisableSave);
  showElement("#btn-drawing-save-disabled", g_isDisableSave); // reset

  $("#grid-point-group").empty();
  $("#grid-line-group").empty();
  var l = _pointData.length;

  if (g_hasGrid15 && l > 0) {
    for (var i = 0; i < l; i++) {
      var id = ["grid_point", i].join("_");
      var el = $("#".concat(id));
      var m = _pointData[i][0];
      var n = _pointData[i][1];
      var x = m * g_gridData.sizeX;
      var y = n * g_gridData.sizeY;

      if (el.length > 0) {
        $(el).attr("cx", x);
        $(el).attr("cy", y);
      } else {
        var pointStyle = {
          r: 5,
          fill: i < l - 1 ? "#000" : "#ff4b00"
        };
        var svgPoint = SVGLib.drawPoint2(x, y, pointStyle, id, "grid_point");
        $("#grid-point-group").append(svgPoint);
      }
    }
  }

  var id = "grid_line";
  var el = $("#".concat(id));

  var pointData = _pointData.map(function (v) {
    return new Point3D(v[0] * (g_hasGrid15 ? g_gridData.sizeX : 1), v[1] * (g_hasGrid15 ? g_gridData.sizeY : 1), 0);
  });

  if (el.length > 0) {
    var d = SVGLib.getFacePath2(pointData, true);
    $(el).attr("d", d);
  } else {
    var lineStyle = {
      fill: "none",
      "stroke-width": "4px",
      stroke: "#03af7a",
      "stroke-linejoin": "round"
    };
    var svgLine = SVGLib.drawFace2(pointData, lineStyle, id, true);
    $("#grid-line-group").append(svgLine);
  }
}

function publishShape(id) {
  window.localStorage.setItem([CONFIG.CONTENT_KEY, id, "grid"].join("_"), id == 14 ? g_hasGrid14 : g_hasGrid15);
  $(".shape_layer").remove();

  if (id == 14) {
    var initVertices = [];

    var _pointData = g_pointData14.filter(function (p) {
      return p[2] <= g_currentStep14;
    }).map(function (p) {
      return [p[0], p[1], 0];
    });

    if (g_hasGrid14) {
      g_minStep_14_1 = g_currentStep14;
      console.log("_pointData", _pointData);

      for (var i = 0; i < _pointData.length; i++) {
        var xx = (_pointData[i][0] / g_gridData.numberX - 1) * 2 / 3;
        var yy = _pointData[i][1] / g_gridData.numberY - 1 / 2;
        initVertices.push(new Point3D(xx, yy, 0));
      }

      console.log("initVertices", initVertices);
      window.localStorage.setItem([CONFIG.CONTENT_KEY, 14, 1].join("_"), JSON.stringify(_pointData));
    } else {
      // simplify
      if (_pointData.length > 0) g_minStep_14_0 = g_currentStep14;

      var pointDataXY = _pointData.map(function (p) {
        return {
          x: p[0],
          y: p[1]
        };
      });

      var pointData = [];
      var l = 1000;
      var t = 1;

      while (l > 200) {
        t += 2;
        pointData = simplify(pointDataXY, t);
        l = pointData.length;
        console.log("simplify", t, g_pointData14.length, l);
      }

      for (var i = 0; i < pointData.length; i++) {
        var xx = (pointData[i].x / g_gridData.width - 1) * 2 / 3;
        var yy = pointData[i].y / g_gridData.height - 1 / 2;
        initVertices.push(new Point3D(xx, yy, 0));
      }

      window.localStorage.setItem([CONFIG.CONTENT_KEY, 14, 0].join("_"), JSON.stringify(_pointData));
    }
  } else {
    var initVertices = [];

    var _pointData = g_pointData15.filter(function (p) {
      return p[2] <= g_currentStep15;
    }).map(function (p) {
      return [p[0], p[1], 0];
    });

    if (g_hasGrid15) {
      g_minStep_15_1 = g_currentStep15;
      console.log("_pointData", _pointData);

      for (var i = 0; i < _pointData.length; i++) {
        var xx = (_pointData[i][0] / g_gridData.numberX - 1) * 2 / 3;
        var yy = _pointData[i][1] / g_gridData.numberY - 1 / 2;
        initVertices.push(new Point3D(xx, yy, 0));
      }

      console.log("initVertices", initVertices);
      window.localStorage.setItem([CONFIG.CONTENT_KEY, 15, 1].join("_"), JSON.stringify(_pointData));
    } else {
      // simplify
      if (_pointData.length > 0) g_minStep_15_0 = g_currentStep15;

      var pointDataXY = _pointData.map(function (p) {
        return {
          x: p[0],
          y: p[1]
        };
      });

      var pointData = [];
      var l = 1000;
      var t = 1;

      while (l > 200) {
        t += 2;
        pointData = simplify(pointDataXY, t);
        l = pointData.length;
        console.log("simplify", t, g_pointData15.length, l);
      }

      for (var i = 0; i < pointData.length; i++) {
        var xx = (pointData[i].x / g_gridData.width - 1) * 2 / 3;
        var yy = pointData[i].y / g_gridData.height - 1 / 2;
        initVertices.push(new Point3D(xx, yy, 0));
      }

      window.localStorage.setItem([CONFIG.CONTENT_KEY, 15, 0].join("_"), JSON.stringify(_pointData));
    }
  }

  initShape({
    initVertices: initVertices
  });
}

function updateThumbnails(id) {
  console.log("updateThumbnails", id);
  var pointData0 = [];
  var pointData1 = [];
  var origin0 = new Point3D(2378, 1725, 0);
  if (id == 15) origin0 = new Point3D(3090, 1725, 0);
  var grid0 = 0.2691;
  var origin1 = new Point3D(85.3, 62, 0);
  if (id == 15) origin1 = new Point3D(111, 62, 0);
  var grid1 = 7.5;
  var points0 = [];
  var points1 = [];
  var hasGrid = window.localStorage.getItem([CONFIG.CONTENT_KEY, id, "grid"].join("_")) == "true";
  var data0 = window.localStorage.getItem([CONFIG.CONTENT_KEY, id, 0].join("_"));
  var showGrid = false;
  var showFree = false;

  if (data0 && !hasGrid) {
    pointData0 = JSON.parse(data0);
    var points0 = pointData0.map(function (p) {
      return new Point3D(p[0], p[1], 0);
    });
    var d = SVGLib.getFacePath(origin0, points0, grid0, true);
    $("#thumbnail-" + id + "-path").attr("d", d);
    showFree = true;
  }

  var data1 = window.localStorage.getItem([CONFIG.CONTENT_KEY, id, 1].join("_"));

  if (data1 && hasGrid) {
    pointData1 = JSON.parse(data1);
    var points1 = pointData1.map(function (p) {
      return new Point3D(p[0], p[1], 0);
    });
    var d = SVGLib.getFacePath(origin1, points1, grid1, true);
    $("#thumbnail-" + id + "-path").attr("d", d);
    showGrid = true;
  }

  var isShowText = !showGrid && !showFree;
  showElement("#text-no-drawing-" + id, isShowText);
  showElement("#thumbnail-drawing-" + id, !isShowText);
}

$(document).ready(function () {
  initDragEvent(["rect-button-ingore-touch"]);
  keepDraggableSvgNotMove();
  var hasGrid14 = localStorage.getItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_"));
  var hasGrid15 = localStorage.getItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_"));
  if (!hasGrid14) localStorage.setItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_"), true);
  if (!hasGrid15) localStorage.setItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_"), true);
  g_hasGrid14 = localStorage.getItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_")) == "true";
  g_hasGrid15 = localStorage.getItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_")) == "true";
  Draw.init();
  playShape(); // set init state 
  showElement(".cls-toggle", false);
  showElement(".cls_rect", true);
 


  showElement("#btn-rect-inactive", false);
  showElement("#btn-rect-active", true);
  showElement("#btn-tri-inactive", true);
  showElement("#btn-tri-active", false);
  showElement("#shape_dom", false); // btn show list shapes group

  showElement("#btn-show-list-shapes-inactive", true);
  showElement("#btn-show-list-shapes-active", false); // btn show list shapes2 group

  showElement("#btn-show-list-shapes2-inactive", true);
  showElement("#btn-show-list-shapes2-active", false);
  showElement("#btn-show-list-shapes2-group", false); // btn save
  // showElement("#btn-drawing-save-disabled", true);

  showElement("#btn-drawing-save-inactive", true);
  showElement("#btn-drawing-save-active", false); // btn play group

  showElement("#btn-play-inactive", true);
  showElement("#btn-play-active", false);
  showElement("#btn-play-disabled", false); // btn pause group

  showElement("#btn-pause-inactive", false);
  showElement("#btn-pause-active", false);
  showElement("#btn-pause-disabled", false); // btn reload group

  showElement("#btn-reload-inactive", true);
  showElement("#btn-reload-active", false);
  showElement("#btn-reload-disabled", false); // radio 1 group

  showElement("#btn-radio-1-true", false);
  showElement("#btn-radio-1-false", true); // radio 2 group

  showElement("#btn-radio-2-true", false);
  showElement("#btn-radio-2-false", true); // radio 3 group

  showElement("#btn-radio-3-true", false);
  showElement("#btn-radio-3-false", true); // checkbox show3d group

  showElement("#checkbox-show3d-true", false);
  showElement("#checkbox-show3d-false", true); // popup toggle grid

  showElement("#popup-toggle-grid-group", false);
  $("#popup-toggle-grid-group").attr("transform", "translate(-2000 0)");
  showElement("#btn-popup-true-inactive", true);
  showElement("#btn-popup-true-active", false);
  showElement("#btn-popup-false-inactive", true);
  showElement("#btn-popup-false-active", false); // popup delete

  showElement("#popup-delete-group", false);
  $("#popup-delete-group").attr("transform", "translate(-2000 0)");
  showElement("#btn-popup-delete-true-inactive", true);
  showElement("#btn-popup-delete-true-active", false);
  showElement("#btn-popup-delete-false-inactive", true);
  showElement("#btn-popup-delete-false-active", false); // back to draw

  showElement("#btn-back-to-draw-active", false);
  showElement("#btn-back-to-draw-inactive", true);
  setTimeout(function () {
    // show default shape
    var id = CONFIG.DEFAULT_SHAPE_ID || 0;

    if (id >= 1 && id < 14) {
      g_selectedShapeId = id;
      g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;
    } else if (id >= 14 && id <= 15) {
      g_selectedShapeId = id;
      g_hasGrid14 = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_")) == "true";
      g_hasGrid15 = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_")) == "true";
      g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;

      if (id == 14) {
        if (g_hasGrid14) {
          var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 1].join("_"));

          if (data) {
            g_pointData14 = JSON.parse(data);
            g_minStep_14_1 = g_pointData14.length - 1;
            g_currentStep14 = g_pointData14.length - 1;
            g_totalStep14 = g_pointData14.length - 1;
          }

          ;

          if (g_pointData14.length == 0) {
            g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
            updateScreen();
            return;
          }
        } else {
          var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 0].join("_"));
          console.log("localStorage no grid", data);

          if (data) {
            g_pointData14 = JSON.parse(data);
            g_minStep_14_0 = g_pointData14.length - 1;
            g_currentStep14 = g_pointData14.length - 1;
            g_totalStep14 = g_pointData14.length - 1;
            g_finishDrawingNoGrid14 = true;
          } else {
            g_finishDrawingNoGrid14 = false; // return;
          }

          if (g_pointData14.length == 0) {
            g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
            updateScreen();
            return;
          }
        }

        updateGridPoint14();
      } else if (id == 15) {
        if (g_hasGrid15) {
          var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, 1].join("_"));

          if (data) {
            g_pointData15 = JSON.parse(data);
            g_minStep_15_1 = g_pointData15.length - 1;
            g_currentStep15 = g_pointData15.length - 1;
            g_totalStep15 = g_pointData15.length - 1;
          }

          ;

          if (g_pointData15.length == 0) {
            g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
            updateScreen();
            return;
          }
        } else {
          var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, 0].join("_"));
          console.log("localStorage no grid", data);

          if (data) {
            g_pointData15 = JSON.parse(data);
            g_minStep_15_0 = g_pointData15.length - 1;
            g_currentStep15 = g_pointData15.length - 1;
            g_totalStep15 = g_pointData15.length - 1;
            g_finishDrawingNoGrid15 = true;
          } else {
            g_finishDrawingNoGrid15 = false; // return;
          }

          if (g_pointData15.length == 0) {
            g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
            updateScreen();
            return;
          }
        }

        updateGridPoint15();
      }
    }

    updateScreen();
  }, 200);
  renderRadioButtons();
  if (!g_isShowLog) $(".text-log").css("opacity", 0);
  $("#btn-show-list-shapes-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "show-list-shapes";
    e.preventDefault();
    e.stopPropagation(); // animateButtonEffect("#show-list-shapes-group", true);
    // showElement("#btn-show-list-shapes-active", true);
    // showElement("#btn-show-list-shapes-inactive", true);
  });
  $("#btn-show-list-shapes2-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "show-list-shapes2";
    e.preventDefault();
    e.stopPropagation(); // animateButtonEffect("#show-list-shapes2-group", true);
    // showElement("#btn-show-list-shapes2-active", true);
    // showElement("#btn-show-list-shapes2-inactive", true);
  });
  $("#btn-play-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "play-inactive";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-play-group", true);
    showElement("#btn-play-inactive", true);
    showElement("#btn-play-active", true);
  });
  $("#btn-pause-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "pause-inactive";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-pause-group", true);
    showElement("#btn-pause-inactive", false);
    showElement("#btn-pause-active", true);
  }); 

  $("#btn-reload-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "reload";
    g_isPlaying = false;
    animateButtonEffect("#btn-reload-group", true);
    showElement("#btn-reload-inactive", false);
    showElement("#btn-reload-active", true); 
    e.preventDefault();
    e.stopPropagation();
  });
  $("#btn-rect-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "rect-inactive";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-rect-group", true);
    showElement("#btn-rect-inactive",false);
    showElement("#btn-rect-active", true);
  });
  $("#btn-tri-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "tri-inactive";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-tri-group", true);
    showElement("#btn-tri-inactive", false);
    showElement("#btn-tri-active", true);
  }); 
  $("#toggle_rect").on("mousedown touchstart", function (e) {
    g_latestMousePress = "toggle_rect";
    e.preventDefault();
    e.stopPropagation();
    
  }); 
  $("#toggle_tri").on("mousedown touchstart", function (e) {
    g_latestMousePress = "toggle_tri";
    e.preventDefault();
    e.stopPropagation();
    
  }); 
  $("#toggle_draw").on("mousedown touchstart", function (e) {
    g_latestMousePress = "toggle_draw";

    e.preventDefault();
    e.stopPropagation();
    
  }); 
  $(".radio-group").on("mousedown touchstart", function (e) {
    if (!g_isEnableEvent) return;
    disableMouseEvent();
    var id = e.target.id.split("-")[2] - 1;
    console.log("Click id", id); // reset

    for (var i = 0; i < g_radioCheckedStates.length; i++) {
      if (i != id) g_radioCheckedStates[i] = false;
    }

    if (!g_radioCheckedStates[id]) {
      g_radioCheckedStates[id] = true;
      if (g_selectedShapeId == 14) g_stepCount14 = 0;else g_stepCount15 = 0;
    }
    var g_radioCheckedStatesAll=[]
    if(g_selectedShapeId == 1) {
      g_radioCheckedStatesRect = g_radioCheckedStates
      g_radioCheckedStatesAll=g_radioCheckedStatesRect
    }
    else if (g_selectedShapeId==14) {
      g_radioCheckedStatesDraw = g_radioCheckedStates
      g_radioCheckedStatesAll=g_radioCheckedStatesDraw
    }
    else {
      g_radioCheckedStatesTri = g_radioCheckedStates
      g_radioCheckedStatesAll=g_radioCheckedStatesTri
    }


    console.log("radio-1: " ,g_radioCheckedStatesRect,"__radio-1: ",g_radioCheckedStatesTri,"__radio-all: ",g_radioCheckedStatesAll)
    if (g_radioCheckedStatesAll[0]) {
      var dAlpha = g_shape2D.alphaY - Math.floor(g_shape2D.alphaY / 10) * 10;
      g_shape2D.rotateY2(dAlpha);
      g_shape2D.alphaY = Math.floor(g_shape2D.alphaY / 10) * 10;
    } 


    renderRadioButtons();
    e.preventDefault();
    e.stopPropagation();
  });
  $("#checkbox-show3d-group .rect-button-ingore-touch").on("mousedown touchstart", function (e) {
    if (!g_isEnableEvent) return;
    disableMouseEvent();
    g_count++; // g_msgLog = "Click " + g_count;

    updateLog();
    g_checkboxShow3D_1[g_selectedShapeId-1]=!g_checkboxShow3D_1[g_selectedShapeId-1]
    g_checkboxShow3D=g_checkboxShow3D_1[g_selectedShapeId-1]

    // g_selectedShapeId==1 ? g_checkboxShow3D_1[0] = !g_checkboxShow3D_1[0] : g_checkboxShow3D_1[1] = !g_checkboxShow3D_1[1]
    // g_selectedShapeId==1 ? g_checkboxShow3D = g_checkboxShow3D_1[0] : g_checkboxShow3D = g_checkboxShow3D_1[1]
    console.log(g_checkboxShow3D_1,g_checkboxShow3D)
    console.log
    showElement("#checkbox-show3d-true", g_checkboxShow3D);
    showElement("#checkbox-show3d-false", !g_checkboxShow3D);
    updateVisibility3DShape();
    if (g_checkboxShow3D) showCanvas();else hideCanvas();
    e.preventDefault();
    e.stopPropagation();
  }); // DRAWING

  $("#btn-drawing-delete-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "drawing-delete";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-drawing-delete-group", true);
    showElement("#btn-drawing-delete-active", true);
    showElement("#btn-drawing-delete-inactive", false);
  });
  $("#btn-drawing-save-inactive").on("mousedown touchstart", function (e) {
    g_latestMousePress = "drawing-save";
    updateData14=false
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-drawing-save-group", true);
    showElement("#btn-drawing-save-active", true);
    showElement("#btn-drawing-save-inactive", false);
  }); // back

  $("#btn-drawing-back-active rect").on("mousedown touchstart", function (e) {
    if (g_latestMousePress == "drawing-back") return;
    g_pressTime0 = g_pressTime1;
    g_pressTime1 = Date.now();
    g_latestMousePress = "drawing-back";
    g_msgLog += ["@0", g_pressTime1 - g_pressTime0].join("_");
    updateLog();

    if (g_pressTime0 && g_pressTime1 - g_pressTime0 < 200) {
      g_latestMousePress = "";
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-drawing-back-group", true);
  }); // next

  $("#btn-drawing-next-active").on("mousedown touchstart", function (e) {
    if (g_latestMousePress == "drawing-next") return;
    g_pressTime0 = g_pressTime1;
    g_pressTime1 = Date.now();
    g_latestMousePress = "drawing-next";

    if (g_pressTime0 && g_pressTime1 - g_pressTime0 < 200) {
      g_latestMousePress = "";
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-drawing-next-group", true);
  }); // toggle grid

  $("#cbox-grid-group").on("mousedown touchstart", function (e) {
    console.log("cbox-grid-group");
    showElement("#popup-toggle-grid-group", true);
    $("#popup-toggle-grid-group").attr("transform", "translate(0 0)");
    $("#popup-delete-group").attr("transform", "translate(-2000 0)");
    $("#popup-toggle-grid-group").fadeIn();
    e.preventDefault();
    e.stopPropagation();
  }); // popup yes

  $("#btn-popup-true").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-true";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-popup-true", true);
    showElement("#btn-popup-true-active", true);
    showElement("#btn-popup-true-inactive", false);
  }); // popup false

  $("#btn-popup-false").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-false";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-popup-false", true);
    showElement("#btn-popup-false-active", true);
    showElement("#btn-popup-false-inactive", false);
  });
  $("#popup-toggle-grid-background").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-toggle-grid-background";
    e.preventDefault();
    e.stopPropagation();
  }); // popup delete yes

  $("#btn-popup-delete-true").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-delete-true";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-popup-delete-true", true);
    showElement("#btn-popup-delete-true-active", true);
    showElement("#btn-popup-delete-true-inactive", false);
  }); // popup delete false

  $("#btn-popup-delete-false").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-delete-false";
    e.preventDefault();
    e.stopPropagation();
    animateButtonEffect("#btn-popup-delete-false", true);
    showElement("#btn-popup-delete-false-active", true);
    showElement("#btn-popup-delete-false-inactive", false);
  });
  $("#popup-background").on("mousedown touchstart", function (e) {
    g_latestMousePress = "popup-delete-background";
    e.preventDefault();
    e.stopPropagation();
  }); // btn-back-to-draw-group

  $("#btn-back-to-draw-group").on("mousedown touchstart", function (e) {
    g_latestMousePress = "back-to-draw";
    e.preventDefault();
    e.stopPropagation(); // animateButtonEffect("#btn-back-to-draw-group", true);
    // showElement("#btn-back-to-draw-active", true);
    // showElement("#btn-back-to-draw-inactive", false);
  }); // drawing area

  $("#drawing-area").on("mousedown touchstart", function (e) {
    console.log("DRAW GRID", g_hasGrid15, g_selectedShapeId);
    if (!g_hasGrid14 && g_selectedShapeId == 14 || !g_hasGrid15 && g_selectedShapeId == 15) return;
    if (!e.clientX || !e.clientY) return;
    var el = e.target;
    var dim = el.getBBox();
    var x = (e.clientX - gData.left) / gData.zoomRatio - (dim.x + 328) - 8;
    var y = (e.clientY - gData.top) / gData.zoomRatio - (dim.y + 63) - 10;
    console.log("XY", x, y);
    var m = Math.round(x / g_gridData.sizeX);
    var n = Math.round(y / g_gridData.sizeY);
    m = Math.min(g_gridData.numberX, m);

    if (g_selectedShapeId == 14) {
      if (g_currentStep14 < g_totalStep14) {
        g_pointData14 = g_pointData14.slice(0, g_currentStep14 + 1);
        g_currentStep14++;
        g_totalStep14 = g_currentStep14;
      } else {
        g_currentStep14++;
        g_totalStep14++;
      }

      if (g_pointData14.length == 0) {
        g_pointData14.push([m, n, g_currentStep14]);
      } else {
        var lastPoint = g_pointData14[g_pointData14.length - 1];

        if (lastPoint[0] != m || lastPoint[1] != n) {
          g_pointData14.push([m, n, g_currentStep14]);
        }
      }

      g_totalStep14 = g_pointData14.length - 1;
      g_currentStep14 = g_totalStep14;
      updateGridPoint14();
    } else {
      if (g_currentStep15 < g_totalStep15) {
        g_pointData15 = g_pointData15.slice(0, g_currentStep15 + 1);
        g_currentStep15++;
        g_totalStep15 = g_currentStep15;
      } else {
        g_currentStep15++;
        g_totalStep15++;
      }

      if (g_pointData15.length == 0) {
        g_pointData15.push([m, n, g_currentStep15]);
      } else {
        var lastPoint = g_pointData15[g_pointData15.length - 1];

        if (lastPoint[0] != m || lastPoint[1] != n) {
          g_pointData15.push([m, n, g_currentStep15]);
        }
      }

      g_totalStep15 = g_pointData15.length - 1;
      g_currentStep15 = g_totalStep15;
      updateGridPoint15();
    }
  });
  var prevX;
  var prevY;
  $("#drawing-area").draggable({
    start: function start(event, ui) {
      console.log("drag start", g_selectedShapeId, g_finishDrawingNoGrid15);

      if (g_selectedShapeId == 14) {
        if (g_hasGrid14) return;
        if (g_finishDrawingNoGrid14) return;

        if (g_currentStep14 < g_totalStep14) {
          g_pointData14 = g_pointData14.filter(function (p) {
            return p[2] <= g_currentStep14;
          });
          g_currentStep14++;
          g_totalStep14 = g_currentStep14;
        } else {
          g_currentStep14++;
          g_totalStep14++;
        }
      } else {
        if (g_hasGrid15) return;
        if (g_finishDrawingNoGrid15) return;

        if (g_currentStep15 < g_totalStep15) {
          g_pointData15 = g_pointData15.filter(function (p) {
            return p[2] <= g_currentStep15;
          });
          g_currentStep15++;
          g_totalStep15 = g_currentStep15;
        } else {
          g_currentStep15++;
          g_totalStep15++;
        }
      }

      prevX = event.clientX;
      prevY = event.clientY;
      event.stopPropagation();
    },
    drag: function drag(event, ui) {
      if (g_selectedShapeId == 14) {
        if (g_hasGrid14) return;
        if (g_finishDrawingNoGrid14) return;
      } else {
        if (g_hasGrid15) return;
        if (g_finishDrawingNoGrid15) return;
      }

      console.log("drag");
      var x1 = event.clientX;
      var y1 = event.clientY;
      var dx = x1 - prevX;
      var dy = y1 - prevY;
      prevX = x1;
      prevY = y1;
      var el = event.target;
      var dim = el.getBBox();
      var x = (event.clientX - gData.left) / gData.zoomRatio - (dim.x + 328) - 8;
      var y = (event.clientY - gData.top) / gData.zoomRatio - (dim.y + 63) - 10;
      x = Math.min(x, g_gridData.axisXValue);
      x = Math.max(x, g_gridData.minX);
      y = Math.max(y, 0);
      y = Math.min(y, g_gridData.height);
      if (g_gridData.axisXValue - x < 10) x = g_gridData.axisXValue;
      console.log("XY", x, y);

      if (g_selectedShapeId == 14) {
        if (g_pointData14.length == 0) {
          g_pointData14.push([x, y, g_currentStep14]);
        } else {
          var lastPoint = g_pointData14[g_pointData14.length - 1];
          if (lastPoint[0] != x || lastPoint[1] != y) g_pointData14.push([x, y, g_currentStep14]);
        }

        updateGridPoint14();
      } else {
        if (g_pointData15.length == 0) {
          g_pointData15.push([x, y, g_currentStep15]);
        } else {
          var lastPoint = g_pointData15[g_pointData15.length - 1];
          if (lastPoint[0] != x || lastPoint[1] != y) g_pointData15.push([x, y, g_currentStep15]);
        }

        updateGridPoint15();
      }
    },
    stop: function stop(event, ui) {
      if (g_selectedShapeId == 14) {
        if (g_hasGrid14) return;
        if (!g_finishDrawingNoGrid14) showElement("#text-finish-drawing", true);
        g_finishDrawingNoGrid14 = true;
      } else {
        if (g_hasGrid15) return;
        if (!g_finishDrawingNoGrid15) showElement("#text-finish-drawing", true);
        g_finishDrawingNoGrid15 = true;
      }
    }
  });

  function handleMouseUp() {
    g_isMouseDown = false;
    g_isAnimatingButton = false;

    switch (g_latestMousePress) {
      case "show-list-shapes":
        // animateButtonEffect("#show-list-shapes-group", false);
        // showElement("#btn-show-list-shapes-active", false);
        // showElement("#btn-show-list-shapes-inactive", true);
        // alert("A" + g_currentGameStep);
        g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
        removeShape();
        updateScreen();
        hideCanvas();
        removeCanvasShape();
        break;

      case "show-list-shapes2":
        // animateButtonEffect("#show-list-shapes2-group", false);
        // showElement("#btn-show-list-shapes2-active", false);
        // showElement("#btn-show-list-shapes2-inactive", true);
        // alert("B" + g_currentGameStep);
        if (g_currentGameStep == CONST.GAME_STEPS.STEP_3_DRAWING_BOARD) {
          g_currentGameStep = CONST.GAME_STEPS.STEP_1_SHAPE_LIST;
        } else {
          g_selectedShapeId = g_hasGrid14 ? 14 : 15;
          g_currentGameStep = CONST.GAME_STEPS.STEP_3_DRAWING_BOARD;
        }

        removeShape();
        updateScreen();
        updateGridPoint14();
        break;

      case "play-inactive":
        console.log("mouseup A");
        animateButtonEffect("#btn-play-group", false);
        showElement("#btn-play-inactive", false);
        showElement("#btn-play-active", false);
        animateButtonEffect("#btn-pause-group", true);
        showElement("#btn-pause-active", false);
        showElement("#btn-pause-inactive", true);


        g_isPlaying_check[g_selectedShapeId-1]=true
        g_isPlaying=g_isPlaying_check[g_selectedShapeId-1]

        break;
      case "rect-inactive":
          console.log("mouseup rect");
          animateButtonEffect("#btn-rect-group", false);
          showElement("#btn-rect-inactive", false);
          animateButtonEffect("#btn-rect-group", true);
          showElement("#btn-rect-active", true);
          showElement("#btn-tri-inactive", true);
          showElement("#btn-tri-active", false);
          g_selectedShapeId = 1

    
          removeShape()
          updateScreen()
          break;
        case "tri-inactive":
          console.log("mouseup tri");
          animateButtonEffect("#btn-tri-group", false);
          showElement("#btn-tri-inactive", false);
          animateButtonEffect("#btn-tri-group", true);
          showElement("#btn-tri-active", true);
          showElement("#btn-rect-inactive", true);
          showElement("#btn-rect-active", false);
          g_selectedShapeId = 2

          
          removeShape()
          updateScreen()
          break;
      case "pause-inactive":
        console.log("mouseup B");
        animateButtonEffect("#btn-pause-group", false);
        showElement("#btn-pause-inactive", false);
        showElement("#btn-pause-active", false);
        animateButtonEffect("#btn-play-group", true);
        showElement("#btn-play-active", false);
        showElement("#btn-play-inactive", true);


        g_isPlaying_check[g_selectedShapeId-1]=false
        g_isPlaying=g_isPlaying_check[g_selectedShapeId-1]

        if (g_selectedShapeId == 14) g_stepCount14 = 0;else g_stepCount15 = 0;
        break;

        case "toggle_rect":
          console.log("mouseup "+ g_latestMousePress);
          showElement(".cls-toggle", false);
          showElement("#cls-toggle_rect", true);

          g_selectedShapeId = 1
          removeShape()
          updateScreen()
  
          break;
        case "toggle_tri":
            console.log("mouseup "+ g_latestMousePress);
            showElement(".cls-toggle", false);
            showElement("#cls-toggle_tri", true);
  
            g_selectedShapeId = 2
            removeShape()
            updateScreen()
    
            break;
        
      case "reload":
        animateButtonEffect("#btn-reload-group", false);
        showElement("#btn-reload-inactive", false);
        showElement("#btn-reload-active", false);
        showElement("#btn-reload-disabled", true);
        animateButtonEffect("#btn-pause-group", false);
        showElement("#btn-pause-inactive", false);
        showElement("#btn-pause-active", false);
        animateButtonEffect("#btn-play-group", true);
        showElement("#btn-play-active", false);
        showElement("#btn-play-inactive", true); // setTimeout(function(){

        removeShape();
        if (g_selectedShapeId <= 13) initShape();else publishShape(); // }, 200);

        break;
        case "toggle_draw":
          console.log("mouseup "+ g_latestMousePress);
            showElement(".cls-toggle", false);
            showElement("#cls-toggle_draw", true);

    
            break;
      case "drawing-delete":
        // g_pointData14 = [];
        // window.localStorage.setItem(
        //     [CONFIG.CONTENT_KEY, g_hasGrid14 ? 1 : 0].join("_"),
        //     JSON.stringify(g_pointData14)
        // );
        // g_totalStep14 = -1;
        // if (g_hasGrid14) g_minStep_14_1 = -1;
        // else g_minStep_14_0 = -1;
        // g_currentStep14 = -1;
        // updateGridPoint14();
        animateButtonEffect("#btn-drawing-delete-group", false);
        showElement("#btn-drawing-delete-active", false);
        showElement("#btn-drawing-delete-inactive", true);
        $("#popup-toggle-grid-group").attr("transform", "translate(-2000 0)");
        showElement("#popup-delete-group", true);
        $("#popup-delete-group").attr("transform", "translate(0 0)");
        $("#popup-delete-group").fadeIn();
        break;

      case "drawing-save":
        updateData14=true
        console.log("update14",updateData14,"id:",g_selectedShapeId)
        animateButtonEffect("#btn-drawing-save-group", false);
        showElement("#btn-drawing-save-active", false);
        showElement("#btn-drawing-save-inactive", true);
        g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;
        updateScreen();

        break;

      case "drawing-back":
        animateButtonEffect("#btn-drawing-back-group", false);

        if (g_selectedShapeId == 14) {
          var minStep = g_hasGrid14 ? g_minStep_14_1 : g_minStep_14_0;
          g_msgLog += "# - ";
          updateLog();
          if (g_currentStep14 > minStep && !g_hasGrid14) g_currentStep14 -= 1;else if (g_currentStep14 > minStep) g_currentStep14--;
          updateGridPoint14();
        } else {
          var minStep = g_hasGrid15 ? g_minStep_15_1 : g_minStep_15_0;
          g_msgLog += "# - ";
          updateLog();
          if (g_currentStep15 > minStep && !g_hasGrid15) g_currentStep15 -= 1;else if (g_currentStep15 > minStep) g_currentStep15--;
          updateGridPoint15();
        } // showElement("#btn-drawing-back-active", false);
        // showElement("#btn-drawing-back-inactive", true);


        break;

      case "drawing-next":
        if (g_selectedShapeId == 14) {
          if (g_totalStep14 - g_currentStep14 > 5 && !g_hasGrid14) g_currentStep14 += 5;else if (g_currentStep14 < g_totalStep14) g_currentStep14++;
          updateGridPoint14();
        } else {
          if (g_totalStep15 - g_currentStep15 > 5 && !g_hasGrid15) g_currentStep15 += 5;else if (g_currentStep15 < g_totalStep15) g_currentStep15++;
          updateGridPoint15();
        }

        animateButtonEffect("#btn-drawing-next-group", false); // showElement("#btn-drawing-next-active", false);
        // showElement("#btn-drawing-next-inactive", true);

        break;

      case "popup-true":
        animateButtonEffect("#btn-popup-true", false);
        showElement("#btn-popup-true-active", false);
        showElement("#btn-popup-true-inactive", true);
        $("#popup-toggle-grid-group").fadeOut();

        if (g_selectedShapeId == 14) {
          g_hasGrid14 = !g_hasGrid14; // window.localStorage.setItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_"), g_hasGrid14);

          g_finishDrawingNoGrid14 = false;
          g_currentGameStep = CONST.GAME_STEPS.STEP_3_DRAWING_BOARD;

          if (g_hasGrid14) {
            g_minStep_14_1 = -1;
          } else {
            g_minStep_14_0 = -1;
          }

          g_pointData14 = [];
          g_totalStep14 = -1;
          g_currentStep14 = -1;
          updateScreen();
          updateGridPoint14();
        } else {
          g_hasGrid15 = !g_hasGrid15; // window.localStorage.setItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_"), g_hasGrid15);

          g_finishDrawingNoGrid15 = false;
          g_currentGameStep = CONST.GAME_STEPS.STEP_3_DRAWING_BOARD;

          if (g_hasGrid15) {
            g_minStep_15_1 = -1;
          } else {
            g_minStep_15_0 = -1;
          }

          g_pointData15 = [];
          g_totalStep15 = -1;
          g_currentStep15 = -1;
          updateScreen();
          updateGridPoint15();
        }

        break;

      case "popup-false":
        // showElement("#popup-toggle-grid-group", false);
        $("#popup-toggle-grid-group").fadeOut();
        animateButtonEffect("#btn-popup-false", false);
        showElement("#btn-popup-false-active", false);
        showElement("#btn-popup-false-inactive", true);
        break;

      case "popup-toggle-grid-background":
        $("#popup-toggle-grid-group").fadeOut();
        break;

      case "popup-delete-false":
        // showElement("#popup-delete-toggle-grid-group", false);
        $("#popup-delete-group").fadeOut();
        setTimeout(function () {
          $("#popup-delete-group").attr("transform", "translate(-2000 0)");
        }, 200);
        animateButtonEffect("#btn-popup-delete-false", false);
        showElement("#btn-popup-delete-false-active", false);
        showElement("#btn-popup-delete-false-inactive", true);
        break;

      case "popup-delete-background":
        $("#popup-delete-group").fadeOut();
        setTimeout(function () {
          $("#popup-delete-group").attr("transform", "translate(-2000 0)");
        }, 200);
        break;

      case "popup-delete-true":
        animateButtonEffect("#btn-popup-delete-true", false);
        showElement("#btn-popup-delete-true-active", false);
        showElement("#btn-popup-delete-true-inactive", true);
        $("#popup-delete-group").fadeOut();
        setTimeout(function () {
          $("#popup-delete-group").attr("transform", "translate(-2000 0)");
        }, 200); // g_pointData14Step = -1;

        if (g_selectedShapeId == 14) {
          g_pointData14 = [];
          if (!g_hasGrid14) g_finishDrawingNoGrid14 = false;
          showElement("#text-finish-drawing", false);
          g_totalStep14 = -1;
          if (g_hasGrid14) g_minStep_14_1 = -1;else g_minStep_14_0 = -1;
          g_currentStep14 = -1;
          updateGridPoint14();
        } else {
          g_pointData15 = [];
          if (!g_hasGrid15) g_finishDrawingNoGrid15 = false;
          showElement("#text-finish-drawing", false);
          g_totalStep15 = -1;
          if (g_hasGrid15) g_minStep_15_1 = -1;else g_minStep_15_0 = -1;
          g_currentStep15 = -1;
          updateGridPoint15();
        }

        break;

      case "back-to-draw":
        g_checkboxShow3D = false;
        if (g_checkboxShow3D) showCanvas();else hideCanvas();
        g_currentGameStep = CONST.GAME_STEPS.STEP_3_DRAWING_BOARD;
        updateScreen(); // animateButtonEffect("#btn-back-to-draw-group", false);
        // showElement("#btn-back-to-draw-active", false);
        // showElement("#btn-back-to-draw-inactive", true);

        break;
    }

    g_latestMousePress = "";
  }

  $(document).on("mouseup", function (e) {
    handleMouseUp();
  }); // $(window).keypress(function (e) {
  //     if (e.keyCode == 32 || e.key === "Spacebar") {
  //         if (g_isDisableBack)
  //             return;
  //         g_latestMousePress = "drawing-back";
  //         e.preventDefault();
  //         e.stopPropagation();
  //         animateButtonEffect("#btn-drawing-back-group", true);
  //         handleMouseUp();
  //     } else if (e.key === "Enter") {
  //         if (g_isDisableNext)
  //             return;
  //         g_latestMousePress = "drawing-next";
  //         e.preventDefault();
  //         e.stopPropagation();
  //         animateButtonEffect("#btn-drawing-next-group", true);
  //         handleMouseUp();
  //     }
  // });

  Draw.rotateEvent(".draggable-zone");
  setTimeout(function () {
    $("#svg_root").css("opacity", 1);
  }, 300); // @@@ - shape items

  $(".wrapper-shape-item").on("mousedown touchstart", function (e) {
    var id = e.target.id;
    console.log("wrapper-shape-item", id);
    g_selectedShapeId = parseInt(id.split("-")[2]);
    g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;
    updateScreen();
  });
  $(".wrapper-drawing-item,#toggle_draw").on("mousedown touchstart", function (e) {
    g_latestMousePress = "toggle_draw";
    // var id = e.target.id;

    var id ="wrapper-button-1"
    var drawType = parseInt(id.split("-")[2]);
    g_selectedShapeId = 14;
    console.log("wrapper-drawing-item", drawType);
    g_hasGrid14 = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, "grid"].join("_")) == "true";
    g_hasGrid15 = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, "grid"].join("_")) == "true";

    var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 1].join("_")) || window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 0].join("_"));
    if(data) {
      g_currentGameStep = CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL;
    }else {
      g_currentGameStep = CONST.GAME_STEPS.STEP_3_DRAWING_BOARD;
    }
    

    if (g_selectedShapeId == 14) {
      g_pointData14 = [];
      g_currentStep14 = -1;
      g_totalStep14 = -1;

      if (g_hasGrid14) {
        var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 1].join("_"));
        console.log("localStorage  grid", data);
        if (data) {
          g_pointData14 = JSON.parse(data);
          g_minStep_14_1 = g_pointData14.length - 1;
          g_currentStep14 = g_pointData14.length - 1;
          g_totalStep14 = g_pointData14.length - 1;
        }
      } else {
        var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 14, 0].join("_"));
        console.log("localStorage no grid", data);

        if (data) {
          g_pointData14 = JSON.parse(data);
          g_minStep_14_0 = g_pointData14.length - 1;
          g_currentStep14 = g_pointData14.length - 1;
          g_totalStep14 = g_pointData14.length - 1;
          g_finishDrawingNoGrid14 = true;
        } else {
          g_finishDrawingNoGrid14 = false;
        }
      }

      updateScreen();
      updateGridPoint14();
    } 
    else {
      g_pointData15 = [];
      g_currentStep15 = -1;
      g_totalStep15 = -1;

      if (g_hasGrid15) {
        var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, 1].join("_"));

        if (data) {
          g_pointData15 = JSON.parse(data);
          g_minStep_15_1 = g_pointData15.length - 1;
          g_currentStep15 = g_pointData15.length - 1;
          g_totalStep15 = g_pointData15.length - 1;
        }
      } else {
        var data = window.localStorage.getItem([CONFIG.CONTENT_KEY, 15, 0].join("_"));
        console.log("localStorage no grid", data);

        if (data) {
          g_pointData15 = JSON.parse(data);
          g_minStep_15_0 = g_pointData15.length - 1;
          g_currentStep15 = g_pointData15.length - 1;
          g_totalStep15 = g_pointData15.length - 1;
          g_finishDrawingNoGrid15 = true;
        } else {
          g_finishDrawingNoGrid15 = false;
        }
      }

      updateScreen();
      updateGridPoint15();
    }
  });

  function updateScreen() {
    switch (g_currentGameStep) {
      case CONST.GAME_STEPS.STEP_1_SHAPE_LIST:
        showElement(".m-screen", false);
        showElement("#list-shapes", true);
        showElement("#popup-toggle-grid-group", false);
        $("#popup-toggle-grid-group").attr("transform", "translate(-2000 0)");
        showElement("#cbox-grid-group", false);
        updateThumbnails(14);
        updateThumbnails(15);
        $("#list-shapes").attr("transform", "matrix(1, 0, 0, 1, 0, 0)");
        $("#shape-detail").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        $("#drawing-board").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        break;

      case CONST.GAME_STEPS.STEP_2_SHAPE_DETAIL:
        // $("#list-shapes").detach().prependTo($("#shape-detail"));
        // $("#shape-detail").insertAfter($("#flag"));
        // $("#drawing-board").detach().prependTo($("#shape-detail"));
        console.log("g_select",g_selectedShapeId)
        showElement(".m-screen", false);
        showElement("#shape-detail", true);
        showElement("#cbox-grid-group", false);
        $("#list-shapes").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        $("#shape-detail").attr("transform", "matrix(1, 0, 0, 1, 0, 0)");
        $("#drawing-board").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        g_radioCheckedStates = [false, false, false];
        g_radioCheckedStates[CONFIG.ROTATE_TYPE ? CONFIG.ROTATE_TYPE - 1 : 1] = true;
        g_checkboxShow3D = CONFIG.SHOW_3D;
        g_checkboxShow3D=g_checkboxShow3D_1[g_selectedShapeId-1]

        renderRadioButtons();
        
        showElement("#checkbox-show3d-true", g_checkboxShow3D);
        showElement("#checkbox-show3d-false", !g_checkboxShow3D);
        if (g_checkboxShow3D) showCanvas();else hideCanvas(); // reset

        g_interval1Flag = -1;

        if (g_selectedShapeId <= 13) {
          showElement("#btn-show-list-shapes2-inactive", false);
          showElement("#btn-show-list-shapes2-active", false);
          showElement("#btn-back-to-draw-group", false);

          initShape();


        } 
        
        else {
          showElement("#btn-show-list-shapes2-inactive", true);
          showElement("#btn-show-list-shapes2-active", false);
          showElement("#btn-back-to-draw-group", true);
          publishShape(g_selectedShapeId);
        }
        g_isPlaying = g_isPlaying_check[g_selectedShapeId-1]
        
        if(g_isPlaying) {
          showElement("#btn-play-active", false);
          showElement("#btn-play-inactive", false);
   
        showElement("#btn-pause-inactive", true);
        }else {
          showElement("#btn-pause-active", false);
          showElement("#btn-pause-inactive", false);
   
        showElement("#btn-play-inactive", true);
        }
        
    
        break;

      case CONST.GAME_STEPS.STEP_3_DRAWING_BOARD:
        showElement(".m-screen", false);
        showElement("#drawing-board", true);
        showElement("#btn-show-list-shapes2-inactive", true);
        showElement("#btn-show-list-shapes2-active", false);
        $("#list-shapes").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        $("#shape-detail").attr("transform", "matrix(1, 0, 0, 1, -2000, 0)");
        $("#drawing-board").attr("transform", "matrix(1, 0, 0, 1, 0, 0)");

        if (g_selectedShapeId == 14) {
          showElement("#drawing-grid", g_hasGrid14);
          showElement("#cbox-grid-group", true);
          showElement("#cbox-grid-true", g_hasGrid14);
          showElement("#cbox-grid-false", !g_hasGrid14);
          showElement("#btn-next-back", g_hasGrid14);
          if (g_hasGrid14) showElement("#text-finish-drawing", false);else showElement("#text-finish-drawing", g_finishDrawingNoGrid14);
        } else {
          showElement("#drawing-grid", g_hasGrid15);
          showElement("#cbox-grid-group", true);
          showElement("#cbox-grid-true", g_hasGrid15);
          showElement("#cbox-grid-false", !g_hasGrid15);
          showElement("#btn-next-back", g_hasGrid15);
          if (g_hasGrid15) showElement("#text-finish-drawing", false);else showElement("#text-finish-drawing", g_finishDrawingNoGrid15);
        }

        showElement("#btn-drawing-delete-inactive", true);
        showElement("#btn-drawing-delete-active", false);
        showElement("#btn-drawing-back-inactive", true);
        showElement("#btn-drawing-back-active", false);
        showElement("#btn-drawing-next-inactive", true);
        showElement("#btn-drawing-next-active", false);
        showElement("#popup-toggle-grid-group", false);
        $("#popup-toggle-grid-group").attr("transform", "translate(-2000 0)");
        break;
    }
  }
});