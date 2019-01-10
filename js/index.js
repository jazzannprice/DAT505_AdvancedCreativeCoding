// DAT505 - Jasmine Price - Three.js

// Global variables
var camera, scene, renderer, controls, clock, sunMain, spotLight, lightMain, moonMain;
var INV_MAX_FPS = 1 / 100, frameDelta = 0;

// Tween settings that are used to animate visuals in the project
// The fixed positions of the sun depending on the time of day
let currentValue = { x: 0, y: 220, z: 35 };
let dawnPosition = { x: -600, y: 0, z: 35 };
let dayPosition = { x: 0, y: 220, z: 35 };
let duskPosition = { x: 600, y: 0, z: 35 };
let nightPosition = { x: -10, y: -50, z: 35 };

// The tween that allows the current suns value to be mapped to the desired time of day position
let toDawn = new TWEEN.Tween(currentValue).to(dawnPosition, 1000);
let toDay = new TWEEN.Tween(currentValue).to(dayPosition, 1000);
let toDusk = new TWEEN.Tween(currentValue).to(duskPosition, 1000);
let toNight = new TWEEN.Tween(currentValue).to(nightPosition, 1000);

// The fixed colours of the sky depending on the time of day
let currentColour = { r: 197, g: 223, b: 235 };
let dawnColour = { r: 255, g: 201, b: 126 };
let dayColour = { r: 197, g: 223, b: 235 };
let duskColour = { r: 255, g: 164, b: 139 };
let nightColour = { r: 0, g: 2, b: 25 };

// The tween that allows the current sky colour value to be mapped to the desired time of day colour
let toDawnColor = new TWEEN.Tween(currentColour).to(dawnColour, 1000);
let toDayColor = new TWEEN.Tween(currentColour).to(dayColour, 1000);
let toDuskColor = new TWEEN.Tween(currentColour).to(duskColour, 1000);
let toNightColor = new TWEEN.Tween(currentColour).to(nightColour, 1000);

// The fixed lights for the sun depending on the time of day
let currentLight = { x: 0, y: 220, z: 35 };
let dawnLight = { x: -600, y: 0, z: 35 };
let dayLight = { x: 0, y: 220, z: 35 };
let duskLight = { x: 600, y: 0, z: 35 };
let nightLight = { x: -10, y: -50, z: 35 };

// The tween that allows the current lights value to be mapped to the desired time of day position
let toDawnLight = new TWEEN.Tween(currentLight).to(dawnLight, 1000);
let toDayLight = new TWEEN.Tween(currentLight).to(dayLight, 1000);
let toDuskLight = new TWEEN.Tween(currentLight).to(duskLight, 1000);
let toNightLight = new TWEEN.Tween(currentLight).to(nightLight, 1000);

// The fixed position of the moon depending on the time of day
let currentMoonValue = { x: -100, y: -50, z: -350 };
let moonNight = { x: -100, y: 220, z: -350 };
let moonDay = { x: -100, y: -50, z: -350 };

// The tween that allows the current moons value to be mapped to the desired time of day position
let toMoonDay= new TWEEN.Tween(currentMoonValue).to(moonDay, 1000);
let toMoonNight = new TWEEN.Tween(currentMoonValue).to(moonNight, 1000);


// The Setup-------------------------------------------------
function setup() {
  // Call initialSetup function to load all the rendering and initial window settings
  initialSetup();
  // Call geoSetup to put objects/geometry on screen
  geoSetup();
  // Call clickSetup to load the time of day click function
  clickSetup();
  // Loop using callback to animate function and update screen (camera) position
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

// initialSetup function, responsible for rendering and the initial window, camera, controls and light settings
function initialSetup() {
  scene = new THREE.Scene(); // Create new scene
  scene.fog = new THREE.FogExp2(0x9db3b5, 0.003); // Create subtle fog effect in scene

  // Configure camera settings---------------------------------------------------
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.y = 15;
  camera.position.z = 15;
  //----------------------------------------------------------------------------

  // Configure renderer settings------------------------------------------------
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // WebGLRenderer with antialias
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1); // Pixel ratio
  renderer.setSize( window.innerWidth, window.innerHeight ); // Window size
  renderer.autoClear = false; // autoclear is false (does not clear depth buffer)
  renderer.setClearColor(0xC5DFEB, 1.0); // Background colour
  renderer.shadowMap.enabled = true; // Allowing shadow map to be used so shadows appear
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Shadow type
  document.getElementById('canvas').appendChild(renderer.domElement);
  //----------------------------------------------------------------------------

  // Create clock and Configure first person controls
  clock = new THREE.Clock();
  controls = new THREE.FirstPersonControls(camera);
  controls.movementSpeed = 100;
  controls.lookSpeed = 0.1;

  // Create the lights
  // Ambient light for lighting up the scene
  var ambientLight = new THREE.AmbientLight(0x404040, 4.5);
  scene.add(ambientLight);

  // Directional light to act as the sun
  lightMain = new THREE.DirectionalLight( 0xffffff, 0.5, 100);
  lightMain.position.set( 0, 10, 0);
  scene.add(lightMain);
  lightMain.castShadow = true;
}

