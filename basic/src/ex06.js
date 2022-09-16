import * as THREE from "three";

// 주제: 애니메이션 성능보정

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  //scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);

  // light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 2;
  light.position.z = 5;
  scene.add(light);

  // Mesh
  // MeshBasicMaterial: 빛에 반응을 안하는 재질
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "#ff0000",
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock(); // Clock 자체는 경과된 시간을 숫자값으로 가지고 있다.
  console.log(clock);
  function draw() {
    const delta = clock.getDelta(); // 실행될때마다의 시간간격
    mesh.rotation.y += delta * 3;
    mesh.position.y += delta;
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);
    // window.requestAnimationFrame(draw);
    // WebWR을 구현할 때는 setAnimationLoop를 사용하도록 권장되어짐
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // 카메라 투영에 관련된 변화가 있을 경우 호출
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
