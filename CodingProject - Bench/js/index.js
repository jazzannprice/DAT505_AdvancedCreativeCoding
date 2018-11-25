//Global variables
var renderer, scene, camera, composer, parkScene, sunMain;
var gui = null;

let currentValue = { x: -38, y: 50, z: -200 };
let dawnPosition = { x: -145, y: 10, z: -200 }
let dayPosition = { x: -38, y: 50, z: -200 }
let duskPosition = { x: 77, y: 10, z: -200 }
let nightPosition = { x: -35, y: -50, z: -200 }

const toDawn = new TWEEN.Tween(currentValue).to(dawnPosition, 1000);
const toDay = new TWEEN.Tween(currentValue).to(dayPosition, 1000);
const toDusk = new TWEEN.Tween(currentValue).to(duskPosition, 1000);
const toNight = new TWEEN.Tween(currentValue).to(nightPosition, 1000);

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
  var ambientLight = new THREE.AmbientLight(0x404040, 3);
  scene.add(ambientLight);

  var lights = [];
  lights[0] = new THREE.DirectionalLight( 0xffffff, 1, 100);
  lights[0].position.set( 0, 10, 5);
  lights[1] = new THREE.DirectionalLight(  0xfffff, 0.5, 100);
  lights[1].position.set(0, 10, -1);

  scene.add(lights[0]);
  scene.add( lights[1] );
  scene.add( lights[2] );

  lights[1].castShadow = true;

  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('click', function () {
    if (currentValue.x == -38) {
      toDusk.start()
      renderer.setClearColor(0xFFA48B, 1.0);
    } else if (currentValue.x == 77) {
      toNight.start();
      renderer.setClearColor(0x000219, 1.0);
    } else if (currentValue.x == -35) {
      toDawn.start();
      renderer.setClearColor(0xFFF6BA, 1.0);
    } else if (currentValue.x == -145) {
      toDay.start();
      renderer.setClearColor(0xC5DFEB, 1.0);
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
  sunMain = new THREE.Object3D();
  var geometryOcto = new THREE.IcosahedronGeometry(7, 1);
  scene.add(sunMain);

  //Create the materials
  var octoMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFDD,
    shading: THREE.FlatShading
  });

  //Add materials to the mesh - sunMesh, skeletonMesh
  var sunMesh = new THREE.Mesh(geometryOcto, octoMaterial);
  sunMesh.scale.x = sunMesh.scale.y = sunMesh.scale.z = 1.7;
  sunMain.add(sunMesh);
}


//var sun = new function() {

//}();

var gui = new dat.GUI();
    var f1 = gui.addFolder('Time Of Day');
f1.add(sun, ["Dawn", "Day", "Dusk", "Night", "RealTime"]).onChange(setValue);


// Render Loop
function animate(time){
  requestAnimationFrame(animate);
  TWEEN.update(time);



sunMain.position.x = currentValue.x;
sunMain.position.y = currentValue.y;
sunMain.position.z = currentValue.z;



  // Render the scene
  renderer.clear();
  renderer.render(scene, camera);
}
