class PreventDragClick {
  constructor(canvas) {
    this.mouseMoved;
    let clickStartX;
    let clickStartY;
    let clickStartTime;
    canvas.addEventListener("mousedown", (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });
    canvas.addEventListener("mouseup", (e) => {
      const xGap = Math.abs(e.clientX - clickStartX);
      const yGap = Math.abs(e.clientY - clickStartY);
      const timeGap = Date.now() - clickStartTime;
      this.mouseMoved = xGap > 5 || yGap > 5 || timeGap > 500 ? true : false;
    });
  }
}
export default PreventDragClick;
