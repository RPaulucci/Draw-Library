Eu decidi criar o módulo CVtools.js para facilitar o trabalho ao desenhar utilizando canvas em contexto 2D com JavaScript. Esse módulo desenha formas geométricas com facilidade utilizando coordenadas [x, y]. assim percebi a necessidade de outro módulo para a criação dessas coordenadas. Por isso, em paralelo a esse módulo implementei o RppDraw.js (RPP são apenas as iniciais do meu nome) que contém funções que devolvem um Array de números que devem ser considerados como x e y de uma coordenada sequenciados. Ex: [x, y, x, y, x, y].