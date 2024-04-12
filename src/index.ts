interface VerificationCodeOptions {
  lineWidth: number;
  lineNum: number;
  dotNum: number;
  dotR: number;
  foreGroundColor: [number, number];
  backGroundColor: [number, number];
  fontSize: number;
  fontFamily: string;
  fontStyle: "fill" | "stroke";
  content: string;
  len: number;
}

type CodeGetCallback = (randomCode: string) => void;

class VerificationCode {
  options: VerificationCodeOptions;
  canvas: HTMLCanvasElement;
  paint: CanvasRenderingContext2D | null = null;
  callBack: CodeGetCallback;

  constructor(
    dom: HTMLCanvasElement,
    callBack: CodeGetCallback,
    options?: VerificationCodeOptions
  ) {
    const newOptions: VerificationCodeOptions = Object.assign(
      {
        lineWidth: 0.5,
        lineNum: 2,
        dotNum: 5,
        dotR: 1,
        foreGroundColor: [10, 80],
        backGroundColor: [150, 250],
        fontSize: 20,
        fontFamily: "Georgia",
        fontStyle: "fill",
        content: "acdefhijkmnpwxyABCDEFGHJKMNPQWXY12345789",
        len: 4,
      },
      options
    );

    this.options = newOptions;

    if (!Boolean(dom instanceof HTMLCanvasElement)) {
      throw new Error("Canvas DOM is required");
    }

    if (typeof callBack !== "function") {
      throw new Error("Error callback");
    }

    this.canvas = dom;

    this.paint = this.canvas.getContext("2d");

    if (!this.paint) {
      throw new Error("Canvas getContext fail");
    }

    this.callBack = callBack;

    this.canvas.addEventListener("click", () => {
      this.drawAgain();
    });
  }

  getRand(arr: [number, number]) {
    const newArr = [...arr];
    newArr.sort((a, b) => a - b);
    return Math.floor(Math.random() * (newArr[1] - newArr[0]) + newArr[0]);
  }

  getColor(colorArea: [number, number]) {
    const colors: [number, number, number] = [
      this.getRand(colorArea),
      this.getRand(colorArea),
      this.getRand(colorArea),
    ];
    return colors;
  }

  getText() {
    const { content, len } = this.options;
    let str = "";
    for (let i = 0; i < len; i += 1) {
      str += content[this.getRand([0, content.length])];
    }
    return str;
  }

  drawLine() {
    if (!this.canvas || !this.paint) return;
    const { lineNum, foreGroundColor } = this.options;
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    for (let i = 0; i < lineNum; i += 1) {
      const startX = this.getRand([0, canvasWidth]),
        startY = this.getRand([0, canvasHeight]),
        endX = this.getRand([0, canvasWidth]),
        endY = this.getRand([0, canvasHeight]),
        colors = this.getColor(foreGroundColor);
      this.paint.strokeStyle = `rgba(${colors[0]},${colors[1]},${colors[2]},0.8)`;
      this.paint.beginPath();
      this.paint.moveTo(startX, startY);
      this.paint.lineTo(endX, endY);
      this.paint.closePath();
      this.paint.stroke();
    }
  }

  drawArc() {
    if (!this.canvas || !this.paint) return;
    const { dotNum, dotR, foreGroundColor } = this.options;
    for (let i = 0; i < dotNum; i += 1) {
      const x = this.getRand([0, this.canvas.width]),
        y = this.getRand([0, this.canvas.height]),
        colors = this.getColor(foreGroundColor);
      this.paint.fillStyle = `rgba(${colors[0]},${colors[1]},${colors[2]},0.8)`;
      this.paint.beginPath();
      this.paint.arc(x, y, dotR, 0, Math.PI * 2, false);
      this.paint.closePath();
      this.paint.fill();
    }
  }

  drawText() {
    if (!this.paint || !this.canvas) return;
    const text = this.getText();
    if (this.callBack) this.callBack(text);
    const { fontSize, fontFamily, len, fontStyle, foreGroundColor } =
      this.options;
    const { width: canvasWidth, height: canvasHeight } = this.canvas;
    this.paint.font = `${fontSize}px ${fontFamily}`;
    this.paint.textBaseline = "middle";
    const fontDrawMethod: "fillText" | "strokeText" = `${fontStyle}Text`,
      fontColorProper: "fillStyle" | "strokeStyle" = `${fontStyle}Style`,
      colors = this.getColor(foreGroundColor),
      y = canvasHeight / 2;
    for (let i = 0; i < len; i += 1) {
      const textWidth = this.paint.measureText(text[i]).width;
      const leftX = (canvasWidth / len) * i;
      const x = this.getRand([
        leftX + textWidth * 2,
        leftX + canvasWidth / len - textWidth * 2,
      ]);
      const deg = this.getRand([-6, 6]);
      this.paint.save();
      this.paint[
        fontColorProper
      ] = `rgba(${colors[0]},${colors[1]},${colors[2]}, 0.8)`;
      this.paint.rotate((deg * Math.PI) / 180);
      this.paint[fontDrawMethod](text[i], x, y);
      this.paint.restore();
    }
  }

  draw() {
    if (!this.paint || !this.canvas) return;

    const { backGroundColor } = this.options;
    const colors = this.getColor(backGroundColor);
    this.paint.fillStyle = `rgba(${colors[0]},${colors[1]},${colors[2]}, 0.8)`;
    this.paint.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawArc();
    this.drawLine();
    this.drawText();
  }

  clear() {
    if (this.paint && this.canvas)
      this.paint.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawAgain() {
    this.clear();
    this.draw();
  }
}

export default VerificationCode;
