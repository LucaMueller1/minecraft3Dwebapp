import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export var PlayerControls = PlayerControls || {}

PlayerControls.moveForward = false;
PlayerControls.moveBackward = false;
PlayerControls.moveUp = false;
PlayerControls.moveDown = false;
PlayerControls.moveLeft = false;
PlayerControls.moveRight = false;

PlayerControls.Controls = (camera, dom) => {
    const controls = new PointerLockControls(camera, dom);

    const blocker = document.getElementById('blocker');
	const menu = document.getElementById('menu');

    menu.addEventListener('click', function () {
        controls.lock();
    } );

    controls.addEventListener('lock', function () {
        console.log("test");
        menu.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        menu.style.display = '';
    } );

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                PlayerControls.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                PlayerControls.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                PlayerControls.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                PlayerControls.moveRight = true;
                break;
            case 'Space':
                PlayerControls.moveUp = true;
                break;
            case 'ShiftLeft':
                PlayerControls.moveDown = true;
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                PlayerControls.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                PlayerControls.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                PlayerControls.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                PlayerControls.moveRight = false;
                break;
            case 'Space':
                PlayerControls.moveUp = false;
                break;
            case 'ShiftLeft':
                PlayerControls.moveDown = false;
                break;
        }

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);


    return controls;
}

PlayerControls.velocity = new THREE.Vector3();
PlayerControls.direction = new THREE.Vector3();
PlayerControls.prevTime = performance.now();

PlayerControls.update = (controls, raycaster, scene) => {
    const time = performance.now();

    if (controls.isLocked === true ) {

        //raycaster.ray.origin.copy(controls.getObject().position);
        

        //const intersections = raycaster.intersectObjects(scene, true);

        //const onObject = intersections.length > 0;

        const delta = (time - PlayerControls.prevTime) / 1000;

        
        PlayerControls.velocity.x -= PlayerControls.velocity.x * 10.0 * delta;
        PlayerControls.velocity.z -= PlayerControls.velocity.z * 10.0 * delta;
        PlayerControls.velocity.y -= PlayerControls.velocity.y * 10.0 * delta;
        

        PlayerControls.direction.z = Number( PlayerControls.moveForward ) - Number( PlayerControls.moveBackward );
        PlayerControls.direction.x = Number( PlayerControls.moveRight ) - Number( PlayerControls.moveLeft );
        PlayerControls.direction.y = Number( PlayerControls.moveDown ) - Number( PlayerControls.moveUp );
        PlayerControls.direction.normalize(); // this ensures consistent movements in all directions

        if ( PlayerControls.moveForward || PlayerControls.moveBackward ) PlayerControls.velocity.z -= PlayerControls.direction.z * 200.0 * delta;
        if ( PlayerControls.moveLeft || PlayerControls.moveRight ) PlayerControls.velocity.x -= PlayerControls.direction.x * 200.0 * delta;
        if ( PlayerControls.moveUp || PlayerControls.moveDown ) PlayerControls.velocity.y -= PlayerControls.direction.y * 200.0 * delta;

        /*
        if (onObject === true) {
            velocity.y = Math.max( 0, velocity.y );
        }*/

        controls.moveRight( - PlayerControls.velocity.x * delta );
        controls.moveForward( - PlayerControls.velocity.z * delta );
        

        controls.getObject().position.y += ( PlayerControls.velocity.y * delta ); // up down

    }

    PlayerControls.prevTime = time;

}