function Shape3D(type, origin, grid, id, translateVector, data) {
    this.origin = origin || new Point3D(0, 0, 0);
    this.initGrid = grid || 1;
    this.adjustRatio = 1;
    this.id = id;
    this.type = type;
    this.shapeId = [this.type, this.id].join("_");
    this.translateVector = translateVector || new Point3D(0, 0, 0);
    this.layerCount = 0;
    this.alphaY = 0;

    this.isShowVertexId = false;

    this.shapeData = {
        count: 0,
        data: [],
        vertices: [],
    };

    this.lineStyle = {
        opacity: 0,
    };

    this.textStyle = {
        fontSize: "18px",
        fill: "#0a83a8",
        "text-anchor": "middle",
    };

    this.initAngles = [20, 0.2, 0.1];
    this.beautifyAngles = [0, 0, 0];
    this.minAdjustRatio = 1;

    this.vertices = [];
    this.edges = [];
    this.faces = [];
    this.rings = [];

    var h0 = 3;
    var h = 1.7988;
    var w = 1.2225;

    this.Y1 = new Point3D(0, h0 / 2, 0);
    this.Y2 = new Point3D(0, -h0 / 2, 0);

    var n = 60;
    var n0 = 30;
    var n1 = 30;
    var n3 = 10;
    this.n = n;

    if (this.id == 3) this.n = 60;

    var _w0 = 56.7;
    var _h0 = 78.3;
    if (this.id == 3) {
        n = 60;
        h = (h * 99) / _h0;
    } else if (this.id == 4) {
        w = (w * 50.7) / _w0;
        h = (h * 117.1) / _h0;
    } else if (this.id == 5) {
        w = (w * 51.3) / _w0;
        h = (h * 100.8) / _h0;
    } else if ([6, 7, 8].indexOf(this.id) >= 0) {
        w = (w * 52) / _w0;
        h = (h * 99) / _h0;
    } else if (this.id == 9) {
        w = (w * 67.5) / _w0;
        h = (h * 99) / _h0;
    } else if (this.id == 10) {
        w = (w * 56.7) / _w0;
        h = (h * 94.5) / _h0;
    } else if (this.id == 11) {
        w = (w * 45) / _w0;
        h = (h * 112.5) / _h0;
    } else if (this.id == 12) {
        w = (w * 65.7) / _w0;
        h = (h * 99) / _h0;
    } else if (this.id == 13) {
        w = (w * 56.7) / _w0;
        h = (h * 94.5) / _h0;
    }

    var halfCircularVertices = [];
    var circleVertices = [];
    var vertices11 = [];
    var vertices12_2D = [];
    var vertices12_3D = [];

    for (var i = 0; i <= n0; i++) {
        halfCircularVertices.push(
            new Point3D(
                (h / 2) * Math.cos(Math.PI / 2 + (Math.PI * i) / n0),
                (h / 2) * Math.sin(-Math.PI / 2 + (Math.PI * i) / n0),
                0
            )
        );
    }

    for (var i = 0; i <= n1; i++) {
        var O = new Point3D(-h / 2, 0, 0);
        circleVertices.push(
            O.add(
                new Point3D(
                    (h / 4) * Math.cos(Math.PI + (2 * Math.PI * i) / n0),
                    (h / 4) * Math.sin(-Math.PI + (2 * Math.PI * i) / n0),
                    0
                )
            )
        );
    }

    for (var i = 0; i <= n3; i++) {
        vertices11.push(
            new Point3D(
                w * Math.cos(Math.PI / 2 + (Math.PI * i) / (2 * n3)),
                w * Math.sin(-Math.PI / 2 + (Math.PI * i) / (2 * n3)),
                0
            )
        );
    }

    vertices11.push(new Point3D(0, h / 2, 0));

    if (this.id == 12) {
        // vertices12_3D
        var a = 3;
        var b = 2;
        var c = Math.sqrt(a * a + b * b);
        var h2 = (c / a) * h;
        var s = c / 2 - (b * b) / c;
        var w1 = ((a * b) / (c * c)) * h2;
        var h1 = (s / c) * h2;
        vertices12_3D.push(new Point3D(0, -h2 / 2, 0));
        vertices12_3D.push(new Point3D(-w1, -h1, 0));
        vertices12_3D.push(new Point3D(-w1 * (h2 / (h2 + 2 * h1)), 0, 0));
        vertices12_3D.push(new Point3D(-w1, h1, 0));
        vertices12_3D.push(new Point3D(0, h2 / 2, 0));
        this.initAngleZ = (Math.atan2(b, a) * 180) / Math.PI;

        vertices12_2D.push(new Point3D(0, -h2 / 2, 0));
        vertices12_2D.push(new Point3D(-w1, h1, 0));
        vertices12_2D.push(new Point3D(0, h2 / 2, 0));
        vertices12_2D.push(new Point3D(w1, -h1, 0));
    }

    var verticesData = [
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w, -h / 2, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        halfCircularVertices,
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w, h / 4, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w / 2, -h / 2, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(0, -h / 4, 0),
            new Point3D(-w / 2, -h / 2, 0),
            new Point3D(-w, -h / 2, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(-w / 4, -h / 2, 0),
            new Point3D(-w, -h / 2, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(-w / 4, h / 2, 0),
            new Point3D(-w / 4, -h / 2, 0),
        ],
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w / 2, -h / 2, 0),
            new Point3D(-0.001, -h / 4, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w, -h / 4, 0),
            new Point3D(-w, h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        [
            new Point3D(0, -h / 2, 0),
            new Point3D(-w, -h / 2, 0),
            new Point3D(0, h / 2, 0),
        ],
        vertices11,
        // vertices12,
        vertices12_2D,
        // [
        //     new Point3D(w / 2, -h / 2, 0),
        //     new Point3D(-w / 2, -h / 2, 0),
        //     new Point3D(-w / 2, h / 2, 0),
        //     new Point3D(w / 2, h / 2, 0),
        // ],
        // 13
        circleVertices,
    ];

    if (type == CONST.SHAPE_TYPES.SHAPE_2D) {
        console.log("AAAA", this.id, data);
        var vertices = [];

        var initVertices =
            this.id <= 13
                ? verticesData[this.id - 1]
                : data.initVertices.map((v) => v.multiple(h0));

        var l = initVertices.length;
        this.sliceCount = l;

        var sinArr = [];
        var cosArr = [];

        for (var i = 0; i < 72; i++) {
            sinArr.push(Math.sin(Math.PI/2 + (i * Math.PI * 2) / n));
            cosArr.push(Math.cos(Math.PI/2 + (i * Math.PI * 2) / n));
        }

        for (var i=0; i < 72; i++)
            for (var j=0; j<l; j++) {
                var p = initVertices[j];
                vertices.push(new Point3D(p.x * sinArr[i], p.y, p.x * cosArr[i]))
            }

        this.vertices = vertices;
    } else if (
        type == CONST.SHAPE_TYPES.SHAPE_3D &&
        (this.id == 7 || this.id == 13)
    ) {
        var initVertices = verticesData[this.id - 1];

        var l = initVertices.length;

        var sinArr = [];
        var cosArr = [];

        for (var i = 0; i < n; i++) {
            sinArr.push(Math.sin((i * Math.PI * 2) / n));
            cosArr.push(Math.cos((i * Math.PI * 2) / n));
        }

        for (var i = 0; i < l; i++) {
            var ring = [];
            for (var j = 0; j < n; j++) {
                var p = initVertices[i];
                ring.push(this.vertices.length);
                this.vertices.push(
                    new Point3D(p.x * sinArr[j], p.y, p.x * cosArr[j])
                );
            }
            this.rings.push(ring);
        }

        // faces
        for (var i = 0; i < l; i++)
            for (var j = 0; j < n; j++) {
                var i1 = j + i * n;
                var i2 = ((j + 1) % n) + i * n;
                var i3 = ((j + 1) % n) + ((i + 1) % l) * n;
                var i4 = j + ((i + 1) % l) * n;

                this.faces.push([i1, i2, i3, i4]);
            }
    } else if (type == CONST.SHAPE_TYPES.SHAPE_3D) {
        var initVertices = verticesData[this.id - 1];

        if (this.id == 12) initVertices = vertices12_3D;

        if (this.id > 13)
            initVertices = data.initVertices.map((v) => v.multiple(h0));

        console.log("initVertices", initVertices);

        var l = initVertices.length;
        var hasTopFace = false;
        var hasBottomFace = false;

        var sinArr = [];
        var cosArr = [];

        for (var i = 0; i < n; i++) {
            sinArr.push(Math.sin((i * Math.PI * 2) / n));
            cosArr.push(Math.cos((i * Math.PI * 2) / n));
        }

        // check top vertices
        // if (initVertices[0].y == initVertices[1].y && false) {
        //     // --> skip init vertices 0
        //     hasTopFace = true;
        //     var p = initVertices[1];
        //     var topVerticesId = [];

        //     var ring = [];

        //     for (var i = 0; i < n; i++) {
        //         ring.push(this.vertices.length);
        //         this.vertices.push(
        //             new Point3D(p.x * sinArr[i], p.y, p.x * cosArr[i])
        //         );
        //         topVerticesId.push(i);
        //     }

        //     this.rings.push(ring);
        //     this.faces.push(topVerticesId);
        // } else if (false) {
        //     hasTopFace = false;
        //     var p = initVertices[1];
        //     var topVerticesId = [];
        //     this.vertices.push(initVertices[0]);

        //     var ring = [];

        //     for (var i = 0; i < n; i++) {
        //         ring.push(this.vertices.length);
        //         this.vertices.push(
        //             new Point3D(p.x * sinArr[i], p.y, p.x * cosArr[i])
        //         );
        //         this.faces.push([0, i + 1, ((i + 1) % n) + 1]);
        //         // topVerticesId.push(i + 1);
        //     }
        //     this.rings.push(ring);
        // }

        console.log("this.faces", this.faces);

        for (var i = 0; i < l; i++) {
            var p = initVertices[i];
            var pCount = this.vertices.length;
            var ring = [];

            // face layer i and i+1
            for (var j = 0; j < n; j++) {
                ring.push(this.vertices.length);

                this.vertices.push(
                    new Point3D(p.x * sinArr[j], p.y, p.x * cosArr[j])
                );

                if (i < l - 1) {
                    this.faces.push([
                        pCount + j + n,
                        pCount + ((j + 1) % n) + n,
                        pCount + ((j + 1) % n),
                        pCount + j,
                    ]);
                }
            }

            this.rings.push(ring);
        }
        // }

        // check bottom vertices
        // if (initVertices[l - 1].y == initVertices[l - 2].y && false) {
        //     hasBottomFace = true;
        //     var p = initVertices[l - 2];
        //     var bottomVerticesId = [];
        //     var pCount = this.vertices.length - n;

        //     for (var i = 0; i < n; i++) {
        //         // this.vertices.push(new Point3D(p.x * sinArr[i], p.y, p.x * cosArr[i]));
        //         bottomVerticesId.push(pCount + i);
        //     }

        //     this.faces.push(bottomVerticesId);
        // } else if (false) {
        //     hasBottomFace = false;
        //     // var p = initVertices[l - 1];
        //     var bottomVerticesId = [];
        //     var pCount = this.vertices.length;
        //     this.vertices.push(initVertices[l - 1]);

        //     for (var i = 0; i < n; i++) {
        //         // this.vertices.push(new Point3D(p.x * sinArr[i], p.y, p.x * cosArr[i]));
        //         this.faces.push([
        //             pCount,
        //             pCount - n + i,
        //             pCount - n + ((i + 1) % n),
        //         ]);
        //         // bottomVerticesId.push(pCount + i);
        //     }

        //     // this.faces.push(bottomVerticesId);
        // }
    }

    console.log("rings", this.rings);
    this.initVertices = initVertices;

    if (type == CONST.SHAPE_TYPES.SHAPE_3D) {
        drawCanvasShape(this.vertices, this.faces, this.rings, this.id);

        if (g_checkboxShow3D) showCanvas();
        else hideCanvas();

        if (singleShape) {
            singleShape.rotation.set(
                ((g_shape2D.rotateTotalY || 0 - 0) * Math.PI) / 180,
                -(g_shape2D.rotateTotalX || 0 * Math.PI) / 180,
                singleShape.rotation.z || 0
            );
        }
    }

    if (this.id == 12) {
        var P = this.vertices[0];
        var Q = this.vertices[2];
        this.Y2 = MathLib.getPointByRatio(P, Q, -0.18);
        this.Y1 = MathLib.getPointByRatio(Q, P, -0.18);

        // this.rotateY(-2);
        console.log("this.initAngleZ", this.initAngleZ);

        if (type == CONST.SHAPE_TYPES.SHAPE_3D) {
            // this.rotateX(-15);
            this.rotateZ(-this.initAngleZ);
        }
        // else
        //     this.rotateZ(-this.initAngleZ);
    } else {
        this.rotateX(this.initAngles[0]);
        this.rotateY(this.initAngles[1]);
    }
}

Shape3D.prototype.rotateX = function (alpha) {
    this.rotateTotalY = ((this.rotateTotalY || 0) + alpha) % 360;
    MathLib.rotate(this, CONST.AXIS.X, alpha);

    console.log("rotateX", alpha);

    if (this.type == CONST.SHAPE_TYPES.SHAPE_2D && this.Y1.y < this.Y2.y) {
        this.rotateTotalY = ((this.rotateTotalY || 0) - alpha) % 360;
        MathLib.rotate(this, CONST.AXIS.X, -alpha);
    }
};

Shape3D.prototype.rotateY = function (alpha) {
    MathLib.rotate(this, CONST.AXIS.Y, alpha);
};

Shape3D.prototype.rotateY2 = function (alpha) {
    this.rotateTotalX = ((this.rotateTotalX || 0) + alpha) % 360;
    this.alphaY += alpha;
    if (this.alphaY < 0) this.alphaY += 360;
    else if (this.alphaY >= 360) this.alphaY -= 360;

    // var A = this.vertices[0];
    // var B = this.vertices[this.vertices.length - 1];
    // this.Y1 = MathLib.getPointByRatio(A, B, 1.25);
    // this.Y2 = MathLib.getPointByRatio(A, B, -0.25);
    MathLib.rotate2(this, this.Y1, this.Y2, alpha, this.origin);
};

Shape3D.prototype.rotateZ = function (alpha) {
    this.rotateTotalZ = ((this.rotateTotalZ || 0) + alpha) % 360;
    MathLib.rotate(this, CONST.AXIS.Z, alpha);
};

Shape3D.prototype.initDom = function () {
    this.shapeDom = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
        id: ["shape_dom", this.shapeId].join("_"),
    });

    this.layerDom = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
        id: ["layer_dom", this.shapeId].join("_"),
    });

    $(this.layerDom).appendTo($(this.shapeDom));

    this.grid = this.initGrid * this.adjustRatio;

    return this.shapeDom;
};

