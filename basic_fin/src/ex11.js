import * as THREE from "three";
import dat from "dat.gui";
// ----- 주제: GUI 컨트롤

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
  camera.position.y = 1;
  scene.add(camera);
  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 0;
  directionalLight.position.z = 10;
  scene.add(directionalLight);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "red",
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 2;
  scene.add(mesh);

  // Dat GUI
  // 자바스크립트 오트젝트의 속성값을 그래픽 값으로 조정할 수 있게 해준다.
  const gui = new dat.GUI();
  gui.add(mesh.position, "y", -5, 5, 0.01).name("큐브y값");
  gui.add(mesh.position, "x", -5, 5, 0.01).name("큐브x값");
  gui.add(camera.position, "z", -5, 5, 0.01).name("카메라z값");

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();
    camera.lookAt(mesh.position);
    mesh.rotateY(time * 0.01);
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
