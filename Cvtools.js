/* eslint-disable no-plusplus */
/* eslint-disable import/extensions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import Draw from './RppDraw.js';
import { run } from './run.js';

export default class CvTools {
  #view;

  #toCenter_x;

  #toCenter_y;

  #path;

  #pathh;

  #x;

  #y;

  margin;

  fig = [];

  constructor(canvas = document.createElement('canvas')) {
    this.#view = canvas;
    this.#toCenter_x = 0;
    this.#toCenter_y = 0;
    this.#path = [];
    this.#pathh = [];
    this.margin = 20;
  }

  get view() { return this.#view; }

  get ct() { return this.#view.getContext('2d'); }

  get st() { return this.#view.style; }

  get midX() { return this.view.clientWidth / 2 + this.#toCenter_x; }

  get midY() { return this.view.clientHeight / 2 + this.#toCenter_y; }

  get mX() { return this.#view.width / 2; }

  get mY() { return this.#view.height / 2; }

  get x() { return this.#x; }

  set x(x) {
    this.#x = x;
    this.st.left = `${x + this.#toCenter_x}px`;
  }

  get y() { return this.#y; }

  set y(y) {
    this.#y = y;
    this.st.top = `${y + this.#toCenter_y}px`;
  }

  get w() { return this.#view.width; }

  set w(w) { this.#view.width = w; }

  get h() { return this.#view.height; }

  set h(h) { this.#view.height = h; }

  get width() { return Number(this.st.width.slice(0, -2)); }

  set width(w) { this.st.width = `${w}px`; }

  get height() { return Number(this.st.height.slice(0, -2)); }

  set height(h) { this.st.height = `${h}px`; }

  get angle() { return Number(this.st.transform.slice(7, -4)); }

  set angle(a) { this.st.transform = `rotate(${a}deg)`; }

  #getXY() {
    const x = Number(this.st.left.slice(0, -2));
    const y = Number(this.st.top.slice(0, -2));
    return { x, y };
  }

  static gradeData(imageData) {
    const grade = [];
    for (let i = 0; i < imageData.height; i += 1) {
      grade.push([]);
      for (let j = 0; j < imageData.width; j += 1) {
        grade[i].push({
          R: 0,
          G: 0,
          B: 0,
          A: 0,
        });
      }
    }

    CvTools.switchData(grade, imageData, 'to');

    return grade;
  }

  static switchData(grade, imageData, sent) {
    let n = 0;
    grade.forEach((vl) => vl.forEach((v) => {
      for (const p in v) {
        if (sent === 'from') imageData.data[n += 1] = v[p];
        if (sent === 'to') v[p] = imageData.data[n += 1];
      }
    }));
  }

  circData(grade, {
    x = 0, y = 0, w = 1, color = {
      R: 0, G: 0, B: 0, A: 0,
    },
  }) {
    const per = 2 * Math.PI * w * 2;
    const ang = 360 / per;
    for (let i = 0; i < per; i += 1) {
      const a = ang * i;
      for (let r = 0; r < w; r += 1) {
        const xi = Math.floor(Draw.cos(x, a, r));
        const yi = Math.floor(Draw.sin(y, a, r));
        for (const c in color) grade[yi][xi][c] = color[c];
      }
    }
  }

  hide() {
    const data = this.ct.createImageData(this.w, this.h);
    this.ct.putImageData(data, 0, 0);
  }

  background(color = '#000000') {
    this.ct.fillStyle = color;
    this.ct.fillRect(0, 0, this.w, this.h);
  }

  outline() {
    this.ct.strokeStyle = 'black';
    this.ct.strokeRect(0, 0, this.w, this.h);
  }

  fullScr(color) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.ct.fillStyle = color;
    this.ct.fillRect(0, 0, this.w, this.h);
  }

  aim(x, y) {
    this.angle = Draw.acos([this.x, this.y, x, y]);
  }

  walk(paceX, paceY) {
    this.x += paceX;
    this.y += paceY;
  }

  rotate(x, y, z, a) {
    this.st.transform = `rotate3d(${x}, ${y}, ${z}, ${a}deg)`;
  }

  matrix(i) {
    this.st.transform = `matrix3d(${i[0]}, ${i[1]}, ${i[2]}, ${i[3]}, ${i[4]}, ${i[5]},
          ${i[6]}, ${i[7]}, ${i[8]}, ${i[9]}, ${i[10]}, ${i[11]}, ${i[12]}, ${i[13]}, ${i[14]},
          ${i[15]}, ${i[16]})`;
  }

  /** sp = {range: a, speed: b} */
  rotateAround({
    sp = { start: 0, end: Infinity, speed: 10 },
    rtt = { x: 1, y: 1, z: 0 },
    al,
    r,
    ef = { x: 90, y: 0 },
  }) {
    this.st.display = 'block';
    const w = this.width;
    const h = this.height;
    const { x } = this;
    const { y } = this;
    let i = sp.start;

    run(() => {
      if (sp.end > i) i += 1;
      if (sp.end < i) i -= 1;

      const z = Draw.sin(0, i - 90 + al, 1);
      this.width = (w - (r * 3) / 5) + (z * r * 6) / 5;
      this.height = (h - (r * 3) / 5) + (z * r * 6) / 5;
      this.rotate(rtt.x, rtt.y, rtt.z, i);
      this.x = Draw.cos(x - (r * 6) / 5 - (z * r * 3) / 5, i + ef.x + al, r);
      this.y = Draw.sin(y - (r * 6) / 5 - (z * r * 3) / 5, i + ef.y + al, r);
      return i === sp.end;
    }, sp.speed);
  }

  absPos(x, y) {
    if (typeof x === 'number' && typeof y === 'number') {
      this.st.position = 'absolute';
      this.x = x;
      this.y = y;
    }
  }

  display(node = document.body) {
    node.appendChild(this.view);
  }

  delete() {
    this.#path = [];
    this.#pathh = [];
    this.#toCenter_x = 0;
    this.#toCenter_y = 0;
    this.hide();
  }

  #clear(imageData) {
    const dataToClear = CvTools.gradeData(imageData);
    const data = CvTools.gradeData(this.ct.getImageData(0, 0, this.w, this.h));
    dataToClear.forEach((value, i) => value.forEach((v, j) => {
      if (v.R || v.G || v.B) {
        data[i][j].A = 0;
      }
    }));
    const newData = this.ct.createImageData(this.w, this.h);
    this.hide();
    CvTools.switchData(data, newData, 'from');
    this.ct.putImageData(newData, 0, 0);
  }

  begin() { this.ct.beginPath(); }

  line(v, cl = true) {
    this.ct.moveTo(v[0], v[1]);
    for (let i = 2; i < v.length; i += 2) {
      this.ct.lineTo(v[i], v[i + 1]);
    }
    if (cl) this.ct.closePath();
  }

  static lineOut(ctx, v, cl = true) {
    ctx.moveTo(v[0], v[1]);
    for (let i = 2; i < v.length; i += 2) {
      ctx.lineTo(v[i], v[i + 1]);
    }
    if (cl) ctx.closePath();
  }

  gradient(x0, y0, x1, y1, p = [], c = []) {
    const x = this.#toCenter_x - this.margin;
    const y = this.#toCenter_y - this.margin;
    const grad = this.ct.createLinearGradient(
      x0 - x,
      y0 - y,
      x1 - x,
      y1 - y,
    );
    while (c.length < p.length) c.push('#000000');
    for (let i = 0; i < p.length; i += 1) {
      grad.addColorStop(p[i], c[i]);
    }
    return grad;
  }

  deb() {
    console.log(`center_x: ${this.#toCenter_x}`, `center_y: ${this.#toCenter_y}`);
    console.log(this.#getXY().y - this.#toCenter_y);
    console.log(this.angle);
    console.log(this.#path);
    console.log(this.#pathh);
  }

  #centralizer() {
    let [x, y, w, h] = [0, 0, 0, 0];
    const m = this.margin;
    let a = 2;
    while (a--) {
      this.#pathh.forEach((item, i) => {
        const vect = [];
        item.vetor.forEach((value) => {
          // eslint-disable-next-line array-callback-return, consistent-return
          const k = value.map((v, ind) => {
            if (!(ind % 2)) {
              if (a && v < x) x = v;
              if (a && v > w) w = v;
              if (!a) return v - x + m;
            }
            if (ind % 2) {
              if (a && v < y) y = v;
              if (a && v > h) h = v;
              if (!a) return v - y + m;
            }
          });
          if (!a) vect.push(k);
        });
        if (!a) this.#path[i].vetor = vect;
      });
    }
    if (this.#toCenter_x > x - m) this.#toCenter_x = x - m;
    if (this.#toCenter_y > y - m) this.#toCenter_y = y - m;
    this.hide();
    this.absPos(this.x, this.y);
    this.w = w - this.#toCenter_x + m;
    this.h = h - this.#toCenter_y + m;
    for (const v of this.#path) {
      this.#printt(v.vetor, v.fill, v.stk, v.close, v.clear);
    }
  }

  /** fill {c: color, n: evenodd [bool]}, stk {c: color, l: lineWidth} */
  print(f = [[]], fill = { c: '#303080', n: true }, stk = false, close = true, clear = false) {
    const vetor = f.map((v) => [...v]);
    this.#pathh.push({
      vetor, fill, stk, close, clear,
    });
    this.#path.push({
      vetor, fill, stk, close, clear,
    });
    this.#centralizer();
  }

  #printt(f, fill, stk, close, clear) {
    if (clear) {
      const canvas = document.createElement('canvas');
      canvas.width = this.w;
      canvas.height = this.h;
      const ct = canvas.getContext('2d');
      CvTools.printOut(ct, f, fill, stk, close);
      const dataToClear = ct.getImageData(0, 0, this.w, this.h);
      this.#clear(dataToClear);
      return;
    }

    this.begin();

    for (const item of f) this.line(item, close);

    if (fill) {
      this.ct.fillStyle = fill.c;
      const n = fill.n ? 'evenodd' : 'nonzero';
      this.ct.fill(n);
    }

    if (stk) {
      this.ct.strokeStyle = stk.c;
      this.ct.lineWidth = stk.l;
      this.ct.stroke();
    }
  }

  static printOut(ctx, f, fill, stk = false, close = true) {
    ctx.beginPath();
    for (const item of f) CvTools.lineOut(ctx, item, close);

    if (fill) {
      ctx.fillStyle = fill.c;
      const n = fill.n ? 'evenodd' : 'nonzero';
      ctx.fill(n);
    }

    if (stk) {
      ctx.strokeStyle = stk.c;
      ctx.lineWidth = stk.l;
      ctx.stroke();
    }
  }
}
