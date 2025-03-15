const poll = {
    expire: {
        enabled: false,
        expireDateTime: null,
    },
    allowReplies: true,
    questions: {
        1: {
            question: null,
            multipleChoice: false,
            options: {
                1: null,
                2: null,
            }
        }
    }
};

for (const questionKey in poll.questions) {
    const options = poll.questions[questionKey];

    for (const optionKey in options.options) {
        if (!options.hasOwnProperty('votes')) {
            options.votes = {};
        }

        if (!options.hasOwnProperty('voters')) {
            options.voters = {};
        }

        options.votes[optionKey] = 0;
        options.voters[optionKey] = [];
    }
}

console.log(poll);