const nameService = require('./nameService');

nameService.getRandomNames(3).then(
    (names) => console.log(names),
    (error) => console.log(error)
);