const readline = require('readline');

async function promptOptions(state) {
    const hasKhinsiderUrls = state.urls.some(url => url.startsWith("https://downloads.khinsider.com/game-soundtracks"));

    let options = [
        { name: "List URLs", value: 'list' },
        { name: "Quit", value: 'quit' }
    ];

    if (hasKhinsiderUrls) {
        options.splice(1, 0, { name: "Resolve Khinsider URLs", value: 'resolve' });
    } else {
        options.splice(1, 0, { name: "Download Files", value: 'download' });
    }

    console.log("\nWhat would you like to do?");
    options.forEach((option, index) => {
        console.log(`${index + 1}. ${option.name}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
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
    
    rl.close();
    return options[choice - 1].value;
}

module.exports = promptOptions;
