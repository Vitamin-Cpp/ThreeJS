import * as THREE from './three/build/three.module.js'
import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js'
import {Cube} from './models/building.js'

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );

    let cube = new Cube();
    scene.add( cube );

    camera.position.z = 10;
    controls.update();
}

const animate = function () {
    requestAnimationFrame( animate );

    controls.update();
    renderer.render( scene, camera );
};

init();
animate();