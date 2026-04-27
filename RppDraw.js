export default class RppDraw {
  static get FI() { return (1 + Math.sqrt(5)) / 2; }

  static fibonacci() {
    function* a() {
      let res = 1;
      let acc = 0;

      while (1) {
        const result = res + acc;
        acc = res;
        res = result;
        yield result;
      }
    }
    return a();
  }

  static rand(min, max) {
    return Math.floor(min + Math.random() * (max - min) + 0.99);
  }

  static cos(x, angle, radius = 1) {
    return x + Math.cos((angle * Math.PI) / 180) * radius;
  }

  static sin(y, angle, radius = 1) {
    return y + Math.sin((angle * Math.PI) / 180) * radius;
  }

  static hipXY(ax, ay, bx, by) {
    return Math.sqrt(Math.abs(ax - bx) ** 2
                  + Math.abs(ay - by) ** 2);
  }

  /** z = [x, y, x, y] */
  static acos(z) {
    if (z.length < 4) return -1;
    let s = -1; let
      n = 180;

    if (z[1] - z[3] <= 0) {
      s = 1;
      n = 0;
    }
    const hip = RppDraw.hipXY(z[0], z[1], z[2], z[3]);
    const cat = (z[2] - z[0]) * s;
    return Math.acos(cat / hip) * (180 / Math.PI) + n;
  }

  static midiAngle(z) {
    if (z.length !== 6) return false;

    const a = RppDraw.acos([z[2], z[3], z[0], z[1]]);
    const b = RppDraw.acos([z[2], z[3], z[4], z[5]]);
    console.log(z);

    let c;
    if (c = Math.abs(a - b) === 180 || c === 0) return -1;
    return [a, b];
  }

  // Extrai as coordenadas x de um array. return Number[].
  static vetorX(vetor) {
    const f = [];
    vetor.forEach((v, i) => (!(i % 2) ? f.push(v) : 0));
    return f;
  }

  // Extrai as coordenadas y de um array. return Number[].
  static vetorY(vetor) {
    const f = [];
    vetor.forEach((v, i) => ((i % 2) ? f.push(v) : 0));
    return f;
  }

  // Extrai os pontos máximos, mínimos e médio de um array.
  // return Object{ max: { x, y }, min: { x, y }, mid: { x, y } }.
  static interPoints(vetor) {
    const min = [];
    const mid = [];
    const max = [];

    const vetorX = RppDraw.vetorX(vetor);
    const vetorY = RppDraw.vetorY(vetor);

    min.push(vetorX.sort((a, b) => a - b).shift());
    min.push(vetorY.sort((a, b) => a - b).shift());
    max.push(vetorX.pop());
    max.push(vetorY.pop());
    mid.push(min[0] + (Math.abs(max[0] - min[0]) / 2));
    mid.push(min[1] + (Math.abs(max[1] - min[1]) / 2));

    return { min, mid, max };
  }

  static aurea(s, n, ang = 0) {
    let a; let
      b;
    const v = [];
    v.push(
      a = RppDraw.cos(0, ang, RppDraw.FI * s),
      b = RppDraw.sin(0, ang, s),
    );
    for (let i = 0; i < n * 2; i += 2) {
      const calcX = RppDraw.cos(
        0,
        45 * i - 90 + ang,
        Math.abs(a) + Math.abs(b),
      );
      const calcY = RppDraw.sin(
        0,
        45 * i - 90 + ang,
        Math.abs(a) + Math.abs(b),
      );
      const x = v[i] + calcX;
      const y = v[i + 1] + calcY;
      a = Math.abs(v[i]) + Math.abs(calcX);
      b = Math.abs(v[i + 1]) + Math.abs(calcY);
      console.log(a, b);
      v.push(x, y);
    }
    return v;
  }

  static poligon(x, y, side, radius, angle = 0) {
    const vetor = [];
    for (let i = 0; i < side; i += 1) {
      const n = (360 / side) * i + angle;
      const px = RppDraw.cos(x, n, radius);
      const py = RppDraw.sin(y, n, radius);
      vetor.push(px, py);
    }
    return vetor;
  }

  static newFig({
    x = 0, y = 0, s = 4, l = s, w, h = w, cr = [1],
    rp = 0, intAng = 0, extAng = 0, rand = 0,
  }) {
    const vetor = [0];
    vetor.coord = [];
    vetor.pop();
    let [j, sn] = [0, 1];
    for (let i = 0; i < Math.abs(l); i += 1) {
      const n = Math.random() * rand;
      j += 1;
      if (cr[j % cr.length]) {
        const co = RppDraw.cos(x, (i * 360) / s + intAng, w * cr[j % cr.length] + n);
        const ca = RppDraw.sin(y, (i * 360) / s + intAng, h * cr[j % cr.length] + n);
        const hip = RppDraw.hipXY(x, y, co, ca);
        const ang = RppDraw.acos([x, y, co, ca]);
        const xi = RppDraw.cos(x, ang + extAng, hip);
        const yi = RppDraw.sin(y, ang + extAng, hip);
        vetor.push(xi, yi);
        vetor.coord.push({ x: xi, y: yi, angle: ang + extAng });
      }

      if (rp && sn && !((i + 1) % rp)) {
        i -= 1;
        sn = 0;
      } else sn = 1;
    }
    return vetor;
  }

  static pizzaSlice({
    x, y, s, minRadius, maxRadius, angle = 0,
  }) {
    const ap = 360 / s;
    const ang = angle - ap / 2;

    const intAng = ang;
    const vetor1 = RppDraw.newFig({
      x, y, s, w: maxRadius, intAng, l: 2,
    });
    const v = RppDraw.newFig({
      x, y, s, w: minRadius, intAng, l: 2,
    });
    vetor1.push(v[2], v[3], v[0], v[1]);

    return vetor1;
  }

  // Desenha uma 'fatia de pizza' a partir de um eixo x, y.
  static arcArea({
    x, y, s, n = 1, minRadius, maxRadius, space, angle = 0,
  }) {
    const ap = 360 / s;
    const ang = angle + ap / 2;

    const vetor = [];
    for (let i = 0; i < n; i += 1) {
      const intAng = angle + ap * i;
      const vetor1 = RppDraw.newFig({
        x, y, s, w: maxRadius, intAng, l: 2,
      });
      const v = RppDraw.newFig({
        x, y, s, w: minRadius, intAng, l: 2,
      });
      vetor1.push(v[2], v[3], v[0], v[1]);

      const px = RppDraw.cos(0, ang + ap * i, space);
      const py = RppDraw.sin(0, ang + ap * i, space);
      const vetor2 = RppDraw.shift(vetor1, px, py);

      const a1 = RppDraw.acos([x, y, vetor2[0], vetor2[1]]);
      const a2 = RppDraw.acos([x, y, vetor2[2], vetor2[3]]);
      let a = Math.abs(a1 - a2);
      if (a > 180) a = Math.abs(a - 360);

      const a3 = RppDraw.acos([x, y, vetor2[4], vetor2[5]]);
      const a4 = RppDraw.acos([x, y, vetor2[6], vetor2[7]]);
      let b = Math.abs(a3 - a4);
      if (b > 180) b = Math.abs(b - 360);
      const vetor3 = RppDraw.arcToPoints(vetor2, [a, 0, -b, 0]);
      vetor.push(vetor3);
    }

    return vetor;
  }

  // Arrasta o array xpx na horizontal e ypx na vertical
  static shift(vetor, x, y) {
    const f = vetor.map((v, i) => {
      if (i % 2) return v + y;
      return v + x;
    });
    return f;
  }

  // Arrasta o array em um angulo por px pixels.
  static shiftAngle(vetor, angle, px) {
    const vetor1 = [];
    vetor.forEach((v, i) => {
      if (!(i % 2)) {
        const a = RppDraw.pace({
          x: v, y: vetor[i + 1], w: px, a: angle,
        });
        vetor1.push(...a);
      }
    });
    return vetor1;
  }

  // Gira o array em um eixo determinado(x, y).
  static turnPx(vetor, x, y, angle) {
    const vetorX = RppDraw.vetorX(vetor);
    const vetorY = RppDraw.vetorY(vetor);
    const minx = vetorX.sort((a, b) => a - b).shift();
    const miny = vetorY.sort((a, b) => a - b).shift();
    const { mid } = RppDraw.interPoints(vetor);

    const px = minx + x;
    const py = miny + y;
    const a = RppDraw.acos([px, py, mid[0], mid[1]]);

    const f = [];
    for (let i = 0; i < vetor.length; i += 2) {
      const ang = RppDraw.acos([px, py, vetor[i], vetor[i + 1]]);
      const hip = RppDraw.hipXY(px, py, vetor[i], vetor[i + 1]);
      const ax = RppDraw.cos(px, ang + angle + (360 - a), hip);
      const ay = RppDraw.sin(py, ang + angle + (360 - a), hip);
      f.push(ax, ay);
    }

    return f;
  }

  static arcToPoints(z, degs = [0]) {
    let vetor = [];
    const v = z;
    v.push(v[0], v[1]);
    for (let i = 0; i < v.length; i += 2) {
      const a = Math.floor(i / 2 + 0.6);
      const b = a % degs.length;
      vetor = vetor.concat(RppDraw.arc(v.slice(i, i + 4), degs[b]));
    }
    return vetor;
  }

  // Cria uma hash table das coodenadas x e y;
  static hashTable(vetor) {
    const vetorTable = {};
    vetor.forEach((v, i) => {
      if (!(i % 2)) {
        const x = v.toFixed();
        const y = vetor[i + 1].toFixed();
        vetorTable[x] = {};
        vetorTable[x][y] = i;
      }
    });
    return vetorTable;
  }

  /**
   * Calcula um fechamento sem ponta.
   * @param {Number} startAngle
   * @param {Number} endAngle
   * @param {Array<Number>} vetor
   * @param {Number} steps
   * @returns {Array<Number>}
   */
  static soft(startAngle, endAngle, vetor, steps = 50, control = 0.8) {
    if (!(vetor instanceof Array)) return new Error('vetor is not a instance of Array.');
    if (vetor.length < 4) return new Error('vetor has fewer than 4 elements.');

    const [x1, y1, x2, y2] = vetor;

    // 1. Calcula a distância em linha reta entre o ponto inicial e final.
    const distance = RppDraw.hipXY(x1, y1, x2, y2);

    // 2. Define a força dos pontos de controle.
    const controlForce = distance * control;

    // 3. Calcula o pont de contrle1: puxa a partir da saida.
    const cx1 = RppDraw.cos(x1, startAngle, controlForce);
    const cy1 = RppDraw.sin(y1, startAngle, controlForce);

    // 4. Calcula o ponto de controle 2: puxa antes da chegada;
    const cx2 = RppDraw.cos(x2, endAngle, -controlForce);
    const cy2 = RppDraw.sin(y2, endAngle, -controlForce);

    const pontosDaCurva = [];

    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const mt = 1 - t;

      const x = (mt ** 3 * x1) + (3 * mt ** 2 * t * cx1)
        + (3 * mt * t ** 2 * cx2) + (t ** 3 * x2);

      const y = (mt ** 3 * y1) + (3 * mt ** 2 * t * cy1)
        + (3 * mt * t ** 2 * cy2) + (t ** 3 * y2);

      pontosDaCurva.push(x, y);
    }
    return pontosDaCurva;
  }

  static chanfer(side, radius, angle, ch, x, y) {
    const vetor = [];
    const z = 360 / side;
    const size = RppDraw.sin(0, z / 2, radius) * 2;

    let za = RppDraw.cos(x, -z / 2 + angle, radius);
    let zb = RppDraw.sin(y, -z / 2 + angle, radius);

    for (let i = 0; i < side; i += 1) {
      const a = RppDraw.cos(0, z * i + 90 + angle, size);
      const b = RppDraw.sin(0, z * i + 90 + angle, size);

      vetor.push(za + a * ch, zb + b * ch);
      vetor.push(za + a * (1 - ch), zb + b * (1 - ch));
      za += a; zb += b;
    }
    return vetor;
  }

  /** Dado 3 pontos [x, y] em um array z, cria um arco de raio r arredondando o ponto central
     *  parametro 'v' inverte o canto */
  static rounder(z, r = 0.2) { //
    if (z.length !== 6) return false;
    let s;

    const angA = RppDraw.acos([z[2], z[3], z[0], z[1]]);
    const angB = RppDraw.acos([z[2], z[3], z[4], z[5]]);
    const sizeA = RppDraw.hipXY(z[2], z[3], z[0], z[1]);
    const sizeB = RppDraw.hipXY(z[2], z[3], z[4], z[5]);
    let midiAngle = (angA + angB) / 2;

    if (Math.abs(midiAngle - angA) === 90) return;
    if (Math.abs(midiAngle - angA) > 90) midiAngle += 180;
    const ang = Math.abs(midiAngle - angA);
    if (sizeA < sizeB) s = sizeA;
    else s = sizeB;

    let a = r;
    if (r < 0) a = 0;

    const x = RppDraw.cos(z[2], midiAngle, a * s);
    const y = RppDraw.sin(z[3], midiAngle, a * s);
    const ri = RppDraw.sin(0, ang, r * s);

    let vetor = RppDraw.rd(
      x,
      y,
      ri,
      midiAngle + 180 - (90 - ang),
      midiAngle + 180 + (90 - ang),
    );

    if (RppDraw.hipXY(z[0], z[1], vetor[0], vetor[1])
        < RppDraw.hipXY(z[0], z[1], vetor[vetor.length - 2], vetor[vetor.length - 1])) {
      vetor.x = x;
      vetor.y = y;
      return vetor;
    }

    vetor = RppDraw.rd(
      x,
      y,
      ri,
      midiAngle + 180 + (90 - ang),
      midiAngle + 180 - (90 - ang),
    );

    vetor.x = x;
    vetor.y = y;
    return vetor;
  }

  /** */
  static figRounder(z, r = [0.2]) {
    let vetor = []; const v = [...z];
    const points = new Array(z.length / 2).fill({});
    v.push(...z.slice(0, 4));
    for (let i = 0; i < z.length; i += 2) {
      const a = Math.floor(i / 2 + 0.6);
      const b = a % r.length;

      if (r[b]) {
        const x = RppDraw.rounder(v.slice(i, i + 6), r[b]);
        points[a] = { x: x.x, y: x.y };
        vetor = vetor.concat(x);
      } else {
        if (i >= v.length - 4) break;
        vetor.push(v[i + 2], v[i + 3]);
      }
    }
    vetor.points = points;
    return vetor;
  }

  static insert(z, func) {
    const vetor = []; console.log(z.nKeys);
    let len = 0;
    for (let i = 0; i < z.nKeys; i += 1) { // substituir constante 5 por variável
      const ind = (i + 1) % z.nKeys;
      const A = z[`pack_${i}_a`];
      const B = z[`pack_${i}_b`];
      const A1 = z[`pack_${ind}_a`];
      vetor.push(...z.slice(A, B + 2));
      if (func) {
        const f = func([z[B], z[B + 1], z[A1], z[A1 + 1]], i);
        len += f.length;
        vetor.push(...f);
        const a = len += z[`pack_${ind}_a`];
        const b = len += z[`pack_${ind}_b`];
        vetor[`pack_${ind}_a`] = a;
        vetor[`pack_${ind}_b`] = b;
      }
    }
    return vetor;
  }

  /** z = [xa, ya, xb, yb] */
  static curve(z, r, d) {
    const [xa, ya, xb, yb] = z;
    const co = RppDraw.hipXY(xa, ya, xb, yb) / 2;
    let ca = Math.sqrt(r ** 2 - co ** 2);
    if (r < 0) ca *= -1;

    let angle = RppDraw.acos([xa, ya, xb, yb]);
    const xp = RppDraw.cos(xa, angle, co);
    const yp = RppDraw.sin(ya, angle, co);

    const centerX = RppDraw.cos(xp, angle + 90, ca);
    const centerY = RppDraw.sin(yp, angle + 90, ca);

    angle = RppDraw.acos([centerX, centerY, xa, ya]);
    const endAngle = RppDraw.acos([centerX, centerY, xb, yb]);
    let n = endAngle - angle;
    if (n < 0) n += 360;

    const vetor = [];
    const radiu = Math.abs(r);
    for (let i = 0; i <= n; i += 1) {
      const a = RppDraw.cos(centerX, angle + i + d, radiu);
      const b = RppDraw.sin(centerY, angle + i, radiu);
      vetor.push(a, b);
    }
    return vetor;
  }

  /** deg don't should have a value next of 360 or -360 */
  static arc(z, deg) {
    if (z.length < 4) return [];
    deg %= 360;

    const direction = RppDraw.acos(z);

    if (deg > 359 || deg < -359 || 1 - Math.abs(deg) > 0) {
      const vetor = z;
      vetor.perimeter = 0;
      vetor.range = 0;
      vetor.startAngle = direction;
      vetor.endAngle = direction;
      return vetor;
    }
    const [xa, ya, xb, yb] = z;
    const angle = -deg / 2 + direction;
    const r = (RppDraw.hipXY(xa, ya, xb, yb) / 2) / RppDraw.sin(0, deg / 2);
    const per = 2 * Math.PI * Math.abs(r);
    const range = (per / 360) * deg;
    const pace = deg / range; let
      t = 1;
    if (deg < 0) t = -1;

    const vetor = [xa, ya];
    let x = RppDraw.cos(xa, angle);
    let y = RppDraw.sin(ya, angle);
    for (let i = 1.48 * pace; i < Math.abs(deg) - pace; i += pace) {
      x = RppDraw.cos(x, angle + i * t);
      y = RppDraw.sin(y, angle + i * t);
      vetor.endAngle = (angle + i * t) % 360;
      vetor.push(x, y);
    }
    vetor.push(xb, yb);
    vetor.perimeter = per;
    vetor.range = range;
    vetor.startAngle = angle;
    return vetor;
  }

  static arcFromAngle(z, angle) {
    const direction = RppDraw.acos(z);
    while (angle < 0) angle += 360;
    while (angle > 360) angle -= 360;
    let deg = ((direction - angle) * 2);
    if (deg > 360) deg = (-360 + direction - angle) * 2;
    if (deg < -360) deg = (360 + direction - angle) * 2;

    return RppDraw.arc(z, deg);
  }

  // Pendente angulos especificos da erro!!!
  static angPerToPer(z, angle) {
    const vetor = [];
    let [n, a] = [0, angle];
    let points = z.slice(0, 4);
    while (n < z.length - 2) {
      const v = RppDraw.arcFromAngle(points, a);
      vetor.push(...v);
      a = v.endAngle;
      n += 2;
      points = z.slice(n, n + 4);
    }
    return vetor;
  }

  static rd(x, y, r, sa, ea) {
    const v = [];
    let d = 1;
    if (ea - sa < 0) d = -1;

    while (ea - sa > 360) ea -= 360;
    while (sa - ea > 360) sa -= 360;

    while (Math.abs(ea - sa) >= 1) {
      const a = RppDraw.cos(x, sa += d, r);
      const b = RppDraw.sin(y, sa, r);
      v.push(a, b);
    }
    return v;
  }

  static figCirc({
    x = 0, y = 0, s = 4, e = 1, l = s, w = 100, cr = [1], shunt = [0], a = 0,
  }) {
    const vetor = [];
    let xi = x; let yi = y; let
      inc = 1;
    for (let i = 0; i < l; i += 1) {
      const ang = (360 / s) * i;
      inc = !(Math.floor(ang / 90) % 2) ? e : 1;
      const b = i % cr.length;
      if (cr[b]) {
        const v = RppDraw.pace({
          x: xi, y: yi, w: w * cr[b] * inc, a: ang + a,
        });
        const bs = i % shunt.length;
        if (shunt[bs]) {
          const m = RppDraw.midPoint([xi, yi, ...v], 0.5);
          const va = RppDraw.pace({
            x: m[0], y: m[1], w: shunt[bs] * w, a: m.angle + 90,
          });
          vetor.push(...va);
        }
        [xi, yi] = v;
        vetor.push(...v);
      }
    }
    return vetor;
  }

  static rect({
    x = 0, y = 0, wa = [], acc = 0, turn = 1,
  }) {
    const vetor = [];
    const accAng = [];
    let a = x; let
      b = y;
    for (let i = 0; i < turn; i += 1) {
      wa.forEach((v, index) => {
        if (typeof v !== 'number') {
          console.error('v is not a number.');
          return;
        }

        if (!i) accAng.push(v);
        else accAng[index] += acc;
        const angle = accAng[index];
        if (index % 2) {
          const fig = RppDraw.pace({
            x: a, y: b, w: wa[index - 1], a: angle,
          });
          [a, b] = fig;
          vetor.push(...fig);
        }
      });
    }
    return vetor;
  }

  /** z = [xa, ya, xb, yb], 0 < p < 1 */
  static midPoint(z, p) {
    if (z.length < 4) {
      console.error('z.length precisa ser maior que 3');
      return;
    }
    if (typeof p !== 'number' || p <= 0 || p >= 1) {
      console.error('Parametro obrigatório: p > 0 e p < 1. Ou "p" não é um number');
      return;
    }
    const [a, b, c, d] = z;
    const width = RppDraw.hipXY(a, b, c, d);
    const ang = RppDraw.acos([a, b, c, d]);
    const point = RppDraw.pace({
      x: a, y: b, w: width * p, a: ang,
    });
    point.angle = ang;
    point.width = width;
    return point;
  }

  static trace(z, p = 1) {
    if (!z || !z.length) { return console.error('z is not a object Array or this array is empyt.'); }

    const vetor = [0];
    vetor.coord = [];
    vetor.pop();
    z.push(z[0], z[1]);
    z.forEach((v, i) => {
      if (i > 1) vetor.push(z[i - 2]);
      if (i % 2 && i > 2) {
        const [a, b, c, d] = z.slice(i - 3, i + 1);
        let e;
        if ((e = RppDraw.hipXY(a, b, c, d)) > 1) {
          const angle = RppDraw.acos(z.slice(i - 3, i + 1));
          let count = 0;
          while (1) { // eslint-disable-line no-constant-condition
            count += p;
            const x = RppDraw.cos(z[i - 3], angle, count);
            const y = RppDraw.sin(z[i - 2], angle, count);
            if (RppDraw.hipXY(a, b, x, y) >= e) break;
            vetor.push(x, y);
            vetor.coord.push({ x, y, a: null });
          }
        }
      }
    });
    z.pop(); z.pop();
    return vetor;
  }

  static pace({
    x = 0, y = 0, w, h = w, a = 0,
  }) {
    const xi = RppDraw.cos(x, a, w);
    const yi = RppDraw.sin(y, a, h);
    return [xi, yi];
  }

  static angularRate({
    x = 0, y = 0, n = 1, w, h, a,
  }) {
    const vetor = [];
    vetor.push(x, y);
    const s = -1;
    let [xa, ya, r] = [x, y, a];
    for (let i = 0; i < n - 1; i += 1) {
      r = i % 2 ? a * s : a;
      const value = RppDraw.pace({
        x: xa, y: ya, w, h, a: r,
      });
      [xa, ya] = value;
      vetor.push(...value);
    }
    return vetor;
  }

  static spreadByAngle({
    x = 0, y = 0, nh, nv, w, h = w, a,
  }) {
    const vetor = [];
    for (let i = 0; i < nv; i += 1) {
      let yi = y + RppDraw.sin(0, a, h) * 2 * i;
      if (!(a % 180)) yi = h * i;
      vetor.push(
        RppDraw.angularRate({
          x, y: yi, n: nh, w, h, a,
        }),
      );
    }
    return vetor;
  }
}
