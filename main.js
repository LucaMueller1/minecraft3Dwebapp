import * as THREE from 'three';
import './style.css';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {THREEx} from './scripts/threex.daynight';

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

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
ambientLight.intensity = 0;
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.intensity = 100;
pointLight.position.set(5,50,5);
//scene.add(ambientLight, pointLight);

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
const lightHelper = new THREE.PointLightHelper(pointLight);

scene.add(gridHelper, lightHelper);

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const spawnLights = (count) => {
  for(let i = 0; i < count; i++) {
    let light = new THREE.PointLight(0xFF9900);
    const lightHelper = new THREE.PointLightHelper(light);
    light.position.set(randomIntFromInterval(-50, 50), 30, randomIntFromInterval(-50, 50));
    light.intensity = 50;
    scene.add(light, lightHelper);
  }
}

spawnLights(10);

//model import
const loader = new GLTFLoader();

var conditions = ["Water", "Redstone", "Torch", "torch", "emit", "crafting"];

loader.load("./models/oneBlock.glb", function (gltf) {

  console.log(gltf.scene.children[0].children);

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
  console.log("------------ END ------------");
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});


loader.load("./models/watzz.glb", function (gltf) {

  gltf.scene.traverse((o)=> {
    console.log(o);
    
    if(o.isMesh && !(conditions.some(el => o.material.name.includes(el)))) {
      if(o.material.name === "") {
        return;
      }
      o.material.depthWrite = true;
      console.log(o.material.name);
    }
  });
  

	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});

//animate loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  controls.update();

  sunAngle += 0.0002/dayDuration * Math.PI*2;
  starField.update(sunAngle);
  skydom.update(sunAngle);
  sunLight.update(sunAngle);
  sunSphere.update(sunAngle);
}
animate();