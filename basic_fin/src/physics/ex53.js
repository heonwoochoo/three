import dat from "dat.gui";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import PreventDragClick from "../laycaster/preventDragClick";
import { SphereGeometry } from "three";
import MySphere from "./MySphere";
import { Howl } from "howler";
import { Domino } from "./Domino";
// ----- 주제: Performance(성능 좋게 하기)

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자를 부드럽게

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

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // dat GUI
  // const gui = new dat.GUI();
  // gui.add(light.position, "x", -10, 10, 0.1).name("light-x");
  // gui.add(light.position, "y", -10, 10, 0.1).name("light-y");
  // gui.add(light.position, "z", -10, 10, 0.1).name("light-z");

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Controller
  const controls = new OrbitControls(camera, renderer.domElement);

  // Loader
  const gltfLoader = new GLTFLoader();

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -9.81, 0);

  // 성능을 위한 세팅
  cannonWorld.allowSleep = true; // body가 엄청 느려지면, 테스트 안함 (더이상 물리 엔진 적용이 필요없는 경우에만 사용)
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 퀄리티를 올려줌(거의 많이 사용한다고 함)

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  // 기본값 설정
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.01, // 마찰
      restitution: 0.9, // 반발
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane(); // 모양
  const floorBody = new CANNON.Body({
    // 물리엔진이 적용되는 실체
    mass: 0, // 바닥 역할을 해줘야해서 중력의 영향을 받으면 안되기에 0으로 설정
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  //Mesh
  const floorMesh = new THREE.Mesh( // 바닥생성
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 도미노 생성
  const dominos = [];
  let domino;
  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      index: i + 4,
      scene,
      cannonWorld,
      gltfLoader,
      z: -i * 0.8,
    });
    dominos.push(domino);
  }

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();
    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120; // 컴퓨터에 따라 주사율이 달라서 보정값으로 바꿔줌
    cannonWorld.step(cannonStepTime, delta, 3); // 갱신하는 시간 단위

    dominos.forEach((item) => {
      if (item.cannonBody) {
        item.modelMesh.position.copy(item.cannonBody.position);
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
      }
    });
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkInterscts() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects[0].object.cannonBody) {
      intersects[0].object.cannonBody.applyForce(
        new CANNON.Vec3(0, 0, -100),
        new CANNON.Vec3(0, 0, 0)
      );
    }
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    if (preventDragClick.mouseMoved) return;
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

    checkInterscts();
  });
  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
