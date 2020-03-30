# Broker - Bovespa
## :ledger: Documentation
Project proposal and why it exists on [this file](https://github.com/TheMarini/broker-bovespa/blob/master/docs/proposta.pdf) (PT-BR).
## :fire: Installation
By default, this project uses [NPM](https://www.npmjs.com) as depedency/package management.
1. Install dependencies:
```
npm install
```
2. Run:
   - 2.1. Terminal 1 - RabbitMQ docker container:
   ```
   docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```
   - 2.2. Terminal 2 - Bovespa:
   ```
   node ./bolsa_receive_logs_topic.js "#"
   ```
   - 2.3. Terminal 3 - Broker :
   ```
   node ./broker_receive_logs_topic.js "#"
   ```
3. Examples (another terminal):
   - 3.1. PETR4 buy:
   ```
   node ./broker_emit_log_topic.js compra.petr4 "{\"quant\": 100, \"val\": 500, \"corretora\": \"brok1\"}"
   ```
   - 3.2. PETR4 sale:
   ```
   node ./broker_emit_log_topic.js venda.petr4 "{\"quant\": 100, \"val\": 500, \"corretora\": \"brok1\"}"
   ```
## :busts_in_silhouette: Authors
- [Bruno Marini](https://github.com/TheMarini)
- [Nayane Ornelas](https://github.com/soybatata)
