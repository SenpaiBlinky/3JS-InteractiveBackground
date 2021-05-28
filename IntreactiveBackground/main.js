// import the style sheet
import './style.css'

// import all of the assets from three.js
import * as THREE from 'three';

// Main Setup - scene, camera, renderer

// scene creation
const scene = new THREE.Scene();
// parameters (field of view, aspect ration, where to see from, where to see till)
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
// how we see things
const renderer = new THREE.WebGLRenderer();

// params (width,height)
renderer.setSize(innerWidth,innerHeight)
// adding the renderer to dom
document.body.appendChild(renderer.domElement)


// ADDING THE PLANE

// params (width, length, height)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// self explanatory
const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// design
const mesh = new THREE.Mesh(boxGeometry,material)
// everything gets added to the scene this way
scene.add(mesh)

// moving camera in order to see the mesh
camera.position.z = 5

//makes sure everything is shown on screen
renderer.render(scene, camera)