function indexInArray2(arr, edge) {
    if (!arr || !edge) return -1;

    for (var i = 0; i < arr.length; i++) {
        if (
            (arr[i][0] == edge[0] && arr[i][1] == edge[1]) ||
            (arr[i][0] == edge[1] && arr[i][1] == edge[0])
        ) {
            return i;
        }
    }

    return -1;
}

Shape3D.prototype.getIntersectionLine = function (P, Q, lineArrayList) {
    var ratios = [0, 1];

    for (var i = 0; i < lineArrayList.length; i++) {
        var line = lineArrayList[i];
        var P2 = line[0];
        var Q2 = line[1];

        var dP = Math.min(MathLib.length3D(P, P2), MathLib.length3D(P, Q2));
        var dQ = Math.min(MathLib.length3D(Q, P2), MathLib.length3D(Q, Q2));

        if (Math.min(dP, dQ) > CONST.EPSILON) {
            var output = MathLib.lineIntersectLine(P, Q, P2, Q2);

            if (
                output.intersect &&
                output.ratio > 0 &&
                output.ratio < 1 &&
                output.ratio2 > 0 &&
                output.ratio2 < 1
            )
                ratios.push(output.ratio);
        }
    }

    var ratios = ratios.sort(function (a, b) {
        return a - b;
    });
    var ratios2 = [];

    var i = 0;
    while (i < ratios.length - 1) {
        ratios2.push(ratios[i]);

        var j = i + 1;
        while (ratios[j] - ratios[i] < 0.0001) j++;
        i = j;
    }

    if (1 - ratios2[ratios2.length - 1] < 0.0001)
        ratios2[ratios2.length - 1] = 1;
    else ratios2.push(1);

    return ratios2;
};

