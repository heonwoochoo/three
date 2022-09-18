import * as THREE from "three";
// ----- 주제: 그룹만들기(Scene Graph)

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
    color: "hotpink",
  });

  const group1 = new THREE.Group();
  const box1 = new THREE.Mesh(geometry, material); // 태양

  const group2 = new THREE.Group();
  const box2 = box1.clone(); // 지구
  box2.scale.set(0.3, 0.3, 0.3);
  group2.position.x = 2;

  // const group3 = new THREE.Object3D();
  const group3 = new THREE.Group();
  const box3 = box2.clone(); // 달
  box3.scale.set(0.15, 0.15, 0.15);
  box3.position.x = 0.5;

  group3.add(box3);
  group2.add(box2, group3);
  group1.add(box1, group2);
  scene.add(group1);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();

    group1.rotation.y += delta;
    group2.rotation.y += delta;
    group3.rotation.y += delta;
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
