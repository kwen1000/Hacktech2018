const express = require("express");
const app = express();
const Marvel = require("marvel");
const marvel = new Marvel({
    publicKey: "950c503e8f9d783b47f8c70528ebdfd4",
    privateKey: "14a75a4e4221351a6cb34fee73e444063ff739af"
});

app.set("port", process.env.PORT);
app.use(express.static("static/"));

app.get("/img_list", (req, res) => {
    marvel.characters.get((err, data) => {
        let urls = [];
        data.forEach(({img}) => {
            urls.push(img.path + "." + img.extension);
        });
        res.status(200).json(urls);
    });
});

app.listen(app.get("port"), () => {
    console.log("Server is listening");
});