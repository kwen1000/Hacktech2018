const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Marvel = require("marvel");
const marvel = new Marvel({
    publicKey: "950c503e8f9d783b47f8c70528ebdfd4",
    privateKey: "14a75a4e4221351a6cb34fee73e444063ff739af"
});

// Load our custom classes
const CustomerStore = require('./static/js/customerStore.js');
const MessageRouter = require('./static/js/messageRouter.js');

// Load and instantiate the API.AI client library
const ApiAi = require('apiai');
const caAi = ApiAi("3fcf64e31b24457c8cd73c48fa7c7d7a");
const imAi = ApiAi("005cbf79d6bd497d926eed400ab6a23e");

// Instantiate our app
const customerStore = new CustomerStore();
const caChatRouter = new MessageRouter(customerStore, caAi, io.of('/cachat'), io.of('/operator'));
const imChatRouter = new MessageRouter(customerStore, imAi, io.of('/imchat'), io.of('/operator'));
const translate = require("./translate");

// // Serve static html files for the customer and operator clients
app.get('/imchat', (req, res) => {
  res.sendFile(`${__dirname}/static/imchat.html`);
});

app.get('/cachat', (req, res) => {
  res.sendFile(`${__dirname}/static/cachat.html`);
});

app.get('/operator', (req, res) => {
  res.sendFile(`${__dirname}/static/operator.html`);
});


caChatRouter.handleConnections();
imChatRouter.handleConnections();

app.set("port", process.env.PORT);
app.use(express.static("static/"));

app.get("/img_list", (req, res) => {
    const words = JSON.parse(req.query.words);
    let data = [];
    marvel.characters.get((err, result) => {
        // for(const author of result) {
        //     for(const word of words) {
        //         // Hacky fix for TypeError: Cannot read property 'toLowerCase' of null
        //         if(!word) {
        //             break;
        //         }
        //         if(author.description.toLowerCase().includes(word.toLowerCase())) {
        //             data.push(author);
        //             break;
        //         }
        //     }
        // }
        res.status(200).json(result);
    });
});

app.get("/translate_message", (req, res) => {
    translate.translateText(req.query.message, req.query.lang)
        .then(data => {
            res.status(200).json({message: data[0]});
        })
        .catch(err => {
            console.log(err);
        });
});

http.listen(app.get("port"), () => console.log("Server is listening"));