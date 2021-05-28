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

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

/*
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
ambientLight.intensity = 10;
scene.add(ambientLight);*/

//day/night cycle

var sunAngle = -1/6*Math.PI*2;
var dayDuration	= 10;

let sunSphere	= new THREEx.DayNight.SunSphere();
scene.add(sunSphere.object3d);

let sunLight = new THREEx.DayNight.SunLight()
scene.add(sunLight.object3d);

let skydom = new THREEx.DayNight.Skydom()
scene.add(skydom.object3d);

let starField	= new THREEx.DayNight.StarField()
scene.add(starField.object3d);



//helpers
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(gridHelper);

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

let torches = [];
const spawnLights = (object) => {
  if(!object.name.includes("main") && !object.name.includes("Scene")) {
    let torchNumber = object.name.replace( /^\D+/g, '');
    if(torchNumber % 4 == 0) {
      console.log(object);
      let light = new THREE.PointLight(0xff5900);
      light.position.set(object.position.x, object.position.y+1, object.position.z);
      let helper = new THREE.PointLightHelper(light);
      light.intensity = 30;
      light.distance = 6;
      light.decay = 1.4;
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

  //gltf.scene.traverse(spawnLights);

  /*
  gltf.scene.traverse((o)=> {
    //console.log(o);
    
    if(o.isMesh && !(conditions.some(el => o.material.name.includes(el)))) {
      if(o.material.name === "") {
        return;
      }
      o.material.depthWrite = true;
      console.log(o.material.name);
    }
  });
  */
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});


loader.load("./models/watzz.glb", function (gltf) {
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});

loader.load("./models/torches.glb", function (gltf) {
  gltf.scene.visible = false;
  gltf.scene.traverse(spawnLights);
	scene.add( gltf.scene );
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