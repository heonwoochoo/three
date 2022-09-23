import * as THREE from "three";
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 각지게 표현하기

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
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 0;
  directionalLight.position.z = 10;
  scene.add(directionalLight);

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material1 = new THREE.MeshStandardMaterial({
    color: "green",
    roughness: 0,
    metalness: 0.1,
    flatShading: true, // segment 선들이 보임
  });
  const material2 = new THREE.MeshPhongMaterial({
    color: "orange",
    shininess: 1000,
    flatShading: true,
  });
  const mesh1 = new Mesh(geometry, material1);
  mesh1.position.x = 1;
  const mesh2 = new Mesh(geometry, material2);
  mesh2.position.x = -1;

  scene.add(mesh1, mesh2);

  // Controller
  const controls = new OrbitControls(camera, renderer.domElement);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
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

  draw();
}
