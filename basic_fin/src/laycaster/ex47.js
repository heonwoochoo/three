import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

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

  // dat GUI
  // const gui = new dat.GUI();
  // gui.add(light.position, "x", -10, 10, 0.1).name("light-x");
  // gui.add(light.position, "y", -10, 10, 0.1).name("light-y");
  // gui.add(light.position, "z", -10, 10, 0.1).name("light-z");

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  //Mesh
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100));
  points.push(new THREE.Vector3(0, 0, -100));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "plum",
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: "lime",
  });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";
  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  // Controller
  const controls = new OrbitControls(camera, renderer.domElement);

  const raycaster = new THREE.Raycaster();

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");
    const time = clock.getElapsedTime();
    const origin = new THREE.Vector3(0, 0, 100);
    const direction = new THREE.Vector3(0, 0, -100);
    direction.normalize(); // direction 인자값이 0,1이 아닌 경우 반드시 normalize를 해야 raycater가 인식한다.
    raycaster.set(origin, direction);
    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      item.object.material.color.set("red");
    });

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.sin(time) * 2;
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
