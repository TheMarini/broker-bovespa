const moment = require ('moment');
const enviaTransacao = require('./bolsa_emit_log_topic.js')

class Livro {
  constructor() {
    this.venda = [];
    this.compra = [];
  }

  adicionaOrdem(sentido, obj) {
    if (sentido == "compra")
      this.preencheCompra(obj)
    else
      this.preencheVenda(obj)

    console.log("Compra -", this.compra)
    console.log("Venda - ", this.venda)
    return obj;
  }

  preencheCompra(elementoCompra) {
    let ocorreuTransacao = false;
    let indexVendaCompativel;
    for (let i = 0; i < this.venda.length; i++) {
      //  VERIFICA O ARRAY VENDA PARA CASO HAJA TRANSAÇÃO
      if (this.venda[i].ativo == elementoCompra.ativo) {

        //PRECO COMPATIVEL
        if (this.venda[i].val <= elementoCompra.val) {
          ocorreuTransacao = true;
          indexVendaCompativel = i;
          break;
        }
      }
    }

    if (ocorreuTransacao) {
      let result = elementoCompra.quant - this.venda[indexVendaCompativel].quant
      //se sobrou ordem de compra a função é chamada de novo
      if (result > 0) {
        elementoCompra.quant = result
        this.preencheCompra(elementoCompra)
      } else if (result == 0) {
        this.venda.splice(indexVendaCompativel, 1)
      } else if (result < 0) { //se o resultado é menor que 0, resta venda e o valor é atualizado
        this.venda[indexVendaCompativel].quant = result * -1
      }
      console.log(JSON.stringify(elementoCompra))
      enviaTransacao("transacao." + elementoCompra.ativo, "data: " + moment().format('MMMM Do YYYY, h:mm:ss a') + " " + JSON.stringify(elementoCompra));
    } else {
      this.compra.push(elementoCompra)
    }
  }

  preencheVenda(elementoVenda) {
    let ocorreuTransacao = false;
    let indexCompraCompativel;
    //  VERIFICA O ARRAY COMPRA PARA CASO HAJA TRANSAÇÃO
    for (let i = 0; i < this.compra.length; i++) {
      if (this.compra[i].ativo == elementoVenda.ativo) {
        //PRECO COMPATIVEL
        if (this.compra[i].val <= elementoVenda.val) {
          ocorreuTransacao = true;
          indexCompraCompativel = i;
          break;
        }
      }
    }

    if (ocorreuTransacao) {
      let result = elementoVenda.quant - this.compra[indexCompraCompativel].quant

      if (result > 0) { //se sobrou ordem de venda a função é chamada de novo
        elementoVenda.quant = result
        this.preencheVenda(elementoVenda)
      } else if (result == 0) {
        this.compra.splice(indexCompraCompativel, 1)
      } else if (result < 0) { //se o resultado é menor que 0, resta compra e o valor é atualizado
        this.compra[indexCompraCompativel].quant = result * -1
      }
      console.log(JSON.stringify(elementoVenda))
      enviaTransacao("transacao." + elementoVenda.ativo, "data: " + moment().format('MMMM Do YYYY, h:mm:ss a') + " " +JSON.stringify(elementoVenda));
    } else {
      this.venda.push(elementoVenda)
    }
  }
}

// Exportar modulo
module.exports = Livro;
