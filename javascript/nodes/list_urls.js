const Node = require('../nodes');

async function listUrls(state) {
    console.log("\n--- URLs ---");
    state.urls.forEach(url => console.log(url));
    console.log("------------");
    return [state, Node.PROMPT_OPTIONS];
}

module.exports = listUrls;