Shape3D.prototype.isHiddenPoint = function (p, faceArrayList) {
    var Q = new Point3D(0, 0, -10000);

    for (var i = 0; i < faceArrayList.length; i++) {
        var facePoints = faceArrayList[i];
        var isInsidePolygon = MathLib.pointInsidePolygon(p, facePoints);
        var minZ = 1000;

        for (var k = 0; k < facePoints.length; k++) {
            if (minZ > facePoints[k].z) minZ = facePoints[k].z;
        }

        if (isInsidePolygon && p.z > minZ) {
            var output = MathLib.lineIntersectPlan(Q, p, facePoints);
            if (output.isInsideRay && output.isInsidePolygon) return true;
        }
    }

    return false;
};

Shape3D.prototype.showInitLayer = function() {
    for (var i=1; i<72; i++) {
        var id = [this.shapeId, "face_layer", i].join("_");
        var el = $(`#${id}`);
        $(el).attr("opacity", 0);
    }
}

Shape3D.prototype.updateLayer = function (n, m = 1) {
    for (var i=0; i<72; i++) {
        var opacity = (i % m == 0)? (m*n - i) / (m*n): 0;
        if (opacity < 0)
            opacity = 0;

        var id = [this.shapeId, "face_layer", i].join("_");
        var el = $(`#${id}`);
        $(el).attr("opacity", opacity);
    }

    return;
    // if (this.layerCount > 10)
    //     return;

    var pre = 0;

    for (
        var j = this.layerCount - 1;
        j >= Math.max(this.layerCount - n, 0);
        j--
    ) {
        pre++;
        console.log("render2d", this.layerCount, j);
        var id2 = [this.shapeId, "face_layer", j].join("_");
        $(`#${id2}`).attr("opacity", 1 - (0.7 * pre) / n);
    }

    if (this.layerCount >= n + 1) {
        var id3 = [this.shapeId, "face_layer", this.layerCount - n - 1].join(
            "_"
        );
        $(`#${id3}`).remove();
    }

    this.layerCount++;
};

