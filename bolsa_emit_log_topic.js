#!/usr/bin/env node
function enviaTransacao (key, msg){
  // AMQP
  var amqp = require('amqplib/callback_api');

  // Abrir conexão AMQP
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'BROKER';

      channel.assertExchange(exchange, 'topic', {
        durable: false
      });
      channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent %s:'%s'", key, msg);
    });
  });
}

// Exportar modulo
module.exports = enviaTransacao;
