async function asyncPipe(tasks, accumulator) {
    return tasks.reduce((a, c) => {
        return a.then(c)
    }, Promise.resolve(accumulator));
}

module.exports = { asyncPipe };