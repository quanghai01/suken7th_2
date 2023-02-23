"use strict";

var SVGLib = {
  createTag: function createTag(tag, attrs) {
    var obj = document.createElementNS(CONST.SVG.NAMESPACE, tag);
    $.map(Object.keys(attrs), function (key) {
      $(obj).attr(key, attrs[key]);
    });
    return obj;
  },
  getStrMatrix: function getStrMatrix(a, b, c, d, e, f) {
    return "matrix(" + [a, b, c, d, e, f].join(',') + ")";
  },
  getLinePath: function getLinePath(o, p1, p2, grid) {
    var d = ["M", roundDecimal2((o.x + p1.x) * grid), roundDecimal2((o.y + p1.y) * grid), "L", roundDecimal2((o.x + p2.x) * grid), roundDecimal2((o.y + p2.y) * grid)].join(' ');
    return d;
  },
  drawLine: function drawLine(o, p1, p2, grid, lineStyle, id, strClass) {
    var attrs = Object.assign(lineStyle, {
      d: this.getLinePath(o, p1, p2, grid),
      id: id,
      class: strClass
    });
    var line = this.createTag("path", attrs);
    return line;
  },
  drawLine2: function drawLine2(x1, y1, x2, y2, lineStyle, id, strClass) {
    var attrs = Object.assign(lineStyle, {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      id: id,
      class: strClass
    });
    var line = this.createTag("line", attrs);
    return line;
  },
  getPointPos: function getPointPos(o, p, grid) {
    var cx = roundDecimal2((o.x + p.x) * grid);
    var cy = roundDecimal2((o.y + p.y) * grid);
    return {
      cx: cx,
      cy: cy
    };
  },
  drawPoint: function drawPoint(o, p, grid, pointStyle, id, strClass) {
    var pointPos = this.getPointPos(o, p, grid);
    var attrs = Object.assign(pointStyle, {
      cx: pointPos.cx,
      cy: pointPos.cy,
      id: id,
      class: strClass
    });
    var point = this.createTag("circle", attrs);
    return point;
  },
  drawPoint2: function drawPoint2(cx, cy, pointStyle, id, strClass) {
    var attrs = Object.assign(pointStyle, {
      cx: cx,
      cy: cy,
      id: id,
      class: strClass
    });
    var point = this.createTag("circle", attrs);
    return point;
  },
  getFacePath: function getFacePath(o, faceVertices, grid, isOpen) {
    var d = $.map(faceVertices, function (v, id) {
      return [id == 0 ? "M" : "L", roundDecimal2((o.x + v.x) * grid), roundDecimal2((o.y + v.y) * grid)].join(' ');
    }).join(' ') + (isOpen ? "" : "z");
    return d;
  },
  getFacePath2: function getFacePath2(faceVertices, isOpen) {
    var d = $.map(faceVertices, function (v, id) {
      return [id == 0 ? "M" : "L", roundDecimal2(v.x), roundDecimal2(v.y)].join(' ');
    }).join(' ') + (isOpen ? "" : "z");
    return d;
  },
  getFaceStyle: function getFaceStyle(faceVertices) {
    var fill, opacity;
    var minOpacity = 0.2;
    var middleOpacity = 0.5;
    var maxOpacity = 0.8;
    var u = faceVertices[0].sub(faceVertices[1]);
    var v = faceVertices[0].sub(faceVertices[2]);
    var normVector = u.crossProduct(v);
    var w = new Point3D(0, 0, 1); // 0 to 180

    var alpha = MathLib.angleBetweenVectors(new Point3D(0, 0, 0), normVector, w);

    if (alpha < 90) {
      // [middle, max]
      fill = CONFIG.FACE_COLOR || "#bfe4ff"; //"#67bab2";

      opacity = middleOpacity + (maxOpacity - middleOpacity) * (1 - alpha / 90);
    } else {
      // [min, middle]
      fill = CONFIG.FACE_COLOR || "#bfe4ff";
      opacity = middleOpacity - (alpha / 90 - 1) * (middleOpacity - minOpacity);
    } // opacity = 0.7;


    return {
      fill: fill,
      opacity: roundDecimal2(opacity)
    };
  },
  drawFace: function drawFace(o, faceVertices, grid, faceStyle, id, isOpen) {
    var attrs = Object.assign(faceStyle, {
      d: this.getFacePath(o, faceVertices, grid, isOpen),
      id: id
    });
    var face = this.createTag("path", attrs);
    return face;
  },
  drawFace2: function drawFace2(faceVertices, faceStyle, id, isOpen) {
    var attrs = Object.assign(faceStyle, {
      d: this.getFacePath2(faceVertices, isOpen),
      id: id
    });
    var face = this.createTag("path", attrs);
    return face;
  },
  drawText: function drawText(o, x, y, text, grid, textStyle, id) {
    var attrs = Object.assign(textStyle, {
      x: roundDecimal2((o.x + x) * grid),
      y: roundDecimal2((o.y + y) * grid),
      id: id
    });
    var svgText = this.createTag("text", attrs);
    svgText.textContent = text;
    return svgText;
  },
  updateStyle: function updateStyle(el, styles) {
    $.map(Object.keys(styles), function (key) {
      $(el).attr(key, styles[key]);
    });
  },
  getCurveTextPath: function getCurveTextPath(o, p1, p2, p, grid) {
    var d = ["M", roundDecimal2((o.x + p1.x) * grid), roundDecimal2((o.y + p1.y) * grid), // "C", r, r, 0, 0, 0, roundDecimal2((o.x + p2.x) * grid), roundDecimal2((o.y + p2.y) * grid)
    "Q", roundDecimal2((o.x + p.x) * grid), roundDecimal2((o.y + p.y) * grid), roundDecimal2((o.x + p2.x) * grid), roundDecimal2((o.y + p2.y) * grid)].join(" ");
    return d;
  },
  drawCurveText: function drawCurveText(o, p1, p2, p, grid, arcStyle, id) {
    var attrs = Object.assign(arcStyle, {
      d: this.getCurveTextPath(o, p1, p2, p, grid),
      id: id
    });
    var arc = this.createTag("path", attrs);
    return arc;
  },
  drawRect: function drawRect(o, x, y, w, h, grid, rectStyle, id) {
    var attrs = Object.assign(rectStyle, {
      x: (o.x + x) * grid,
      y: (o.y + y) * grid,
      width: w * grid,
      height: h * grid,
      // rx: rx * grid,
      // ry: ry * grid,
      id: id
    });
    var rect = this.createTag("rect", attrs);
    return rect;
  }
};