async function listUrls(state) {
    console.log("\n--- URLs ---");
    state.urls.forEach(url => console.log(url));
    console.log("------------");
    return state;
}

module.exports = listUrls;

