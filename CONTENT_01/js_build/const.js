"use strict";

var CONST = {
  SVG: {
    NAMESPACE: "http://www.w3.org/2000/svg",
    TAG: {
      SVG: 'svg',
      GROUP: 'g',
      PATH: 'path'
    }
  },
  AXIS: {
    X: "x",
    Y: "y",
    Z: 'z'
  },
  OPENBOX_TYPES: {
    ADD: "ADD",
    KEEP: "KEEP"
  },
  EPSILON: 0.00001,
  SHAPE_TYPES: {
    SHAPE_2D: "SHAPE_2D",
    SHAPE_3D: "SHAPE_3D"
  },
  CURVE_TEXT_ORIGIN_TYPE: {
    CENTER: "CENTER",
    CIRCUMCIRCLE_CENTER: "CIRCUMCIRCLE_CENTER"
  },
  ACTION_OPEN: 1,
  ACTION_CLOSE: -1,
  BROWSER_TYPE: {
    IE10: 1,
    IE11: 2,
    EDGE: 3,
    OTHERS: 0
  },
  GAME_STEPS: {
    STEP_1_SHAPE_LIST: "STEP_1_SHAPE_LIST",
    STEP_2_SHAPE_DETAIL: "STEP_2_SHAPE_DETAIL",
    STEP_3_DRAWING_BOARD: "STEP_3_DRAWING_BOARD"
  }
};