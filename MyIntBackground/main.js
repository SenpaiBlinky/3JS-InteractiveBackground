// ANCHOR import the style sheet
import './style.css'

// import gsap for animations
import gsap from "gsap"

// import * as THREE from './node_modules/three/src/Three.js';

// import all of the assets from three.js
import * as THREE from 'three';

import * as dat from "dat.gui"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as TWEEN from "@tweenjs/tween.js"; //fillerino - daa

import { InteractionManager } from "three.interactive";




// ANCHOR ------------- Main Setup - scene, camera, renderer ---------------------- 
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// scene creation
const scene = new THREE.Scene();
// parameters (field of view, aspect ration, where to see from, where to see till)
function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
}
const camera = createCamera();
// how we see things
const renderer = new THREE.WebGLRenderer({ antialias: true });

// params (width,height)
renderer.setSize(innerWidth,innerHeight)
// set the pixel ratio for a crispier picture :)
renderer.setPixelRatio(devicePixelRatio)
// adding the renderer to dom
document.body.appendChild(renderer.domElement)


// moving camera in order to see the mesh
camera.position.z = 100 // daaaaaa




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
// const gui = new dat.GUI()
// const world = {
//   plane: {
//     width: visibleWidthAtZDepth(true, camera), // ^^ note is refering to this line
//     height: visibleHeightAtZDepth(true, camera),
//     widthSegments: 100,
//     heightSegments: 100
//   }
// }

// // NOTE adding the slider's min and max values
// gui.add(world.plane, "width", 100,  visibleWidthAtZDepth(true, camera) + 100).onChange(generatePlane)

// // NOTE adding the slider's min and max values
// gui.add(world.plane, "height", 100, visibleHeightAtZDepth(true, camera) + 100).onChange(generatePlane)

// // NOTE adding the slider's min and max values
// gui.add(world.plane, "widthSegments", 1, 150).onChange(generatePlane)

// // NOTE adding the slider's min and max values
// gui.add(world.plane, "heightSegments", 1, 150).onChange(generatePlane)

// function generatePlane() {

//     // removing old geometry
//     planeMesh.geometry.dispose()
//     // adding new geometry value
//     planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.heightSegments, world.plane.heightSegments)
  
    
//   // we got this from the console
//   var vertArray = planeMesh.geometry.attributes.position.array
  
//     // NOTE loop for rigidness
  
//   for (let i = 0; i < vertArray.length; i++) {
//     var x = vertArray[i]
//     var y = vertArray[i + 1]
//     var z = vertArray[i + 2]
  
//     vertArray[i] = x + Math.random() - 0.5
//     vertArray[i + 1] = y + Math.random() - 0.5
//     vertArray[i + 2] = z + Math.random()

//     randomValues.push(Math.random())
  
//   }

//   const colors = []

// for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
//   colors.push(0,.19,.4)
// }

// planeMesh.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))
// }



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


// ANCHOR -------------------------------- ADDING THE SCENE -----------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// width and height
const sceneGeometry = new THREE.PlaneGeometry(visibleWidthAtZDepth(true, camera) , visibleHeightAtZDepth(true, camera) , 100, 100)
// NOTE mesh basic material doesnt require light
const sceneMaterial = new THREE.MeshBasicMaterial({color: 0xA13ECC, side: THREE.DoubleSide})
// NOTE this one does
// const sceneMaterial = new THREE.MeshPhongMaterial({
//   // color: 0xff0000, would usually incluce, but we have the vertices
//   side: THREE.DoubleSide, 
//   flatShading: THREE.FlatShading,

// // allowing custom colors, but we also need const colors
// vertexColors: true})

const sceneMesh = new THREE.Mesh(sceneGeometry, sceneMaterial)

sceneMesh.position.z -= 40
sceneMesh.position.x -= 200

scene.add(sceneMesh)


// ANCHOR -------------------------------- ADDING THE PLANE -----------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// width and height
const planeGeometry = new THREE.PlaneGeometry(visibleWidthAtZDepth(true, camera), visibleHeightAtZDepth(true, camera) * .6, 100, 100)
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

planeMesh.position.y -= (visibleHeightAtZDepth(true, camera) - .8 * visibleHeightAtZDepth(true, camera)) 
planeMesh.rotateX(-7.5)

scene.add(planeMesh)

const colors = []

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  // NOTE colors of main plane
  colors.push(0,0.19,.4)
}


// we got this from the console
const vertArray = planeMesh.geometry.attributes.position.array

const randomValues = []


// NOTE loop for rigidness

for (let i = 0; i < vertArray.length; i++) {

  if (i % 3 === 0 ) {
  var x = vertArray[i]
  var y = vertArray[i + 1]
  var z = vertArray[i + 2]

  
  vertArray[i + 1] = y + Math.random() -.5
  vertArray[i] = x + Math.random() - .5
  vertArray[i + 2] = z + Math.random()
  }

  randomValues.push(Math.random() - 0.5 )

}

planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

planeMesh.geometry.attributes.position.randomValues = randomValues

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


// ANCHOR --------------------------------- DOGGO 3D --------------------------------------------------------
// ------------------------------------------------------------------------------------------------ ANCHOR

