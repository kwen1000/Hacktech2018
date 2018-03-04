const Marvel = require("marvel");
const marvel = new Marvel({
    publicKey: "950c503e8f9d783b47f8c70528ebdfd4",
    privateKey: "14a75a4e4221351a6cb34fee73e444063ff739af"
});

const keyword = "revenge";
marvel.characters.get((err, data) => {
    let results = [];
    data.forEach(character => {
        if(character.description.toLowerCase().includes(keyword)) {
            results.push(character);
        }
    });
    console.log(results);
    // console.log(data);
});