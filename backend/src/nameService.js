module.exports = ((request) => {
    function getAmount(value, defaultValue) {
        return (typeof value === 'number' && value > 0) ? value : defaultValue;
    }
    
    function isNotBlankString(value) {
        return typeof value === 'string' && value.trim() !== '';
    }

    function getPersonName(firstName, lastName) {
        if (isNotBlankString(firstName) && isNotBlankString(lastName)) {
            return `${firstName} ${lastName}`;
        } else {
            throw new Error('First and last name should be not blank.');
        }
    }

    return {
        getRandomNames: (amount) => {
            const url = 'http://uinames.com/api/?region=United States&amount=' + getAmount(amount, 10);
            return request(url)
                .then((rawData) => JSON.parse(rawData))
                .then((data) => Array.isArray(data) ? data : [data])
                .then((names) => names.map((nameObj) => nameObj.name));
        },
        getPersonName: getPersonName,
        getPersonFullName: (firstName, lastName, title) => {
            const personName = getPersonName(firstName, lastName);
            const postfix = isNotBlankString(title) ? `, ${title}` : '';
            return personName + postfix;
        },
        splitPersonFullName: (fullNameWithTitle) => {
            const [fullName, title] = fullNameWithTitle.split(', ');
            const [firstName, lastName] = fullName.split(' ');
            return { firstName, lastName, title };
        }
    }
})(require('request-promise-native'));
