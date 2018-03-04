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
const apiAiApp = ApiAi("005cbf79d6bd497d926eed400ab6a23e");

// Instantiate our app
const customerStore = new CustomerStore();
const messageRouter = new MessageRouter(customerStore, apiAiApp, io.of('/chat'), io.of('/operator'));
const translate = require("./translate");

messageRouter.handleConnections();
    
app.set("port", process.env.PORT);
app.use(express.static("static/"));

app.get("/img_list", (req, res) => {
    const words = JSON.parse(req.query.words);
    console.log(words);
    let data = [];
    console.log('/img_list !!!')
    marvel.characters.get((err, data) => {
        console.log(data);
        for(const author of data) {
            for(const word of words) {
                if(author.description.toLowerCase().includes(word.toLowerCase())) {
                    data.push(author);
                    break;
                }
            }
        }
        console.log(typeof data)
        res.status(200).json(data);
    });
});

app.get("/translate_message", (req, res) => {
    translate.translateText(req.query.message, "es")
        .then(data => {
            res.status(200).json({message: data[0]});
        })
        .catch(err => {
            console.log(err);
        });
});

http.listen(app.get("port"), () => console.log("Server is listening"));