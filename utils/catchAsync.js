// since module.exports is a function you can just have it equal a function
// the function excepts a funcation called func
// you return a function that excepts a function than it executes a function that catches any errors
// than goes to next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

