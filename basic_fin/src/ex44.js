import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: SpotLight

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true; // 그림자설정1
  // renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값, radius 적용가능
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 기본보다 부드럽게
  renderer.shadowMap.type = THREE.BasicShadowMap; // 픽셀이 선명하게 나뉨, 성능이 제일 좋음

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
  const light = new THREE.SpotLight("white", 1, 10, Math.PI / 4);

  light.castShadow = true; // 그림자 설정2, 이 빛은 그림자를 만듭니다.
  light.shadow.mapSize.width = 1024; // 그림자를 더 선명하게, 너무 크면 성능에 악영향
  light.shadow.mapSize.height = 1024;
  light.shadow.radius = 5; // 그림자 끝을 약간 부드럽게, 약간의 블러처리
  // 그림자가 나오는 범위를 설정
  // 설정을 안하면 필요없는 공간까지 다 허용하므로 범위를 넉넉하게 설정하는게 좋음
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 20;
  scene.add(light);

  // LightHelper: 라이트의 위치를 화면상에 표시해준다
  const lightHelper = new THREE.SpotLightHelper(light);
  scene.add(ambientLight, lightHelper);

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
  plane.receiveShadow = true;

  const box = new THREE.Mesh(boxGeometry, material2);
  box.position.set(1, 1, 0);
  box.receiveShadow = true;
  box.castShadow = true;
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  sphere.position.set(-1, 1, 0);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
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
