import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// ----- 주제: Orbitcontrol

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

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 컨트롤 느낌을 좀 더 부드럽게해줌
  // controls.enableZoom = false;
  // controls.maxDistance = 10;
  // controls.minDistance = 2;
  // controls.minPolarAngle = THREE.MathUtils.degToRad(45);
  // controls.maxPolarAngle = THREE.MathUtils.degToRad(135);
  // controls.target.set(2, 2, 2); // 회전의 중심점을 타겟으로 정해줌
  controls.autoRotate = true;
  controls.autoRotateSpeed = 10;

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(${50 + Math.floor(Math.random() * 205)},${
        50 + Math.floor(Math.random() * 205)
      },${50 + Math.floor(Math.random() * 205)})`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    scene.add(mesh);
  }

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime() * 20;
    controls.update();
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
