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

    const info = { x: Math.round(x), y: Math.round(y) };

    const hx = `x_${x.toFixed()}`;
    const hy = `y_${y.toFixed()}`;

    if (!this.#hash[hx]) this.#hash[hx] = {};
    if (this.#hash[hx][hy]) return null;
    this.#hash[hx][hy] = info;
    this.#amount += 1;

    return info;
  }

  // Adiciona toda as coodenadas de um vetor na tabela.
  addVetor(vetor) {
    vetor.forEach((v, i) => {
      if (i % 2) {
        const info = this.add(vetor[i - 1], v);
        info.index = i - 1;
      }
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
}
