class MeasureToolClass {
  LIMIT_SNAPS = 0;
  points = [];
  savedTransform = [];
  reverseTransform = [];
  ops = [];

  // Default SVG matrix a,b,c,d,e
  currentMatrix = [1, 0, 0, 1, 0, 0]

  constructor(config = {tolerance: 20}) {
    this.config = config;
  }


  addSnap(tag, x, y)
  {
    if(this.LIMIT_SNAPS > 0 && this.points.length > this.LIMIT_SNAPS) return;
    const [a,b,c,d,e,f] = this.currentMatrix;
    // Transformed x and y
    const tx =  a * x + c * y;
    const ty  = b * y + d * y;

    this.points.push({tag, x: tx, y:ty});
  }


  checkSnap(mousex, mousey)
  {
    const delta = this.config.tolerance;
    const [a,b,c,d,e,f] = this.reverseTransform;

    // Transformed x and y
    const tx =  a * mousex  + c * mousey;
    const ty  = b * mousex + d * mousey;

    for(let i = 0; i < this.points.length; i++){
      if( Math.abs(this.points[i].x - mousex) < delta
       && Math.abs(this.points[i].y - mousey) < delta) return {canSnap: true, snap: this.points[i], transformed: {x: tx, y: ty}};
    }
    return {canSnap: false, transformed: {x: tx, y: ty}};
  }

  saveTransform({a,b,c,d,e,f})
  {
    this.savedTransform = [a,b,c,d,e,f];

    // Reverse got from Woframe
    // https://www.wolframalpha.com/input?i=matrix+inverse&assumption=%7B%22F%22%2C+%22MatrixInverse%22%2C+%22invmatrix%22%7D+-%3E%22%7B%7Ba%2Cc%2Ce%7D%2C%7Bb%2Cd%2Cf%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22C%22%2C+%22matrix+inverse%22%7D+-%3E+%7B%22Calculator%22%7D
    this.reverseTransform = [
      d/(a*d-b*c), b/(b*c-a*d), c/(b*c-a*d), a/(a*d-b*c), (d*e-c*f)/(b*c-a*d), (b*e-a*f)/(a*d-b*c)
    ]
  }

  transform({a,b,c,d,e,f}){
    // Multiply current and incoming
    const [a1,b1,c1,d1,e1,f1] = this.currentMatrix;
    const output = [
      a * a1 + b * c1,
      a * b1 + b * d1,
      a1 * c + c1 * d,
      b1 * c + d * d1,
      a1 * e + c1 * f + e1,
      b1 * e + d1 * f + f1
    ]
    this.currentMatrix = output;
  }

  setTransform({a,b,c,d,e,f}){
    this.currentMatrix = [a,b,c,d,e,f];
  }

  scale({x,y}) {
    //https://www.wolframalpha.com/input?i=matrix+multiplication&assumption=%7B%22F%22%2C+%22MatricesOperations%22%2C+%22theMatrix3%22%7D+-%3E%22%7B%7B1%2C0%2C0%7D%2C%7B0%2C1%2C0%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22F%22%2C+%22MatricesOperations%22%2C+%22theMatrix2%22%7D+-%3E%22%7B%7Bx%2C0%2C0%7D%2C%7B0%2Cy%2C0%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22F%22%2C+%22MatricesOperations%22%2C+%22theMatrix1%22%7D+-%3E%22%7B%7Ba%2Cc%2Ce%7D%2C%7Bb%2Cd%2Cf%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22C%22%2C+%22matrix+multiplication%22%7D+-%3E+%7B%22Calculator%22%7D

    // Multiplies the existing matrix [[a,c,e][b,d,f][0,0,1]] with scaling matrix [[x,0,0][0,y,0][0,0,1]]
    const [a,b,c,d,e,f] = this.currentMatrix;
    const output = [
      a*x, b*x, c*y, d*y, e, f
    ];
    this.currentMatrix = output;
  }



  setContext    = c => this.context = c;
  getTransform  = _ => this.savedTransform;
  getContext    = _ => this.context;
  getPoints     = _ => this.points;
  addOp = (op, args) => this.ops.push({op, args});
  getOps = _ => this.ops;

}

const MeasureTool = new MeasureToolClass()
