// ANCHOR import the style sheet
import './style.css'

// import gsap for animations
import gsap from "gsap"

// import all of the assets from three.js
import * as THREE from 'three';

import * as dat from "dat.gui"

// NOTE control orbit
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js"


// ANCHOR ------------------------------------------ DAT GUI LOOP --------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// NOTE creating a new slider for dat gui with a name of width and start value of 10
const gui = new dat.GUI()
const world = {
  plane: {
    width: 5, // ^^ note is refering to this line
    height: 5,
    widthSegments: 5,
    heightSegments: 5
  }
}

// NOTE adding the slider's min and max values
gui.add(world.plane, "width", 1, 20).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "height", 1, 20).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "widthSegments", 1, 20).onChange(generatePlane)

// NOTE adding the slider's min and max values
gui.add(world.plane, "heightSegments", 1, 20).onChange(generatePlane)

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
}

planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
}



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
const planeGeometry = new THREE.PlaneGeometry(50, 50, 100, 100)
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

scene.add(planeMesh)

const colors = []

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  // NOTE colors of main plane
  colors.push(0.43921568627,0.2,0.67843137254)
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

// moving camera in order to see the mesh
camera.position.z = 15

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
if (intersects.length > 0) {

  const { color } = intersects[0].object.geometry.attributes

  // NOTE vert 1
  color.setX(intersects[0].face.a ,0.1)
  color.setY(intersects[0].face.a ,0.5)
  color.setZ(intersects[0].face.a ,1)

  // NOTE vert 2
  color.setX(intersects[0].face.b ,0.1)
  color.setY(intersects[0].face.b ,0.5)
  color.setZ(intersects[0].face.b ,1)

  //NOTE vert 3
  color.setX(intersects[0].face.c ,0.1)
  color.setY(intersects[0].face.c ,0.5)
  color.setZ(intersects[0].face.c ,1)

  intersects[0].object.geometry.attributes.color.needsUpdate = true

  const initialColor = {
   r: 0.43921568627,
   g: .2,
   b: 0.67843137254
  }

  const hoverColor = {
    r: 0.1,
    g: 0.5,
    b: 1
    
    // NOTE r: 0.1, OLD COLORS
    // g: 0.5,
    // b: 1
  }
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
  console.log(event.clientX)
})




         
