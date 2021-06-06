import * as THREE from 'three';
import './style.css';

import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { THREEx } from './scripts/threex.daynight';
import { PlayerPath } from './scripts/playerPath';
import { PlayerControls } from './scripts/playerControls';
import { Vector3 } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);
renderer.render(scene, camera);


//stats
const statsContainer = document.createElement( 'div' );
const stats = new Stats();
statsContainer.appendChild( stats.dom );
document.body.appendChild( statsContainer );

//day/night cycle

var sunAngle = -1/6*Math.PI*2;
var dayDuration	= 300; //seconds

let sunLight = new THREEx.DayNight.SunLight();
scene.add(sunLight.object3d);

let lensflare = new THREEx.DayNight.Lensflare(sunLight.object3d.color);
scene.add(lensflare.object3d);

let skydom = new THREEx.DayNight.Skydom();
scene.add(skydom.object3d);

let starField	= new THREEx.DayNight.StarField();
scene.add(starField.object3d);


let skyLightHelper = new THREE.DirectionalLightHelper(sunLight.object3d);
scene.add(skyLightHelper);
scene.add(new THREE.CameraHelper( sunLight.object3d.shadow.camera));

const noShadowCast = ["Cobblestone.001", "Oak_Planks.001", "Oak_Slab.001", "Stone_Slab.001", "Stone.001", "Grass_Block.001", "Double_Stone_Slab.001", "Terracotta.001", "Colored_Terracotta.001", "Prismarine.001", "Double_Oak_Slab.001", "Block_of_Iron.001", "Hopper.001", "Netherrack.001", "Dirt.001"];


const controls = PlayerControls.Controls(camera, renderer.domElement);

//helpers
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(gridHelper);

let torches = [];
const spawnLights = (object) => {
  if(!object.name.includes("main") && !object.name.includes("Scene")) {
    let torchNumber = object.name.replace( /^\D+/g, '');
    let torchMeshName = object.children[0].name;

    if(torchMeshName.split("_")[1] === "onmain") {
      let light = new THREE.PointLight(0xff802b);
      light.position.set(object.position.x, object.position.y+0.7, object.position.z);
      let helper = new THREE.PointLightHelper(light);
      //light.castShadow = true;
      light.intensity = 100;
      light.distance = 0;
      light.decay = 2;
      torches.push(light);
      scene.add(light, helper);
    } else {
      object.visible = false;
    }
    
  }
}

//model import
const loader = new GLTFLoader();

loader.load("./models/oneBlock.glb", function (gltf) {
  gltf.scene.traverse((o)=> {
    if(o.isMesh) {
      //console.log(o.material.name);
      if(o.material.name.includes("Torch")) {
        o.visible = false;  //remove all default torches from oneBlock model
      }
      if(o.material.name === "Stationary_Lava.001") {
        o.material.emissiveIntensity = 1.5; //make lava emit more light
        return;
      }
      o.material.emissiveIntensity = 0; //make all remaining textures emit no light
      if(!noShadowCast.includes(o.material.name)) {
        o.castShadow = true;
      }
      o.receiveShadow = true;
    }
  });
  //gltf.scene.castShadow = true;
  gltf.scene.receiveShadow = true;
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});

let wMixer;
let wAni;
let watzz;

loader.load("./models/watzz.glb", function (gltf) {

  gltf.scene.traverse((o)=> {
    if(o.isMesh) {
      o.castShadow = true;
      o.material.emissiveIntensity = 0; //stop emitting light from watzz textures
      //o.receiveShadow = true;
    }
  });
  wMixer = new THREE.AnimationMixer( gltf.scene );
  wAni = gltf.animations;
  watzz = gltf.scene;
  wMixer.clipAction( wAni[0] ).play();

  gltf.scene.position.set(-32, 29, 15);
	scene.add( watzz );

  animate(); //start animation loop as soon as watzz is loaded in
}, undefined, function (error) {
	console.error(error);
});


loader.load("./models/torches2.glb", function (gltf) {
  gltf.scene.traverse(spawnLights);
	scene.add(gltf.scene);
}, undefined, function (error) {
	console.error(error);
});

//watzz movement path
let pointsPath = PlayerPath.PointsPath();
let path = PlayerPath.Path(pointsPath);
let arrow = PlayerPath.Arrow();
scene.add(path, arrow);

//get click position

const onClickCanvas = (event) => {
  let pointer = new THREE.Vector2();
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObject( scene, true);

  if(intersects.length > 0) {
    const res = intersects.filter( function ( res ) {
      return res && res.object;
    })[0];

    if (res && res.object) {
      //console.log(res.object);
      console.log(res.point);

      const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
      const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.copy(res.point);
      scene.add(cube);
    }
	}
}

document.addEventListener('click', onClickCanvas );


//animate loop
const animate = () => {
  const delta = clock.getDelta();

  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  stats.update();

  //controls.update(delta);
  PlayerControls.update(controls, raycaster, scene);

  wMixer.update(delta);

  sunAngle += delta/dayDuration * Math.PI*2;
  starField.update(sunAngle);
  skydom.update(sunAngle);
  sunLight.update(sunAngle);
  lensflare.update(sunAngle);
  PlayerPath.update(pointsPath, watzz);
}
//animate();