const {promisify} = require("util");
const Marvel = require("marvel");
const marvel = new Marvel({
    publicKey: "950c503e8f9d783b47f8c70528ebdfd4",
    privateKey: "14a75a4e4221351a6cb34fee73e444063ff739af"
});
const getCharacters = promisify(marvel.characters.get);

module.exports = async () => {
    try {
        const characters = await getCharacters();
        console.log(characters);
    }
    catch(e) {
        console.error(e);
    }
};