// Function that allows the window to constantly resize depending on the size of the screen
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Maintain aspect ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Funcation that creates the objects/geometry in the scene
function geoSetup() {
  // Importing the Maya OBJ object and material into the scene
  var mtlLoader = new THREE.MTLLoader()
  mtlLoader.load('LandScape3.mtl', function (material) {
    var objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(material)
    objLoader.load('LandScape3.obj', function (object) {
      object.traverse(function(node){
        if (node instanceof THREE.Mesh){
          node.castShadow = true;
          node.receiveShadow = true; // Allows the object to cast shadows
        }
      });
      scene.add(object);
    })
  })

  // Creates the sun object
  sunMain = new THREE.Object3D();
  var geometrySun = new THREE.SphereGeometry(12, 20, 20);
  scene.add(sunMain);
  // Creates the suns material and glow effect using the fragment shader
  var sunMaterial = new THREE.ShaderMaterial({
    uniforms: { },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  // Add materials to the mesh
  var sunMesh = new THREE.Mesh(geometrySun, sunMaterial);
  sunMesh.scale.x = sunMesh.scale.y = sunMesh.scale.z = 1.7;
  sunMain.add(sunMesh);

  // Creates the moon object
  moonMain = new THREE.Object3D();
  var geometryMoon = new THREE.SphereGeometry(12, 10, 10);
  scene.add(moonMain);
  // Creates the moons material
  var moonMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });
  // Add materials to the mesh
  var moonMesh = new THREE.Mesh(geometryMoon, moonMaterial);
  moonMesh.scale.x = moonMesh.scale.y = moonMesh.scale.z = 1.7;
  moonMain.add(moonMesh);

  // Creates cone geometry to act as the lighthouse spotlight
  var geometry = new THREE.ConeGeometry( 40, 600, 40 );
  // Creates the spotlight material using the fragment shader for a glowing light effect
  var material = new THREE.ShaderMaterial({
    uniforms: { },
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  // Add materials to the mesh and positions the spotlight
  spotLight = new THREE.Mesh( geometry, material );
   spotLight.position.x = -165;
   spotLight.position.y = -500;
   spotLight.position.z = -50;
   spotLight.rotation.x += 200;
   spotLight.rotation.z += 50;
   // Moves the anchor point of the shape to the top pointed part of the cone (to act as a new pivot to animate the light from)
  geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, -300, 0) );
  scene.add( spotLight );

  // Creates new object for the particles
  particle = new THREE.Object3D();
  // Creates geometry for the particles
  var geometryParticle = new THREE.IcosahedronGeometry(0, 0);
  // Creates material for the particles
  var materialParticle = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
  });
  // For loop that will create 50 different stars in random positions and rotations in the X,Y and Z axis, and adding it to the mesh
  for (var i = 0; i < 50; i++) {
    var meshParticle = new THREE.Mesh(geometryParticle, materialParticle);
    meshParticle.position.set(Math.random() - 0.5, Math.random() + 0.1, Math.random() - 0.5).normalize();
    meshParticle.position.multiplyScalar(90 + (Math.random() * 1000));
    meshParticle.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(meshParticle);
  }
}

// Function that contains the click controls
function clickSetup(){
  // Depending on the position of the sun, certain elements will change in the scene when the user clicks on the screen
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', function () { // Event listener that uses a click
    if (currentValue.x == 0) { // If the current value of x == 0 (daytime), when the user clicks the dusk values will begin
      toDusk.easing(TWEEN.Easing.Quadratic.InOut) // Tween movement animation eases in and out
      toDusk.start();
      toDuskColor.start();
      toDuskLight.start();
    } else if (currentValue.x == 600) { // If the current value of x == 600 (dusk), when the user clicks the night values will begin, including adding the stars (particles) and the lighthouse spotlight
      toNight.easing(TWEEN.Easing.Quadratic.InOut) // Tween movement animation eases in and out
      toNight.start();
      toNightColor.start();
      toMoonNight.start();
      toNightLight.start();
      spotLight.position.y = 117;
      scene.add(particle);
    } else if (currentValue.x == -10) { // If the current value of x == -10 (night), when the user clicks the dawn values will begin and the stars (particle) and lightouse spotlight will be removed
      toDawn.easing(TWEEN.Easing.Quadratic.InOut) // Tween movement animation eases in and out
      toDawn.start();
      toDawnColor.start();
      toMoonDay.start();
      toDawnLight.start();
      spotLight.position.y = -500;
      scene.remove(particle);
    } else if (currentValue.x == -600) { // If the current value of x == -600 (dawn), when the user clicks the day values will begin
      toDay.easing(TWEEN.Easing.Quadratic.InOut) // Tween movement animation eases in and out
      toDay.start();
      toDayColor.start();
      toDayLight.start();
    }
  })
}

// Draw/Animate
function draw(time) {
  // Tween update
  TWEEN.update(time);

  // The spotlight rotation animation
  spotLight.rotation.y += 0.01;

  // Background colour animation
  renderer.setClearColor(new THREE.Color(currentColour.r / 255,currentColour.g / 255,currentColour.b / 255,))

  // Sun position animation
  sunMain.position.x = currentValue.x;
  sunMain.position.y = currentValue.y;
  sunMain.position.z = currentValue.z;

  // Light position animation
  lightMain.position.x = currentLight.x;
  lightMain.position.y = currentLight.y;
  lightMain.position.z = currentLight.z;

  // Moon position animation
  moonMain.position.x = currentMoonValue.x;
  moonMain.position.y = currentMoonValue.y;
  moonMain.position.z = currentMoonValue.z;

  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
}

// Function to update the controls
function update(delta) {
  controls.update(delta);
}

// Run the setup
setup();
