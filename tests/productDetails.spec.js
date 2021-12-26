/* eslint-disable max-len*/
/* eslint-disable no-unused-vars */

const assert = require('assert');
const productDetails = require('../src/productDetails');

/*
  Dadas duas strings que representam nomes de produtos, retorne um array contendo dois objetos com os detalhes dos respectivos produtos.

  Parâmetros:
  - Uma string;
  - Uma string;

  Comportamento:
  productDetails('Alcool gel', 'Máscara') // Retorna:
  [
    {
      name: 'Alcool gel'
      details: {
        productId: 'Alcool gel123'
      }
    },
    {
      name: 'Máscara'
      details: {
        productId: 'Máscara123'
      }
    }
  ]

  OBS: Lembre-se que você não precisa se preocupar com o describe e o it por enquanto, isso será aprendido posteriormente.
*/

describe('#productDetails', () => {
  it('tests the function has the correct behaviour', () => {
    // ESCREVA SEUS TESTES ABAIXO:
    const result = productDetails();
    // Teste que o retorno da função é um array.
    // Reference: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    assert.strictEqual(Array.isArray(result), true);
    // Reference: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/instanceof
    assert.strictEqual(result instanceof Array, true);
    // Teste que o array retornado pela função contém dois itens dentro.
    assert.strictEqual(result.length, 2);
    // Teste que os dois itens dentro do array retornado pela função são objetos.
    assert.strictEqual(result[0] instanceof Object && result[1] instanceof Object, true);
    // Teste que os dois objetos são diferentes entre si.
    assert.strictEqual(result[0] !== result[1], true);
    // (Difícil) Teste que os dois productIds terminam com 123.
    // Reference: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/search
    const pattern = /123$/,
    resultId1 = result[0].details.productId,
    resultId2 = result[0].details.productId,
    resultId1ContainsPattern = resultId1.search(pattern) !== 0,
    resultId2ContainsPattern = resultId2.search(pattern) !== 0;
    assert.strictEqual(resultId1ContainsPattern && resultId2ContainsPattern , true);
  });
});
