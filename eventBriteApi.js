const axios = require('../../node_modules/axios');

function getAll() {
    // ... removing for brevity
}

function getById(id) {
    const url = 'https://www.eventbriteapi.com/v3/events/' + id + '/';
    const config = {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + process.env.EVENTBRITE_KEY
        }
    }
    return axios(url, config)
        .then(responseSuccessHandler)
        .catch(responseErrorHandler);
}

function create(data) {
// ... removing for brevity
}

function update(id, data) {
// ... removing for brevity
}

function deleteEvent(id) {
// ... removing for brevity
}

const responseSuccessHandler = response => {
// ... removing for brevity
};

const responseErrorHandler = error => {
// ... removing for brevity
};

module.exports = { getAll, getById, create, update, deleteEvent };