// const loader = new GLTFLoader();

// loader.load( 'scene.gltf', function ( gltf ) {

// scene.add( gltf.scene );

// gltf.scene.position.x -= 15
// gltf.scene.position.y -= 10
// gltf.scene.position.z -= 20 
// gltf.scene.rotateY(-50)


// }, undefined, function ( error ) {

// 	console.error( error );

// } );

// doggo.posX = 100
















// ANCHOR -------------------------------------- MOVING BUTTONS ---------------------------------------
// ----------------------------------------------------------------------------------------- ANCHOR



function createRenderer() {
  const app = document.getElementsByTagName("BODY")[0];
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  app.appendChild(renderer.domElement);
  return renderer;
}

function createScene() {
  // const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xffffff);
  // return scene;
}



function createCube({ color, x, y }) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshLambertMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, 0);

  return cube;
}


function createLight() {
  // const light = new THREE.PointLight(0xffffff, 1, 1000);
  // light.position.set(0, 0, 10);
  // return light;
}


// const renderer = createRenderer();
// const scene = createScene();


const cubes = {
  // pink: createCube({ color: 0xff00ce, x: -1, y: -1.5 }),
  // purple: createCube({ color: 0x9300fb, x: 1, y: -2 })
  // blue: createCube({ color: 0x0065d9, x: 1, y: 1 }),
  // cyan: createCube({ color: 0x00d7d0, x: -3, y: 1 })
};

// const light = createLight();

for (const object of Object.values(cubes)) {
  scene.add(object);
}

// scene.add(light);



const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

// MAKE AN OBJECT AND CONNECT EACH PIECE
for (const [name, object] of Object.entries(cubes)) {
  object.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log(`${name} cube was clicked`);
    const cube = event.target;
    console.log(event.target)
    const coords = { x: camera.position.x, y: camera.position.y };
    new TWEEN.Tween(coords)
      .to({ x: cube.position.x, y: cube.position.y })
      .onUpdate(() =>
        camera.position.set(coords.x, coords.y, camera.position.z),
      )
      .start();
  });
  interactionManager.add(object);
  scene.add(object);
}

const mPT = document.getElementById("mainPageText")
const aboutMe = document.getElementById("aboutMe")
aboutMe.style.visibility = "hidden"


const button = document.getElementById("myBtn")
button.addEventListener("click", (event) => {
 
      camera.position.x -= 200
      mPT.style.visibility = "hidden"
      aboutMe.style.visibility = "visible"


      document.getElementById("myBtn").classList.add("bg-black")
      document.getElementById("myBtn2").classList.add("bg-black")
      document.getElementById("myBtn3").classList.add("bg-black")
      document.getElementById("myBtn4").classList.add("bg-black")
      document.getElementById("myBtn5").classList.add("bg-black")

}); //aa

const button2 = document.getElementById("myBtn2")
button2.addEventListener("click", (event) => {
 
      camera.position.x += 10
    
});

const button3 = document.getElementById("myBtn3")
button3.addEventListener("click", (event) => {
 
  mPT.style.visibility = "visible"
  aboutMe.style.visibility = "hidden"
      camera.position.x += 200
      
      document.getElementById("myBtn").classList.remove("bg-black")
      document.getElementById("myBtn2").classList.remove("bg-black")
      document.getElementById("myBtn3").classList.remove("bg-black")
      document.getElementById("myBtn4").classList.removed("bg-black")
      document.getElementById("myBtn5").classList.remove("bg-black")
    
});

























// ANCHOR --------------------------------------- BACKGROUND -------------------------------------------------
// ---------------------------------------------------------------------------------------------- ANCHOR

let posX;
let posY;

let mouseDown = false;

