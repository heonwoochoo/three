export class KeyController {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      // ex) w키가 눌리면 this.keys['KeyW'] = true로 지정
      console.log(e.code + "누름");
      this.keys[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
      console.log(e.code + "땜");
      delete this.keys[e.code];
    });
  }
}
