class MeasureToolClass {
  points = [];
  savedTransform = [];
  reverseTransform = [];

  constructor(config = {tolerance: 20}) {
    this.config = config;
  }

  addSnap(tag, x, y) {
    this.points.push({tag: tag, x: x, y: y});
  }

  getPoints() {
    return this.points;
  }


  checkSnap(mousex, mousey) {
    const delta = this.config.tolerance;
    const [a,b,c,d,e,f] = this.reverseTransform;

    // Transformed x and y
    const tx = a * mousex  + c * mousey;
    const ty  = b * mousex + d * mousey;
    console.log('Checking', mousex, mousey, tx, ty);
    for(let i = 0; i < this.points.length; i = i+50){
      if( Math.abs(this.points[i].x - tx) < delta
       && Math.abs(this.points[i].y - ty) < delta) return {canSnap: true, point: this.points[i]};
    }
    return {canSnap: false};
  }

  saveTransform({a,b,c,d,e,f}) {
    this.savedTransform = [a,b,c,d,e,f];

    // Reverse got from Woframe
    // https://www.wolframalpha.com/input?i=matrix+inverse&assumption=%7B%22F%22%2C+%22MatrixInverse%22%2C+%22invmatrix%22%7D+-%3E%22%7B%7Ba%2Cc%2Ce%7D%2C%7Bb%2Cd%2Cf%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22C%22%2C+%22matrix+inverse%22%7D+-%3E+%7B%22Calculator%22%7D
    this.reverseTransform = [
      d/(a*d-b*c), b/(b*c-a*d), c/(b*c-a*d), a/(a*d-b*c), (d*e-c*f)/(b*c-a*d), (b*e-a*f)/(a*d-b*c)
    ]
  }

  getTransform() {
    return this.savedTransform;
  }
}

const MeasureTool = new MeasureToolClass()
