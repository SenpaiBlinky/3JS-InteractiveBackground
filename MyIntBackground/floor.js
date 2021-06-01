// ANCHOR import the style sheet
import './style.css'

// import gsap for animations
import gsap from "gsap"

// import all of the assets from three.js
import * as THREE from 'three';

import * as dat from "dat.gui"

// NOTE control orbit
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js"



// ANCHOR ------------- Main Setup - scene, camera, renderer ---------------------- 
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

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


// moving camera in order to see the mesh
camera.position.z = 100




// ANCHOR --------------------------------- CAMERA MATH FUNCTION --------------------------------------

const visibleHeightAtZDepth = ( depth, camera ) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180; 

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};

// console.log(visibleHeightAtZDepth(true, camera))
// console.log(visibleWidthAtZDepth(true, camera))



// ANCHOR ------------------------------------------ DAT GUI LOOP --------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// NOTE creating a new slider for dat gui with a name of width and start value of 10
const gui = new dat.GUI()
const world = {
  plane: {
    width: visibleWidthAtZDepth(true, camera), // ^^ note is refering to this line
    height: visibleHeightAtZDepth(true, camera),
    widthSegments: 100,
    heightSegments: 100
  }
}

// NOTE adding the slider's min and max values
gui.add(world.plane, "width", 100,  visibleWidthAtZDepth(true, camera) + 100).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "height", 100, visibleHeightAtZDepth(true, camera) + 100).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "widthSegments", 1, 150).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "heightSegments", 1, 150).onChange(generatePlane)

function generatePlane() {

    // removing old geometry
    planeMesh.geometry.dispose()
    // adding new geometry value
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.heightSegments, world.plane.heightSegments)
  
    
  // we got this from the console
  var vertArray = planeMesh.geometry.attributes.position.array
  
    // NOTE loop for rigidness
  
  for (let i = 0; i < vertArray.length; i+= 3) {
    var x = vertArray[i]
    var y = vertArray[i + 1]
    var z = vertArray[i + 2]
  
    vertArray[i + 2] = z + Math.random()
  
  }

  const colors = []

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0,.19,.4)
  // colors.push(0,.0,.0) // NOTE black
}

planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
}



// ANCHOR --------------------------------- RAYCASTER ------------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// NOTE Raycaster
const raycaster = new THREE.Raycaster()


// // ANCHOR --------------------- ADDING THE BOX -------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// // params (width, length, height)
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// // self explanatory
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// // design
// const mesh = new THREE.Mesh(boxGeometry,material)
// // everything gets added to the scene this way
// scene.add(mesh)


// ANCHOR -------------------------------- ADDING THE PLANE -----------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// width and height
const planeGeometry = new THREE.PlaneGeometry(visibleWidthAtZDepth(true, camera), .8 * visibleHeightAtZDepth(true, camera), 100, 100)
// NOTE mesh basic material doesnt require light
// const planeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide})
// NOTE this one does
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000, would usually incluce, but we have the vertices
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading,

// allowing custom colors, but we also need const colors
vertexColors: true})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

planeMesh.position.y -= 10

scene.add(planeMesh)

const colors = []

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  // NOTE colors of main plane
  colors.push(0,0.19,.4)
}


// we got this from the console
const vertArray = planeMesh.geometry.attributes.position.array

// NOTE loop for rigidness

for (let i = 0; i < vertArray.length; i+= 3) {
  var x = vertArray[i]
  var y = vertArray[i + 1]
  var z = vertArray[i + 2]

  vertArray[i + 2] = z + Math.random()

}

// ANCHOR ------------------------ ADDING COLOR ATRIBUTE
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))

// ANCHOR ------------------------------ ADDING LIGHT ------------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

//  color and intensity
const light = new THREE.DirectionalLight(0xffffff, 1)
// position light  x  y  z
light.position.set(0, 0, 1)
scene.add(light)


// NOTE Back light
const lightB = new THREE.DirectionalLight(0xffffff, 1)
lightB.position.set(0, 0, -15)
scene.add(lightB)


// NOTE ----------------------------------------------  ORBIT CONTROLS -----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// new OrbitControls(camera, renderer.domElement)


// NOTE mouse is here
const mouse = {
  x: undefined,
  y: undefined
}


// TODO THIS NEEDS TO BE ON BOTTOM
// ANCHOR ------------------------------------ ANIMATION ------------------------------
// TODO THIS NEEDS TO BE ON BOTTOM
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

function animate() {
  requestAnimationFrame(animate)
//makes sure everything is shown on screen
renderer.render(scene, camera)

// // testing the rotation
// mesh.rotation.x += 0.01
// mesh.rotation.y += 0.01

// NOTE ---------------------------------- RAYCASTER IS HERE -----------------------------------------------

raycaster.setFromCamera(mouse, camera)
const intersects = raycaster.intersectObject(planeMesh)


const initialColor = { // NOTE color of the change effect
  r: 0,
  b: 0.4,
  g: 0.19

  // r: 0.93921568627, NOTE pink
  // g: .2,
  // b: 0.67843137254
 }

 const hoverColor = { //NOTE color of the light
   r: 0.93921568627,
   g: 0.2,
   b: 0.67843137254
 }

if (intersects.length > 0) {

  const { color } = intersects[0].object.geometry.attributes

  // NOTE vert 1
  color.setX(intersects[0].face.a ,hoverColor)
  color.setY(intersects[0].face.a ,hoverColor)
  color.setZ(intersects[0].face.a ,hoverColor)

  // NOTE vert 2
  color.setX(intersects[0].face.b ,hoverColor)
  color.setY(intersects[0].face.b ,hoverColor)
  color.setZ(intersects[0].face.b ,hoverColor)

  //NOTE vert 3
  color.setX(intersects[0].face.c ,hoverColor)
  color.setY(intersects[0].face.c ,hoverColor)
  color.setZ(intersects[0].face.c ,hoverColor)

  intersects[0].object.geometry.attributes.color.needsUpdate = true

  gsap.to(hoverColor, {
    r: initialColor.r,
    g: initialColor.g,
    b: initialColor.b,
    onUpdate: () => {
      // NOTE vert 1
  color.setX(intersects[0].face.a ,hoverColor.r)
  color.setY(intersects[0].face.a ,hoverColor.g)
  color.setZ(intersects[0].face.a ,hoverColor.b)

  // NOTE vert 2
  color.setX(intersects[0].face.b ,hoverColor.r)
  color.setY(intersects[0].face.b ,hoverColor.g)
  color.setZ(intersects[0].face.b ,hoverColor.b)

  //NOTE vert 3
  color.setX(intersects[0].face.c ,hoverColor.r)
  color.setY(intersects[0].face.c ,hoverColor.g)
  color.setZ(intersects[0].face.c ,hoverColor.b)
  color.needsUpdate = true
    }
  })
}
}

animate()

// ANCHOR ------------------------------------   HOVER EFFECT ---------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR
// NOTE --------------- EVENT LISTENER --------------------------

addEventListener("mousemove", (event) => {
  // NOTE we are making it so that the coordinates are from -1 on the left to 1 on the right
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})




         
