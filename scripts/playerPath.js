import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js'
import {_} from 'lodash'

export var PlayerPath = PlayerPath || {}

PlayerPath.PointsPath = () => {
    const pointsPath = new THREE.CurvePath();

    let vectorArray = [];
    for(let pos of pathCrafting1) {
        vectorArray.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }

    const line = new THREE.CatmullRomCurve3(vectorArray);

    pointsPath.add(line);

    return pointsPath;
}

PlayerPath.Path = (pointsPath) => {
    const material = new THREE.LineBasicMaterial({color: 0x9132a8});
    const points = pointsPath.curves.reduce((p, d)=> [...p, ...d.getPoints(20)], []);
  
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  
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
    
    PlayerPath.fraction +=0.0001;
    if (PlayerPath.fraction > 1) {
        PlayerPath.fraction = 0;
    }
}

PlayerPath.tween = (object, shape, options) => {
    options = _.merge({
        from: 0,
        to: 1,
        duration: 20000,
        speed: 500,
        start: true,
        yoyo: false,
        onStart: null,
        onComplete: () => {},
        onUpdate: () => {},
        smoothness: 100,
        easing: TWEEN.Easing.Linear.None
      }, options);
    
      // array of vectors to determine shape
      /*
      if (shape instanceof THREE.Shape) {
    
      } else if ( shape.constructor === Array ) {
        shape = new THREE.CatmullRomCurve3(shape);
    
      } else {
        throw '2nd argument is not a Shape, nor an array of vertices';
      }*/
      
    
      options.duration = options.duration || shape.getLength();
    
      var tween = new TWEEN.Tween({ distance: options.from })
        .to({ distance: options.to }, options.duration)
        .easing( options.easing )
        .onStart( options.onStart )
        .onComplete( options.onComplete )
        .onUpdate(function() {
          // get the position data half way along the path
          console.log(this._object.distance);
          var pathPosition = shape.getPoint( this._object.distance );
    
          // move to that position
          object.position.set( pathPosition.x, pathPosition.y, pathPosition.z );
    
          object.updateMatrix();
    
          if ( options.onUpdate ) { options.onUpdate( this, shape ); }
        })
        .yoyo( options.yoyo );
    
      if ( options.yoyo ) {
        tween.repeat( Infinity );
      }
    
      if ( options.start ) { tween.start(); }
    
      return tween;
}

PlayerPath.RouteTween = (object, pathData) => {

    let tweens = [];
  
    for(let path of pathData) {
      const options = {
        from: 0,
        to: 1,
        duration: path.duration,
        start: true,
        yoyo: false,
        onStart: null,
        onComplete: () => {},
        onUpdate: () => {},
        smoothness: 100,
        easing: TWEEN.Easing.Linear.None
      };

      let shape = new THREE.CurvePath();

      let vectorArray = [];
      for(let pos of path.path) {
          vectorArray.push(new THREE.Vector3(pos.x, pos.y, pos.z));
      }

      let catmull = new THREE.CatmullRomCurve3(vectorArray);
      shape.add(catmull);

      let tween = new TWEEN.Tween({ distance: options.from })
      .to({ distance: options.to }, options.duration)
      .easing( options.easing )
      .onStart( options.onStart )
      .onComplete( options.onComplete )
      .delay(path.delay)
      .onUpdate(function() {
        // get the position data half way along the path
        //console.log(this._object.distance);
        let pathPosition = shape.getPoint( this._object.distance );
  
        // move to that position
        object.position.copy(pathPosition);

        const up = new THREE.Vector3( 0, 0, 1 );
        const axis = new THREE.Vector3();

        const tangent = shape.getTangent(this._object.distance);
        axis.crossVectors( up, tangent ).normalize();
        
        const radians = Math.acos( up.dot( tangent ) );
        
        object.quaternion.setFromAxisAngle( axis, radians );
    
  
        object.updateMatrix();
  
        if ( options.onUpdate ) { options.onUpdate( this, shape ); }
      }).yoyo( options.yoyo );

      tweens.push(tween);
    }

    if(tweens.length === 0) {
      return;
    } else if(tweens.length === 1) {
      return tweens[0];
    }

    for(let i = 0; i < tweens.length-1; i++) {
      tweens[i].chain(tweens[i+1]);
    }

    let routeTween = tweens[0];
  
    console.log(routeTween);
    return routeTween;
}