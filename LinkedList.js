export default class LinkedList {
  #list;

  #start;

  #current;

  #end;

  #amount;

  #prot;

  constructor() {
    this.#list = {};
    this.#start = null;
    this.#current = null;
    this.#end = null;
    this.#amount = 0;
    this.#definePrototype();
  }

  get amount() { return this.#amount; }

  start() { this.#current = this.#start; }

  end() { this.#current = this.#end; }

  getStart() { return this.#start.content; }

  current() { return this.#current.content; }

  getEnd() { return this.#end.content; }

  // Avança 1 item na lista. (Em current)
  next() {
    if (!this.#current.next) return false;
    this.#current = this.#current.next;
    return true;
  }

  // Retorna 1 item na lista. (em current)
  previous() {
    if (!this.#current.previous) return false;
    this.#current = this.#current.previous;
    return true;
  }

  // Prototipo do objeto container para usar menos memoria
  #definePrototype() {
    const prot = {
      findByIndex(index) {
        if (typeof index !== 'number') return new Error('index is not a number.');
        if (index < 0) return new Error('Invalid index');

        index = Math.floor(index);
        if (index === this.index) return this;
        if (!this.next) return null;
        return this.next.findByIndex(index);
      },
      findByKey(key, value) {
        if (typeof key !== 'string') return new Error('key is not a string');
        if (value === undefined) return new Error('value is undefined.');

        if (!this.next) return null;
        if (this.content[key] === undefined) return new Error('Invalid key.');

        if (this.content[key] === value) return this;
        return this.next.findByKey(key, value);
      },
      indexAdjust(value) {
        this.index += value;
        if (this.next) this.next.indexAdjust(value);
      },
    };

    this.#prot = prot;
  }

  // Definição das propriedades do objeto container.
  #defineProperties(item) {
    const container = {};

    Object.defineProperties(container, {
      index: {
        value: null,
        writable: true,
        enumerable: true,
        configurable: false,
      },
      next: {
        value: null,
        writable: true,
        enumerable: true,
        configurable: false,
      },
      previous: {
        value: null,
        writable: true,
        enumerable: true,
        configurable: false,
      },
      content: {
        value: item,
        writable: true,
        enumerable: true,
        configurable: false,
      },
    });
    Object.setPrototypeOf(container, this.#prot);
    return container;
  }

  // Adiciona 1 item na lista em um lugar especifico.
  add(item, index = this.#amount) {
    if (!(typeof item === 'object')) return new Error('item is not a object.');

    const container = this.#defineProperties(item);
    container.index = index;
    this.#amount += 1;

    if (!this.#end) {
      this.#start = container;
      this.#current = container;
      this.#end = container;
      return true;
    }

    this.findByIndex(index);
    if (!this.#current) {
      this.#end.next = container;
      container.previous = this.#end;
      this.#end = container;
      this.#current = container;
      return true;
    }

    const current = this.#current;

    if (current.previous) current.previous.next = container;
    container.next = current;
    this.#current = container;
    container.next.indexAdjust(+1);
    return true;
  }

  // Remove 1 item da lista em um lugar específico.
  remove({ key = null, value = null, index = null }) {
    if (!this.#start) return;
    if (index) this.findByIndex(index);
    else this.findByKey(key, value);

    const container = this.#current;

    const { previous } = container;
    previous.next = container.next;
    container.next.indexAdjust(-1);
    container.previous = null;
    container.next = null;
    this.#amount -= 1;
  }

  // Busca 1 item pelo index.
  findByIndex(index) {
    const container = this.#start.findByIndex(index);
    this.#current = container;
    if (!container) return null;
    return container.content;
  }

  // Busca um item pela chave.
  findByKey(key, value) {
    const container = this.#start.findByKey(key, value);
    this.#current = container;
    if (!container) return null;
    return container.content;
  }

  show() {
    console.log(this.#start);
    console.log(this.#current);
    console.log(this.#end);
  }
}
