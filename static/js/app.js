// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Load third party dependencies
const app = require('express')();
const http = require('http').Server(app);
const io1 = require('socket.io')(http);
const io2 = require('socket.io')(http);

// Load our custom classes
const CustomerStore = require('./customerStore.js');
const MessageRouter = require('./messageRouter.js');

// Load and instantiate the API.AI client library
const ApiAi = require('apiai');
const apiAiApp1 = ApiAi("005cbf79d6bd497d926eed400ab6a23e");
const apiAiApp2 = ApiAi("3fcf64e31b24457c8cd73c48fa7c7d7a");

// Instantiate our app
const customerStore = new CustomerStore();
const messageRouter1 = new MessageRouter(customerStore, apiAiApp1, io1.of('/imchat'), io1.of('/operator'));
const messageRouter2 = new MessageRouter(customerStore, apiAiApp2, io2.of('/cachat'), io2.of('/operator'));

// Serve static html files for the customer and operator clients
app.get('/imchat', (req, res) => {
  res.sendFile(`${__dirname}/static/imchat.html`);
});

app.get('/cachat', (req, res) => {
  res.sendFile(`${__dirname}/static/cachat.html`);
});

app.get('/operator', (req, res) => {
  res.sendFile(`${__dirname}/static/operator.html`);
});

// app.get('/operator2', (req, res) => {
//   res.sendFile(`${__dirname}/static/operator.html`);
// });

// Begin responding to websocket and http requests
messageRouter1.handleConnections();
messageRouter2.handleConnections();
console.log("Both message routers handling connections");
http.listen(process.env.PORT, () => {
  console.log('Listening on *:8080');
});


