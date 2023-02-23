import THREE, { OrbitControls } from "./three";
import CANNON from "cannon";
import { DiceManager, DiceD6 } from "./threejs-dice/lib/dice";
import $ from "jquery";
// import Stats from "stats.js";

// standard global variables
var container, scene, camera, renderer, controls, stats, world;
window.randomDiceThrow = null;

window.dice = [];
window.DiceManager = DiceManager;

window.svgRootWidth = $("#divBody").width() || window.innerWidth;
window.svgRootHeight = $("#divBody").height() || window.innerHeight;
window.windowRatio = [0.78125, 0.8457];

window.SCREEN_WIDTH = 0;
window.SCREEN_HEIGHT = 0;
window.parcelRequire = null;

// FUNCTIONS
function init(wR, containerId, size, _position, _velocity, _angularVelocity) {
    const position = _position.map((x) => (x * size) / 2);
    const velocity = _velocity.map((x) => (x * size) / 2);
    const angularVelocity = _angularVelocity.map((x) => (x * size) / 2);

    console.log(
        "position",
        position,
        "velocity",
        velocity,
        "angularVelocity",
        angularVelocity
    );
    windowRatio = wR || [0.78125, 0.8457];
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    SCREEN_WIDTH = svgRootWidth * windowRatio[0];
    SCREEN_HEIGHT = svgRootHeight * windowRatio[1];
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.01,
        FAR = 20000;
    // camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    // camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera = new THREE.OrthographicCamera(
        SCREEN_WIDTH / -50,
        SCREEN_WIDTH / 50,
        SCREEN_HEIGHT / 50,
        SCREEN_HEIGHT / -50,
        -500,
        1000
    );
    window.camera = camera;
    scene.add(camera);
    camera.position.set(
        -9.833908731966776,
        27.89181658289697,
        30.419414964088016
    );

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer = new THREE.SVGRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container = document.getElementById(containerId || "ThreeJS");
    container.appendChild(renderer.domElement);
    // EVENTS
    // CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    // STATS
    // stats = new Stats();
    // stats.domElement.style.position = "absolute";
    // stats.domElement.style.bottom = "0px";
    // stats.domElement.style.zIndex = 100;
    // container.appendChild(stats.domElement);

    let ambient = new THREE.AmbientLight("#ffffff", 0.95);
    scene.add(ambient);

    // let directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
    // directionalLight.position.x = 20;
    // directionalLight.position.y = 0;
    // directionalLight.position.z = 1000;

    // // directionalLight.target.x = -60;
    // // directionalLight.target.y = 60;
    // // directionalLight.target.z = 100;
    // scene.add(directionalLight);

    let light = new THREE.SpotLight("white", 0.4);
    light.position.set(-10, 20, 10)
    light.target.position.set(0, 0, -100);
    light.castShadow = true;
    // light.shadow.camera.near = 50;
    // light.shadow.camera.far = 110;
    // light.shadow.mapSize.width = 1024;
    // light.shadow.mapSize.height = 1024;
    scene.add(light);

    // FLOOR
    var floorMaterial = new THREE.MeshPhongMaterial({
        color: "#00aa00",
        // color: "white",
        side: THREE.DoubleSide,
    });

    var planeMaterial = new THREE.MeshLambertMaterial({
        color: "white",
        emissive: "white",
        emissiveIntensity: 0.6,
        side: THREE.FrontSide,
        depthWrite: false,
        transparent: true,
        opacity: 1,
    });

    var floorGeometry = new THREE.PlaneGeometry(30, 30, 10, 10);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = false;
    floor.rotation.x = Math.PI / 2;
    // scene.add(floor);
    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    var skyBoxMaterial = new THREE.MeshPhongMaterial({
        color: 0x9999ff,
        side: THREE.BackSide,
    });
    var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

    ////////////
    // CUSTOM //
    ////////////
    world = new CANNON.World();

    world.gravity.set(0, -9.82 * 30, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 16;

    DiceManager.setWorld(world);

    //Floor
    let floorBody = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Plane(),
        material: DiceManager.floorBodyMaterial,
    });
    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    );
    world.add(floorBody);

    //Walls

    for (let i = 0; i < 2; i++) {
        var die = new DiceD6({
            size: (size || 1.6) * (i ? 1.25 : 1),
            backColor: "white",
        });
        die.getObject().visible = false;
        // die.getObject().body.aabb.lowerBound = new THREE.Vector3(-2,-2,-2)
        // die.getObject().body.aabb.upperBound = new THREE.Vector3(2,2,2)
        scene.add(die.getObject());
        dice.push(die);
    }

    var initQuanternion = dice.map((d) => ({
        vlambda: d.getObject().body.vlambda.clone(),
        wlambda: d.getObject().body.wlambda.clone(),
        quaternion: d.getObject().quaternion.clone(),
    }));

    randomDiceThrow = function (values, cb) {
        dice.forEach((d, idx) => {
            d.getObject().body.velocity.set(d.getObject().body.initVelocity);
            d.getObject().body.angularVelocity.set(
                d.getObject().body.initAngularVelocity
            );
            d.getObject().body.vlambda.set(
                initQuanternion[idx].vlambda.clone()
            );
            d.getObject().body.wlambda.set(
                initQuanternion[idx].wlambda.clone()
            );

            d.getObject().quaternion.set(
                initQuanternion[idx].quaternion._x,
                initQuanternion[idx].quaternion._y,
                initQuanternion[idx].quaternion._z,
                initQuanternion[idx].quaternion._w
            );
        });
        var diceValues = [];

        for (var i = 0; i < dice.length; i++) {
            let yRand = 10; //  Math.random() * 20;
            dice[i].getObject().visible = true;
            dice[i].getObject().position.x = position[0] - i * 10;
            dice[i].getObject().position.y = position[1]; // + Math.floor(i / 3) * 2;
            dice[i].getObject().position.z = position[2]; // + (i % 3) * 2;

            var quaternion = [1, 1];
            // dice[i].getObject().quaternion.x =
            //     ((quaternion[0] * 90 - 45) * Math.PI) / 180;
            // dice[i].getObject().quaternion.z =
            //     ((quaternion[1] * 90 - 45) * Math.PI) / 180;
            dice[i].updateBodyFromMesh();
            let rand = 5; // Math.random() * 5;
            let tRand = 1; // Math.random();
            dice[i]
                .getObject()
                .body.velocity.set(velocity[0], velocity[1], velocity[2]);
            dice[i]
                .getObject()
                .body.angularVelocity.set(
                    angularVelocity[0],
                    angularVelocity[1],
                    angularVelocity[2]
                );

            diceValues.push({ dice: dice[i], value: values[i] || 1 });
        }

        DiceManager.prepareValues(diceValues);
        setTimeout(() => {
            var itv = setInterval(() => {
                if (!dice.find((d) => !d.isFinished())) {
                    clearInterval(itv);
                    if (cb) cb();

                    // dice.forEach((d) => {
                    // 	d.getObject().visible = false;
                    // });
                }
            }, 50);
        }, 900);
        console.log(
            "DiceManager",
            JSON.stringify(
                diceValues.map((x) => x.value),
                null
            )
        );
    };

    // setInterval(() => {
    // 	randomDiceThrow([
    // 		Math.floor(Math.random() * 6) + 1,
    // 		Math.floor(Math.random() * 6) + 1
    // 	]);
    // }, 1000);

    if (document.querySelector("#ThreeJS"))
        document
            .querySelector("#ThreeJS")
            .addEventListener("click", function () {
                randomDiceThrow([
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1,
                ]);
            });
    // setInterval(randomDiceThrow, 3000);
    // randomDiceThrow();

    requestAnimationFrame(animate);

    window.addEventListener("resize", dice3DOnWindowResize, false);

    dice3DOnWindowResize()
}

/* 
1 -> 3
2 -> 4
3 -> 5
4 -> 6
5 -> 1
6 -> 2
*/

window.dice3DOnWindowResize = function () {
    var count = 1;
    var itv = setInterval(() => {
        count += 1;
        if (count > 5) {
            clearInterval(itv);
            return;
        }
        fn()
    }, 50);

    var fn = () => {
        svgRootWidth = $("#divBody").width() || window.innerWidth;
        svgRootHeight = $("#divBody").height() || window.innerHeight;

        SCREEN_WIDTH = windowRatio[0] * svgRootWidth;
        SCREEN_HEIGHT = windowRatio[1] * svgRootHeight;

        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }

};

function animate() {
    updatePhysics();
    render();
    update();

    requestAnimationFrame(animate);
}

function updatePhysics() {
    world.step(1.0 / 60.0);

    for (let i = 0; i < dice.length; i++) {
        dice[i].updateMeshFromBody();
    }
}

function update() {
    controls.update();
    // stats.update();
}

function render() {
    renderer.render(scene, camera);
}

window.initDice = init;
