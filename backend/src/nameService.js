module.exports = ((request) => {
    function getAmount(value, defaultValue) {
        return (typeof value === 'number' && value > 0) ? value : defaultValue;
    }

    return {
        getRandomNames: (amount) => {
            const url = 'http://uinames.com/api/?region=United States&amount=' + getAmount(amount, 10);
            return request(url)
                .then((rawData) => JSON.parse(rawData))
                .then((data) => Array.isArray(data) ? data : [data])
                .then((names) => names.map((nameObj) => nameObj.name));
        }
    }
})(require('request-promise-native'));
