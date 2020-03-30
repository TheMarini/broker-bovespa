#!/usr/bin/env node

// AMQP
var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_topic.js <facility>.<severity>");
  process.exit(1);
}

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

    var queue = 'BROKER';
    channel.assertQueue(queue, {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

      args.forEach(function(key) {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content);
      }, {
        noAck: true
      });
    });
  });
});