function main() {
  const canvas = document.querySelector("#c");
  // const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.autoClearColor = false;

  posX = renderer.domElement.clientWidth / 2;
  posY = renderer.domElement.clientHeight / 2;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 5;
  // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();
  const oRadius = 4;
  const oDetail = 2;
  const geometry = new THREE.OctahedronGeometry(oRadius, oDetail);
  const plane = new THREE.PlaneBufferGeometry(2, 2);

  const fragmentShader = `
            #include <common>

            uniform vec3 iResolution;
            uniform float iTime;
            uniform vec4 iMouse;

            uniform sampler2D iChannel0;


            vec2 arrangeCoords(vec2 p) {
                vec2 q = p.xy/iResolution.xy;
                vec2 r = -1.0+2.0*q;
              r.x *= iResolution.x/iResolution.y;
                return r;
            }

            void mainImage( out vec4 fragColor, in vec2 fragCoord ){
              float speed = .1;
              float scale = 0.002;
              vec2 p = arrangeCoords(fragCoord);
              for(int i=1; i<10; i++){
                  p.x+=0.3/float(i)*sin(float(i)*3.*p.y+iTime*speed)+iMouse.x/1000.;
                  p.y+=0.3/float(i)*cos(float(i)*3.*p.x+iTime*speed)+iMouse.y/1000.;
              }
              float r=cos(p.x+p.y+1.)*.5+.1;
              float g=sin(p.x+p.y+1.)*.5+.1;                   //NOTE colors
              float b=(sin(p.x+p.y)+cos(p.x+p.y))*.5+.9;
              vec3 color = vec3(r,g,b);
              fragColor = vec4(color,1);
            }

            varying vec2 vUv;
          void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
          }
      `;

      // ANCHOR --------------------------- OLD COLORS BELOW ----------------------------------------

      // float r=cos(p.x+p.y+1.)*.5+.1;
      //         float g=sin(p.x+p.y+1.)*.5+.1;                   //NOTE colors for purple-ish
      //         float b=(sin(p.x+p.y)+cos(p.x+p.y))*.5+.9;

      // --------------------------------------------------------------------------------------// ANCHOR


  const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "https://threejsfundamentals.org/threejs/resources/images/bayer.png"
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  // canvas.addEventListener("mousedown", (e) => {
  //   mouseDown = true;
  // });

  // canvas.addEventListener("mouseup", (e) => {
  //   mouseDown = false;
  // });

  // canvas.addEventListener("mousemove", (e) => {
  //   if (mouseDown) {
  //     posX = e.layerX;
  //     posY = e.layerY;
  //   }
  //   console.log(posX, posY);
  // });

  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iMouse: { value: new THREE.Vector2() }
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms
  });

  const bgMaterial = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms
  });

  material.side = THREE.BackSide;

  function makeInstance(geometry, x) {
    const threeDObject = new THREE.Mesh(geometry, material);
    scene.add(threeDObject);

    threeDObject.position.x = x;

    return threeDObject;
  }

  const threeDObjects = [makeInstance(geometry, 0)];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001; // convert to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // threeDObjects.forEach((threeDObject, ndx) => {
    //   const speed = 1 + ndx * 0.1;
    //   const rot = (time * speed) / 2;
    //   threeDObject.rotation.x = rot;
    //   threeDObject.rotation.y = rot;
    // });

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;
    uniforms.iMouse.value.set(posX, posY);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

























// NOTE ----------------------------------------------  ORBIT CONTROLS -----------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR

// new OrbitControls(camera, renderer.domElement)


// NOTE mouse is here
const mouse = {
  x: undefined,
  y: undefined
}























const musicHelper = (function(){
  let wrap   = document.querySelector( '#player' ); 
  let button = wrap ? wrap.querySelector( 'button' ) : null; 
  let audio  = new Audio( 'DMCB.mp3' ); //
  let step   = 0.01;
  let active = false; 
  let sto    = null; 
  
  let fadeIn = () => {
   audio.volume += 0.01; 
   if ( audio.volume >= 0.2 ) { audio.volume = 0.2; return; }
   sto = setTimeout( fadeIn, 100 ); 
  };
  
  let fadeOut = () => {
   audio.volume -= 0.02; 
   if ( audio.volume <= 0.01 ) { audio.volume = 0; audio.pause(); return; }
   sto = setTimeout( fadeOut, 100 ); 
  };
  
  let play = () => {
   if ( sto ) clearTimeout( sto ); 
   active = true;
   button.textContent = 'Stop music'; 
   audio.play(); 
   fadeIn();
  };
  
  let stop = () => {
   if ( sto ) clearTimeout( sto ); 
   active = false;
   button.textContent = 'Play music'; 
   fadeOut();
  };
  
  button.addEventListener( 'click', e => {
   e.stopPropagation(); 
   e.preventDefault(); 
   if ( active ) { stop(); } 
   else { play(); }
  });
  
  audio.preload = 'auto'; 
  audio.muted   = false; 
  audio.volume  = 0;
  return { play, stop };
 })();

 document.getElementById("myBtn").addEventListener("click", function() {
  var currentLoop = frame;
  
});
















// TODO THIS NEEDS TO BE ON BOTTOM
// ANCHOR ------------------------------------ ANIMATION ------------------------------
// TODO THIS NEEDS TO BE ON BOTTOM
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR
let frame = 0

// function animate(callback) {
//   function loop(time) {
//     callback(time);
//     requestAnimationFrame(loop);
//   }
//   requestAnimationFrame(loop);
// }


function animate(callback) {

  function loop(time) {
    callback(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(animate)
//makes sure everything is shown on screen
renderer.render(scene, camera)
frame += 0.01


// // testing the rotation
// mesh.rotation.x += 0.01
// mesh.rotation.y += 0.01


// NOTE --- MOVING EFFECT ----------

const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position

for (let i = 0; i < array.length; i += 3) {
  
  array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.009

  array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.003
}

planeMesh.geometry.attributes.position.needsUpdate = true


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

// animate()


animate((time) => {
  renderer.render(scene, camera);
  interactionManager.update();
  TWEEN.update(time);
});

// ANCHOR ------------------------------------   HOVER EFFECT ---------------------------------
//------------------------------------------------------------------------------------------------------------------------------// ANCHOR
// NOTE --------------- EVENT LISTENER --------------------------

addEventListener("mousemove", (event) => {
  // NOTE we are making it so that the coordinates are from -1 on the left to 1 on the right
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})




         
