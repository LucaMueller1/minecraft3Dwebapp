import * as THREE from 'three';
import './style.css';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
ambientLight.intensity = 2;
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,10,5);
scene.add(ambientLight, pointLight);

//helpers
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(200, 50);
const lightHelper = new THREE.PointLightHelper(pointLight);

scene.add(gridHelper, lightHelper);

//model import
const loader = new GLTFLoader();

loader.load("./models/portion2.glb", function (gltf) {
	scene.add( gltf.scene );
}, undefined, function (error) {
	console.error(error);
});

//animate loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  controls.update();
}
animate();