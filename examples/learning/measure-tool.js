class MeasureToolClass {
  LIMIT_SNAPS = 0;
  LIMIT_OPS = 0;
  points = [];
  ops = [];

  // Default SVG matrix a,b,c,d,e
  currentMatrix = [1, 0, 0, 1, 0, 0]

  constructor(config = {tolerance: 20}) {
    this.config = config;
  }

  addOp(op, args)
  {
    if(this.LIMIT_OPS > 0 && this.ops.length > this.LIMIT_OPS) return;
    this.ops.push({op, args});
  }

  addSnap(tag, x, y)
  {
    if(this.LIMIT_SNAPS > 0 && this.points.length > this.LIMIT_SNAPS) return;
    const [a,b,c,d,e,f] = this.currentMatrix;
    // Transformed x and y using matrix [x,y,1]
    let tx =  a * x + c * y + e;
    let ty  = b * x + d * y + f;

    this.points.push({tag, x: tx, y:ty, matrix:[a,b,c,d,e,f], source: [x,y]});
  }


  checkSnap(mousex, mousey)
  {
    const delta = this.config.tolerance;
    for(let i = 0; i < this.points.length; i++){
      if( Math.abs(this.points[i].x - mousex) < delta
       && Math.abs(this.points[i].y - mousey) < delta) return {canSnap: true, snap: this.points[i]};
    }
    return {canSnap: false};
  }

  transform_new_but_dont_use({a,b,c,d,e,f}){
    // Multiply incoming x existing in this order
    // Taken from https://www.wolframalpha.com/input?i=matrix+multiply&assumption=%7B%22F%22%2C+%22MatricesOperations%22%2C+%22theMatrix2%22%7D+-%3E%22%7B%7Ba_2%2Cc_2%2Ce_2%7D%2C%7Bb_2%2Cd_2%2Cf_2%7D%2C%7B0%2C0%2C1%7D%7D%22&assumption=%7B%22F%22%2C+%22MatricesOperations%22%2C+%22theMatrix1%22%7D+-%3E%22%7B%7Ba%2Cc%2Ce%7D%2C%7Bb%2Cd%2Cf%7D%2C%7B0%2C0%2C1%7D%7D%22
    const [a2,b2,c2,d2,e2,f2] = this.currentMatrix;
    const output = [
      a*a2 + b2*c,
      a2*b + b2*d,
      a*c2 + c*d2,
      b*c2 + d*d2,
      a*e2 + c*f2+e,
      b*e2 + d*f2+f
    ]
    this.currentMatrix = output;
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

  setContext(context) {
    this.context = context;
  }

  getContext    = _ => this.context;
  getPoints     = _ => this.points;
  getOps        = _ => this.ops;

}

//const MeasureTool = new MeasureToolClass()
