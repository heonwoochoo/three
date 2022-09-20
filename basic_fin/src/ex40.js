import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Light 기본 사용법

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
  // const ambientLight = new THREE.AmbientLight("white", 0.5);
  const light = new THREE.DirectionalLight("white", 0.8);
  light.position.y = 3;
  scene.add(light);

  // LightHelper: 라이트의 위치를 화면상에 표시해준다
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, "x", -10, 10, 0.1).name("light-x");
  gui.add(light.position, "y", -10, 10, 0.1).name("light-y");
  gui.add(light.position, "z", -10, 10, 0.1).name("light-z");

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "orange" });
  const material3 = new THREE.MeshStandardMaterial({ color: "royalblue" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  plane.rotation.x = THREE.MathUtils.degToRad(-90);

  const box = new THREE.Mesh(boxGeometry, material2);
  box.position.set(1, 1, 0);
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  sphere.position.set(-1, 1, 0);

  scene.add(plane, box, sphere);

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