Shape3D.prototype.updateLayer2 = function (n) {
    return;
    for (
        var j = this.layerCount - 2;
        j >= Math.max(this.layerCount - n, 0);
        j--
    ) {
        var id2 = [this.shapeId, "face_layer", j].join("_");
        $(`#${id2}`).remove();
    }

    // if (this.layerCount >= 4) {
    //     var id3 = [this.shapeId, "face_layer", this.layerCount - 3].join("_");
    //     $("#" + id3).attr("opacity", 0);
    // }
};

Shape3D.prototype.checkEdge = function (p1, p2, faces1, faces2 = []) {
    var M = MathLib.getPointByRatio(p1, p2, 0.5);
    console.log("checkEdge", M, faces1, faces2);
    if (
        MathLib.pointInsidePolygon(M, faces1) ||
        MathLib.pointInsidePolygon(M, faces2)
    )
        return false;

    return true;
};

Shape3D.prototype.render = function () {
    var _vertices = this.vertices.map((v) => {
        return v.add(this.translateVector);
    });

    var strokeColor = this.id <=13? CONFIG.STROKE_COLOR_2D: CONFIG.STROKE_COLOR_2D_DRAW;
    var fillColor = this.id <= 13? CONFIG.FILL_COLOR_2D: CONFIG.FILL_COLOR_2D_DRAW;

    if (this.type == CONST.SHAPE_TYPES.SHAPE_2D) {
        for (var i=0; i<72; i++) {
            var vertices = _vertices.slice(i*this.sliceCount, (i + 1)*this.sliceCount);

            // face layer 0
            var id = [this.shapeId, "face_layer", i].join("_");
            var el = $(`#${id}`);
            var isOpen = !(this.id == 7 || this.id == 12);

            if (el.length > 0) {
                var d = SVGLib.getFacePath(
                    this.origin,
                    vertices,
                    this.grid,
                    isOpen
                );
                $(el).attr("d", d);
                $(el).attr("data-z", MathLib.centerPoint(vertices.slice(0, 3)).z);
            } else {
                var faceStyle = {
                    fill: fillColor,
                    stroke: strokeColor,
                    "stroke-width": "2pt",
                    "stroke-linejoin": "round",
                };

                var svgFace = SVGLib.drawFace(
                    this.origin,
                    vertices,
                    this.grid,
                    faceStyle,
                    id,
                    isOpen
                );
                this.layerDom.append(svgFace);
                var id2 = `#${[this.shapeId, "face_layer", i].join(
                    "_"
                )}`;
                $(id2).attr("opacity", i == 0? 1: 0);
                $(id2).attr("class", "shape_layer");
                $(id2).attr("data-z", MathLib.centerPoint(vertices.slice(0, 3)).z);
            }
        }

        // axis
        var id = [this.shapeId, "y_axis"].join("_");
        var el = $(`#${id}`);

        if (el.length > 0) {
            var d = SVGLib.getLinePath(
                this.origin,
                this.Y1.add(this.translateVector),
                this.Y2.add(this.translateVector),
                this.grid
            );
            $(el).attr("d", d);
        } else {
            var faceStyle = {
                stroke: "#000",
                "stroke-width": "1pt",
            };

            var svgLine = SVGLib.drawLine(
                this.origin,
                this.Y1.add(this.translateVector),
                this.Y2.add(this.translateVector),
                this.grid,
                faceStyle,
                id
            );
            this.shapeDom.append(svgLine);
        }

        // sort layers
        var allLayers = _($(".shape_layer"))
            .map(function (el) {
                return {
                    el: el,
                    z: Number($(el).attr("data-z") || 0),
                };
            })
            .sortBy(function (x) {
                return x.z;
            })
            .value();

        var layerDomId = `#${["layer_dom", this.shapeId].join("_")}`;
        allLayers.forEach(function (x) {
            $(x.el).detach().prependTo($(layerDomId));
        });
    }
};

