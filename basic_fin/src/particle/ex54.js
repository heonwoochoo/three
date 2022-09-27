import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import PreventDragClick from "../laycaster/preventDragClick";

// ----- 주제: 기본 particle

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 2;
  scene.add(camera);
  // Light
  // ambientLight: 은은하게 전체적으로 비춘다
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // dat GUI
  // const gui = new dat.GUI();
  // gui.add(light.position, "x", -10, 10, 0.1).name("light-x");
  // gui.add(light.position, "y", -10, 10, 0.1).name("light-y");
  // gui.add(light.position, "z", -10, 10, 0.1).name("light-z");

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Controller
  const controls = new OrbitControls(camera, renderer.domElement);

  //Mesh
  const geometry = new THREE.BufferGeometry();
  const count = 100000;
  const position = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < position.length; i++) {
    position[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(position, 3) // 1개의 Vertex(정점)을 위해 값 3개 필요
  );
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  console.log(geometry);
  const textureLoader = new THREE.TextureLoader();
  const particleTexture = textureLoader.load(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFLPhoVxkpiEqOqhgqiDMa1TmPv3Z1P-dJeQ&usqp=CAU"
  );

  const material = new THREE.PointsMaterial({
    size: 0.01,
    map: particleTexture,
    // 파티클 이미지를 투명하게 세팅
    transparent: false,
    alphaMap: particleTexture,
    depthWrite: false,
    vertexColors: true,
  });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
