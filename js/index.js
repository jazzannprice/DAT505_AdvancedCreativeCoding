//Global variables
var renderer, scene, camera, composer, parkScene, sunMain;
var backgroundColour = 0xC5DFEB;
//var gui = null;

// Tween settings
let currentValue = { x: -38, y: 50, z: -200 }
let dawnPosition = { x: -145, y: 10, z: -200 }
let dayPosition = { x: -38, y: 50, z: -200 }
let duskPosition = { x: 77, y: 10, z: -200 }
let nightPosition = { x: -35, y: -50, z: -200 }


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

//Execute the main functions when the page loads
window.onload = function() {
  init();
  geometry();
  animate();
}

function init(){
  //Configure renderer settings-------------------------------------------------
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  renderer.setClearColor(0xC5DFEB, 1.0);

  document.getElementById('canvas').appendChild(renderer.domElement);
  //----------------------------------------------------------------------------

  // Create an empty scene
  scene = new THREE.Scene();

  // Create a basic perspective camera
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 1, 1000 );
  camera.position.z = 74.967;
  camera.position.x = -32.400;
  camera.position.y = 24.800;
  camera.rotation.x = -0.11;


  scene.add(camera);

  // Create the lights
  var ambientLight = new THREE.AmbientLight(0x404040, 4.5);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 1, 100);
  lights[0].position.set( -38, 50, 5);
  lights[1] = new THREE.DirectionalLight(  0xfffff, 0.5, 100);
  lights[1].position.set(0, 10, -1);

  scene.add(lights[0]);
  scene.add( lights[1] );


  //lights[1].castShadow = true;

  // Depending on the position of the sun, certain elements will change in the scene
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', function () {
    if (currentValue.x == -38) {
      toDusk.easing(TWEEN.Easing.Quadratic.InOut)
      toDusk.start();
      toDuskColor.start();
    } else if (currentValue.x == 77) {
      toNight.easing(TWEEN.Easing.Quadratic.InOut)
      toNight.start();
      toNightColor.start();
    } else if (currentValue.x == -35) {
      toDawn.easing(TWEEN.Easing.Quadratic.InOut)
      toDawn.start();
      toDawnColor.start();
    } else if (currentValue.x == -145) {
      toDay.easing(TWEEN.Easing.Quadratic.InOut)
      toDay.start();
      toDayColor.start();
    }
  })
}


//Keep everything appearing properly on screen when window resizes
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); //maintain aspect ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function geometry(){
  //Create the geometric objects
  parkScene = new THREE.Object3D();

  scene.add(parkScene);
  // Importing the Maya OBJ object and material into the scene
  var mtlLoader = new THREE.MTLLoader()
  mtlLoader.load(
    'LandScape2.mtl',
    function (material) {
      var objLoader = new THREE.OBJLoader()
      objLoader.setMaterials(material)
      objLoader.load(
        'LandScape2.obj',
        function (object) {
          object.castShadow = true;
          //object.traverse(function(child){child.castShadow = true;});
          parkScene.add(object);

        }
      )
    }
  )

  //Create the sun object
  sunMain = new THREE.Object3D();
  var geometryOcto = new THREE.SphereGeometry(5, 10, 10);
  scene.add(sunMain);

  //Create the sun material
  var octoMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFEB73,
    shading: THREE.FlatShading,
    emissive: 0xF66120,

  });

  //Add materials to the mesh
  var sunMesh = new THREE.Mesh(geometryOcto, octoMaterial);
  sunMesh.scale.x = sunMesh.scale.y = sunMesh.scale.z = 1.7;
  sunMain.add(sunMesh);

  // var sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
  //
	// light1 = new THREE.PointLight( 0xFFEB73, 5, 50 );
	// 	light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xFFEB73 } ) ) );
	// 	scene.add( light1 );
  //
  //   light1.position.x = -48.65
  //   light1.position.y = 22.5
  //   light1.position.z = 0
}


//var sun = new function() {

//}();

// GUI
// var gui = new dat.GUI();
//     var f1 = gui.addFolder('Time Of Day');
// f1.add(sun, ["Dawn", "Day", "Dusk", "Night", "RealTime"]).onChange(setValue);


// Render Loop
function animate(time){
  requestAnimationFrame(animate);
  TWEEN.update(time);


// var colorString = `rgb(${currentColour.r.toFixed(0)}, ${currentColour.b.toFixed(0)}, ${currentColour.g.toFixed(0)})`
// renderer.setClearColor(new THREE.Color(colorString))

// Background colour animation
renderer.setClearColor(new THREE.Color(currentColour.r / 255,currentColour.g / 255,currentColour.b / 255,))

// Sun position animation
sunMain.position.x = currentValue.x;
sunMain.position.y = currentValue.y;
sunMain.position.z = currentValue.z;

  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
}