Shape3D.prototype.drawLabel = function (
    label,
    position,
    x = 0,
    y = 0,
    opacity = 1
) {
    var el = $(["#text_vertex", label, position].join("_"));
    var vertex = this.vertices[position];
    var x0 = (this.origin.x + vertex.x) * this.grid + x;
    var y0 = (this.origin.y + vertex.y) * this.grid + y;
    if (el.length > 0) {
        $(el).attr("x", x0);
        $(el).attr("y", y0);
        $(el).attr("opacity", opacity);
    } else {
        var style = {
            "font-size": "40px",
            "font-family": "A-SOTCenturyStd-Regular",
            fill: "black",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            dy: g_isIEBrower ? "0.22em" : "0em",
            opacity: opacity,
        };
        var svgText = SVGLib.drawText(
            this.origin,
            vertex.x * 1.05,
            vertex.y * 1.05,
            label,
            this.grid,
            style,
            ["text_vertex", label, position].join("_")
        );
        var flagDom = $("#flag");
        flagDom.append(svgText);
    }
};

Shape3D.prototype.drawPoint = function (p, id, fillColor, radius) {
    // draw point
    var el = $(`#${id}`);

    if (el.length > 0) {
        var pointPos = SVGLib.getPointPos(this.origin, p, this.grid);

        $(el).attr("cx", pointPos.cx);
        $(el).attr("cy", pointPos.cy);
        $(el).attr("r", radius);
    } else {
        var pointStyle = {
            r: radius,
            fill: fillColor,
        };

        var strClass = `shape-element-${this.id}`;

        var svgPoint = SVGLib.drawPoint(
            this.origin,
            p,
            this.grid,
            pointStyle,
            id,
            strClass
        );
        this.shapeDom.append(svgPoint);
    }

    $(el).insertAfter($("#visible_point"));
};
