// ANCHOR import the style sheet
import './style.css'

// import all of the assets from three.js
import * as THREE from 'three';

// ANCHOR ------------- Main Setup - scene, camera, renderer ----------------------

// scene creation
const scene = new THREE.Scene();
// parameters (field of view, aspect ration, where to see from, where to see till)
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
// how we see things
const renderer = new THREE.WebGLRenderer();

// params (width,height)
renderer.setSize(innerWidth,innerHeight)
// set the pixel ratio for a crispier picture
renderer.setPixelRatio(devicePixelRatio)
// adding the renderer to dom
document.body.appendChild(renderer.domElement)


// // ANCHOR --------------------- ADDING THE BOX -------------------------

// // params (width, length, height)
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// // self explanatory
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// // design
// const mesh = new THREE.Mesh(boxGeometry,material)
// // everything gets added to the scene this way
// scene.add(mesh)


// ANCHOR -------------------------------- ADDING THE PLANE -----------------------------

// width and height
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
// NOTE mesh basic material doesnt require light
// const planeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})
// NOTE this one does
const planeMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, side: THREE.DoubleSide, 
flatShading: THREE.FlatShading})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(planeMesh)

// we got this from the console
const vertArray = planeMesh.geometry.attributes.position.array


// NOTE loop for rigidness

for (let i = 0; i < vertArray.length; i+= 3) {
  var x = vertArray[i]
  var y = vertArray[i + 1]
  var z = vertArray[i + 2]

  vertArray[i + 2] = z + Math.random()

}

// ANCHOR ------------------------------ ADDING LIGHT ------------------------------------

//  color and intensity
const light = new THREE.DirectionalLight(0xffffff, 1)
// position light  x  y  z
light.position.set(0, 0, 1)

scene.add(light)




// TODO THIS NEEDS TO BE ON BOTTOM
// ANCHOR ------------------------------------ ANIMATION ------------------------------
// TODO THIS NEEDS TO BE ON BOTTOM

// moving camera in order to see the mesh
camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
//makes sure everything is shown on screen
renderer.render(scene, camera)

// // testing the rotation
// mesh.rotation.x += 0.01
// mesh.rotation.y += 0.01
}

animate()




         
