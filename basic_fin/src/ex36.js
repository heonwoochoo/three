import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: MeshMathcapMaterial

export default function example() {
  const textureLoader = new THREE.TextureLoader();
  const matcapTex = textureLoader.load("/texture/GoldPurple.png");

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
  directionalLight.position.set(1, 1, 2);
  scene.add(directionalLight);

  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  // 법선의 각도에 따라 색이 바뀜
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTex,
  });

  const mesh1 = new THREE.Mesh(geometry, material);

  scene.add(mesh1);

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
