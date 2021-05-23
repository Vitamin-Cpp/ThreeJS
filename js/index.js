import * as THREE from './three/build/three.module.js';
import { PointerLockControls } from './three/examples/jsm/controls/PointerLockControls.js';


let camera, scene, renderer, floor, controls;
var playerObject = {
    height       : 2,
    speed        : 1.5,
    turnSpeed    : Math.PI*0.02,
    jumpHeight   : 250
};

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function init() {

    let geometry, material;

    // camera setup
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;

    // scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x87ceeb );

    // add floor with texture
    var groundTexture = new THREE.TextureLoader().load('../textures/floor.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 100, 100 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;
    var groundMaterial = new THREE.MeshStandardMaterial( { map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 2000, 0, 2000 ), groundMaterial );
    mesh.receiveShadow = true;
    scene.add( mesh );



    // add a light
    const light = new THREE.HemisphereLight( 0xffffff, 0xfdfbd3, 1 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    // red dot for aim
    geometry = new THREE.SphereGeometry(0.15, 16, 16);
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    let aimDot = new THREE.Mesh( geometry, material );
    aimDot.position.set(0, playerObject.height, -10);

    
    // setup pointer lock controls
    controls = new PointerLockControls( camera, document.body );
    document.body.addEventListener( 'click', function () {
        //lock mouse on screen, use esc to unlock
        controls.lock();
    }, false );

    // attach aim dot to controls object
    controls.getObject().add(aimDot)
    scene.add( controls.getObject() );


    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // render setup
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    // listeners
    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'keydown', onKeyDown );
    document.addEventListener( 'keyup', onKeyUp );
}

function animate() {
    requestAnimationFrame( animate );

    const time = performance.now();

    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects( objects );

        const onObject = intersections.length > 0;

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

    }

    prevTime = time;
    renderer.render( scene, camera );
}

const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += playerObject.jumpHeight;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

init();
animate();