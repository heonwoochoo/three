import * as THREE from "three";
// ----- 주제: AxesHelper, GridHelper

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
  camera.position.y = 8;
  camera.position.x = -1;
  scene.add(camera);
  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 0;
  directionalLight.position.z = 10;
  scene.add(directionalLight);

  // axesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // gridHelper
  const gridHelper = new THREE.GridHelper(5, 5);
  scene.add(gridHelper);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "red",
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 2;
  scene.add(mesh);
  camera.lookAt(mesh.position);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();
    mesh.rotateY(time * 0.001);
    renderer.render(scene, camera);
    // window.requestAnimationFrame(draw);
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
