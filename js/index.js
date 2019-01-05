
  // GLOBALS ======================================================

  var camera, scene, renderer, controls, clock, composer, sunMain, light1;
  var backgroundColour = 0xC5DFEB;
  var INV_MAX_FPS = 1 / 100, frameDelta = 0;

  // Tween settings
  let currentValue = { x: 0, y: 150, z: 35 };
  let dawnPosition = { x: -600, y: 0, z: 35 }
  let dayPosition = { x: 0, y: 150, z: 35 }
  let duskPosition = { x: 600, y: 0, z: 35 }
  let nightPosition = { x: -10, y: -50, z: 35 }

  let toDawn = new TWEEN.Tween(currentValue).to(dawnPosition, 1000);
  let toDay = new TWEEN.Tween(currentValue).to(dayPosition, 1000);
  let toDusk = new TWEEN.Tween(currentValue).to(duskPosition, 1000);
  let toNight = new TWEEN.Tween(currentValue).to(nightPosition, 1000);


  let currentColour = { r: 197, g: 223, b: 235 }
  let dawnColour = { r: 255, g: 246, b: 186 }
  let dayColour = { r: 197, g: 223, b: 235 }
  let duskColour = { r: 255, g: 164, b: 139 }
  let nightColour = { r: 0, g: 2, b: 25 }

  let toDawnColor = new TWEEN.Tween(currentColour).to(dawnColour, 1000);
  let toDayColor = new TWEEN.Tween(currentColour).to(dayColour, 1000);
  let toDuskColor = new TWEEN.Tween(currentColour).to(duskColour, 1000);
  let toNightColor = new TWEEN.Tween(currentColour).to(nightColour, 1000);

  let currentLight = { x: 0, y: 50, z: 35 };
  let dawnLight = { x: -100, y: 10, z: 35 }
  let dayLight = { x: 0, y: 50, z: 35 }
  let duskLight = { x: 100, y: 10, z: 35 }
  let nightLight = { x: -10, y: -50, z: 35 }

  let toDawnLight = new TWEEN.Tween(currentLight).to(dawnLight, 1000);
  let toDayLight = new TWEEN.Tween(currentLight).to(dayLight, 1000);
  let toDuskLight = new TWEEN.Tween(currentLight).to(duskLight, 1000);
  let toNightLight = new TWEEN.Tween(currentLight).to(nightLight, 1000);

  // SETUP ========================================================

  function setup() {
// Call initialSetup function to load all the rendering stuff
    initialSetup();

// Call geoSetup to put objects on screen
    geoSetup();

// Loop using callback to animate function
    requestAnimationFrame(function animate() {
      draw();

      frameDelta += clock.getDelta();
      while (frameDelta >= INV_MAX_FPS) {
        update(INV_MAX_FPS);
        frameDelta -= INV_MAX_FPS;
      }

      requestAnimationFrame( animate );
    });
  }

  function initialSetup() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x9db3b5, 0.001);

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.y = 20;
    camera.position.z = 35;

//Configure renderer settings-------------------------------------------------
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.autoClear = false;
    renderer.setClearColor(0xC5DFEB, 1.0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas').appendChild(renderer.domElement);
//----------------------------------------------------------------------------

    clock = new THREE.Clock();
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 100;
    controls.lookSpeed = 0.1;

    // Create the lights
    var ambientLight = new THREE.AmbientLight(0x404040, 4.5);
    scene.add(ambientLight);

    light1 = new THREE.DirectionalLight( 0xffffff, 0.8, 100);
    light1.position.set( 0, 10, 0);
    scene.add(light1);
    light1.castShadow = true;

    // Depending on the position of the sun, certain elements will change in the scene
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', function () {
  if (currentValue.x == 0) {
    toDusk.easing(TWEEN.Easing.Quadratic.InOut)
    toDusk.start();
    toDuskColor.start();
    toDuskLight.start();
  } else if (currentValue.x == 600) {
    toNight.easing(TWEEN.Easing.Quadratic.InOut)
    toNight.start();
    toNightColor.start();
    toNightLight.start();
  } else if (currentValue.x == -10) {
    toDawn.easing(TWEEN.Easing.Quadratic.InOut)
    toDawn.start();
    toDawnColor.start();
    toDawnLight.start();
  } else if (currentValue.x == -600) {
    toDay.easing(TWEEN.Easing.Quadratic.InOut)
    toDay.start();
    toDayColor.start();
    toDayLight.start();
  }
})

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //maintain aspect ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function geoSetup() {


    // // Importing the Maya OBJ object and material into the scene
    var mtlLoader = new THREE.MTLLoader()
    mtlLoader.load('LandScape3.mtl', function (material) {
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(material)
      objLoader.load('LandScape3.obj', function (object) {
        object.traverse(function(node){
          if (node instanceof THREE.Mesh){
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        // object.traverse(function(child){child.castShadow = true;});
        scene.add(object);

      })
    })

    //Create the sun object
      sunMain = new THREE.Object3D();
      var geometryOcto = new THREE.SphereGeometry(5, 10, 10);
      // sunMain.layers.set(OCCLUSION_LAYER)
      scene.add(sunMain);

      //Create the materials
      var octoMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFEA6F,
        shading: THREE.FlatShading,
        // emissive: 0xF66120,

      });

      //Add materials to the mesh
      var sunMesh = new THREE.Mesh(geometryOcto, octoMaterial);
      sunMesh.scale.x = sunMesh.scale.y = sunMesh.scale.z = 1.7;
      sunMain.add(sunMesh);

      // spotLight = new THREE.SpotLight( 0xFFEB73 );
      // spotLight.position.set( -175, 105, -90 );
      //
      // spotLight.castShadow = true;
      //
      // spotLight.shadow.mapSize.width = 1024;
      // spotLight.shadow.mapSize.height = 1024;
      //
      // spotLight.shadow.camera.near = 500;
      // spotLight.shadow.camera.far = 4000;
      // spotLight.shadow.camera.fov = 30;
      //
      // scene.add( spotLight );

  }

  // DRAW =========================================================

  function draw(time) {
    //requestAnimationFrame(draw);
    TWEEN.update(time);
    // Background colour animation
  renderer.setClearColor(new THREE.Color(currentColour.r / 255,currentColour.g / 255,currentColour.b / 255,))


  sunMain.position.x = currentValue.x;
  sunMain.position.y = currentValue.y;
  sunMain.position.z = currentValue.z;

  light1.position.x = currentLight.x;
  light1.position.y = currentLight.y;
  light1.position.z = currentLight.z;

    // Render the scene
    renderer.clear();
    renderer.render(scene, camera);
  }

  // UPDATE =======================================================

  function update(delta) {
    controls.update(delta);
  }

  // RUN ==========================================================

  setup();
