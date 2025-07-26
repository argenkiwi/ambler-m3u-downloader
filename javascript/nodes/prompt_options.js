const Node = {
    CHECK_M3U_FILE: 1,
    READ_M3U_FILE: 2,
    PROMPT_OPTIONS: 3,
    LIST_URLS: 4,
    RESOLVE_URLS: 5,
    SAVE_M3U_FILE: 6,
    DOWNLOAD_FILES: 7,
};

async function promptOptions(state, rl) {
    const hasKhinsiderUrls = state.urls.some(url => url.startsWith("https://downloads.khinsider.com/game-soundtracks"));

    let options = [
        { name: "List URLs", value: Node.LIST_URLS },
        { name: "Quit", value: null }
    ];

    if (hasKhinsiderUrls) {
        options.splice(1, 0, { name: "Resolve Khinsider URLs", value: Node.RESOLVE_URLS });
    } else {
        options.splice(1, 0, { name: "Download Files", value: Node.DOWNLOAD_FILES });
    }

    console.log("\nWhat would you like to do?");
    options.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}`);
    });

    let choice;
    while (true) {
        choice = await new Promise(resolve => {
            rl.question("Enter your choice: ", answer => {
                resolve(parseInt(answer));
            });
        });

        if (choice > 0 && choice <= options.length) {
            break;
        } else {
            console.log("Invalid choice. Please try again.");
        }
    }

    return [state, options[choice - 1].value];
}

module.exports = promptOptions;
