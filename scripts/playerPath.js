import * as THREE from 'three';
import { pathData } from '../data/watzzPath'

export var PlayerPath = PlayerPath || {}

PlayerPath.PointsPath = () => {
    const pointsPath = new THREE.CurvePath();

    let vectorArray = [];
    for(let pos of pathData) {
        vectorArray.push(new THREE.Vector3(pos[0], pos[1], pos[2]));
    }

    const line = new THREE.CatmullRomCurve3(vectorArray);

    pointsPath.add(line);

    return pointsPath;
}

PlayerPath.Path = (pointsPath) => {
    const material = new THREE.LineBasicMaterial({color: 0x9132a8});
    const points = pointsPath.curves.reduce((p, d)=> [...p, ...d.getPoints(20)], []);
  
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
  
  
    return new THREE.Line( geometry, material );
}


PlayerPath.Arrow = () => {
    const material = new THREE.MeshNormalMaterial();
    const coneGeom = new THREE.ConeGeometry(1, 2, 10);
    coneGeom.translate(0, 2.5, 0);
    
    
    const cone = new THREE.Mesh(coneGeom, material);
    const cylinder = new THREE.CylinderGeometry(0.4, 0.6, 3, 10);
    
    cylinder.merge(cone.geometry, cone.matrix);
    cylinder.scale(0.05, 0.05, 0.05);
    
    return new THREE.Mesh(cylinder, material);
}

PlayerPath.fraction = 0;

PlayerPath.update = (pointsPath, player) => {
    const up = new THREE.Vector3( 0, 0, 1 );
    const axis = new THREE.Vector3();

    const newPosition = pointsPath.getPoint(PlayerPath.fraction);
    const tangent = pointsPath.getTangent(PlayerPath.fraction);
    player.position.copy(newPosition);
    axis.crossVectors( up, tangent ).normalize();
    
    const radians = Math.acos( up.dot( tangent ) );
    
    player.quaternion.setFromAxisAngle( axis, radians );
    
    PlayerPath.fraction +=0.001;
    if (PlayerPath.fraction > 1) {
        PlayerPath.fraction = 0;
    }
}