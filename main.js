import * as THREE from 'three';
import './style.css';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {THREEx} from './scripts/threex.daynight';
import { Vector3 } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);


const ambientLight = new THREE.AmbientLight(0xFFFFFF);
ambientLight.intensity = 1;

//scene.add();

//day/night cycle

var sunAngle = -1/6*Math.PI*2;
var dayDuration	= 10;

let sunSphere	= new THREEx.DayNight.SunSphere();
scene.add(sunSphere.object3d);

let sunLight = new THREEx.DayNight.SunLight();
scene.add(sunLight.object3d);

let skydom = new THREEx.DayNight.Skydom();
scene.add(skydom.object3d);

let starField	= new THREEx.DayNight.StarField();
scene.add(starField.object3d);

let skyLightHelper = new THREE.DirectionalLightHelper(sunLight.object3d);
scene.add(skyLightHelper);
scene.add(new THREE.CameraHelper( sunLight.object3d.shadow.camera));

const noShadowCast = ["Cobblestone.001", "Oak_Planks.001", "Oak_Slab.001", "Stone_Slab.001", "Stone.001", "Grass_Block.001", "Double_Stone_Slab.001", "Terracotta.001", "Colored_Terracotta.001", "Prismarine.001", "Double_Oak_Slab.001", "Block_of_Iron.001", "Hopper.001", "Netherrack.001"];

//helpers
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(gridHelper);

let torches = [];
const spawnLights = (object) => {
  if(!object.name.includes("main") && !object.name.includes("Scene")) {
    let torchNumber = object.name.replace( /^\D+/g, '');
    let torchMeshName = object.children[0].name;
    //if(torchNumber % 4 == 0) {
    if(torchMeshName.split("_")[1] === "onmain") {
      let light = new THREE.PointLight(0xff802b);
      light.position.set(object.position.x, object.position.y+1, object.position.z);
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
      console.log(o.material.name);
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


loader.load("./models/watzz.glb", function (gltf) {

  gltf.scene.traverse((o)=> {
    if(o.isMesh) {
      o.castShadow = true;
      //o.receiveShadow = true;
    }
  });
  gltf.scene.position.set(-32, 29, 15);
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});

loader.load("./models/torches2.glb", function (gltf) {
  gltf.scene.traverse(spawnLights);
	scene.add(gltf.scene);
}, undefined, function (error) {
	console.error(error);
});

//animate loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  controls.update();

  sunAngle += 0.002/dayDuration * Math.PI*2;
  starField.update(sunAngle);
  skydom.update(sunAngle);
  sunLight.update(sunAngle);
  sunSphere.update(sunAngle);
}
animate();