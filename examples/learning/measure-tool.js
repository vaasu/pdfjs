class MeasureToolClass {
  points = [];

  constructor(config = {tolerance: 20}) {
    this.config = config;
  }

  addSnap(tag, x, y) {
    this.points.push({tag: tag, x: x, y: y});
  }

  getPoints() {
    return this.points;
  }

  checkSnap(x, y) {
    const delta = this.config.tolerance;
    for(let i = 0; i < this.points.length; i++){
      if( Math.abs(this.points[i].x - x) < delta
       && Math.abs(this.points[i].y - y) < delta) return {canSnap: true, point: this.points[i]};
    }
    return {canSnap: false};
  }
}

const MeasureTool = new MeasureToolClass()
