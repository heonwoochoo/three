import dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PreventDragClick from "./preventDragClick";

// ----- 주제: 클릭한 메쉬 감지하기

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
  const mouse = new THREE.Vector2();

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  let isBoxClicked = false;
  let isTorusClicked = false;
  function checkIntersects() {
    if (preventDragClick.mouseMoved) return;
    // 카메라 위치를 origin으로 잡고 mousu의 x,y좌표를 광선으로 세팅
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);
    // for (const item of intersects) {
    //   console.log(item.object.name);
    //   break; // 처음 맞는 아이템에서 for문 종료 -> 하나만 클릭할 수 있게 함
    // }
    if (intersects[0]) {
      if (intersects[0].object.name === "box") {
        if (isBoxClicked) {
          intersects[0].object.material.color.set("plum");
          isBoxClicked = false;
        } else {
          intersects[0].object.material.color.set("red");
          isBoxClicked = true;
        }
      } else if (intersects[0].object.name === "torus") {
        if (intersects[0].object.name === "torus") {
          if (isTorusClicked) {
            intersects[0].object.material.color.set("lime");
            isTorusClicked = false;
          } else {
            intersects[0].object.material.color.set("red");
            isTorusClicked = true;
          }
        }
      }
    }
  }
  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    // 2D 좌표를 3D 상의 좌표로 최적화
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    checkIntersects();
    console.log("hello");
  });
  const preventDragClick = new PreventDragClick(canvas);
  draw();
}
