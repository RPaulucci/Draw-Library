/** Classe responsável por mapear coordenadas usando hash tables */

export default class HashCoordenates {
  #hash;

  #vetorX;

  #vetorY;

  #amount;

  constructor() {
    this.#hash = {};
    this.#vetorX = [];
    this.#vetorY = [];
    this.#amount = 0;
  }

  // Total de itens na tabela.
  get amount() { return this.#amount; }

  // Adicona um item na tabela.
  add(x, y) {
    this.#vetorX.push(Math.round(x));
    this.#vetorY.push(Math.round(y));

    const hx = `x_${x.toFixed()}`;
    const hy = `y_${y.toFixed()}`;

    if (!this.#hash[hx]) this.#hash[hx] = {};
    if (this.#hash[hx][hy]) return this.#hash[hx][hy];

    const info = {};

    Object.defineProperties(info, {
      x: {
        value: Math.round(x),
        writable: false,
        enumerable: false,
        configurable: false,
      },
      y: {
        value: Math.round(y),
        writable: false,
        enumerable: false,
        configurable: false,
      },
      index: {
        value: this.#amount,
        writable: false,
        enumerable: false,
        configurable: false,
      },
      content: {
        value: null,
        writable: true,
        enumerable: false,
        configurable: false,
      },
    });

    this.#hash[hx][hy] = info;
    this.#amount += 1;

    return info;
  }

  // Adiciona toda as coodenadas de um vetor na tabela.
  addVetor(vetor) {
    vetor.forEach((v, i) => {
      if (i % 2) this.add(vetor[i - 1], v);
    });
  }

  // Busca uma coodenada especifica.
  search(x, y) {
    const hx = `x_${x.toFixed()}`;
    const hy = `y_${y.toFixed()}`;

    if (this.#hash[hx] && this.#hash[hx][hy]) return this.#hash[hx][hy];
    return null;
  }

  deleteTable() { this.#hash = {}; }

  show() { console.log(this.#hash); }
}
