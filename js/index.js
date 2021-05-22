import * as THREE from './three/build/three.module.js';

let camera, scene, renderer, floor, player;
var keyboard = {};
var playerObject = {
    height       : 2,
    speed        : 1.5,
    turnSpeed    : Math.PI*0.02,
};

const init = function() {
    let geometry, material;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // floor
    geometry = new THREE.BoxGeometry( 50, 0, 50 );
    material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    floor = new THREE.Mesh( geometry, material );
    scene.add( floor );

    // player model
    geometry = new THREE.BoxGeometry(2, 2, 2);
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    player = new THREE.Mesh( geometry, material );

    player.position.set(0, playerObject.height, -10);
    player.add(camera);
    scene.add( player );

    camera.position.set(0, playerObject.height, -5);
	camera.lookAt(new THREE.Vector3(0, playerObject.height, 0));


}

const animate = function () {
    requestAnimationFrame( animate );

    // Keyboard movement inputs
	if(keyboard[87]){ // W key
		let xDisplacement = Math.sin(camera.rotation.y) * playerObject.speed;
		let zDisplacement = -Math.cos(camera.rotation.y) * playerObject.speed;

        // camera.position.x -= xDisplacement
		// camera.position.z -= zDisplacement

        player.position.x -= xDisplacement
		player.position.z -= zDisplacement
	}
	if(keyboard[83]){ // S key
		let xDisplacement = Math.sin(camera.rotation.y) * playerObject.speed;
		let zDisplacement = -Math.cos(camera.rotation.y) * playerObject.speed;

        // camera.position.x += xDisplacement
		// camera.position.z += zDisplacement

        player.position.x += xDisplacement
		player.position.z += zDisplacement
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		let xDisplacement = Math.sin(camera.rotation.y + Math.PI/2) * playerObject.speed;
		let zDisplacement = -Math.cos(camera.rotation.y + Math.PI/2) * playerObject.speed;

        // camera.position.x += xDisplacement
		// camera.position.z += zDisplacement

        player.position.x += xDisplacement
		player.position.z += zDisplacement
	}
	if(keyboard[68]){ // D key
		let xDisplacement = Math.sin(camera.rotation.y - Math.PI/2) * playerObject.speed;
		let zDisplacement = -Math.cos(camera.rotation.y - Math.PI/2) * playerObject.speed;

        // camera.position.x += xDisplacement
		// camera.position.z += zDisplacement

        player.position.x += xDisplacement
		player.position.z += zDisplacement
	}
    renderer.render( scene, camera );
};

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

init();
animate();