const appointmentsService = require('../services/appointments.service');
const responses = require('../models/responses/index');

const readAll = (req, res) => {
    const promise = appointmentsService.readAll();

    promise
        .then(item => {
            const r = new responses.ItemResponse(item)
            res.json(r)
        })
        .catch(err => {
            res.set(500).send(err);
        })
    return promise;
}

const readById = (req, res) => {
    const id = parseInt(req.params.id)  // req.params.id comes in as a string, used parseInt to convert to integer 
    const promise = appointmentsService.readById(id);

    promise  // the promise has an if/else statement based on the userId. will show or hide appointments based on id
        .then(item => {
            if (req.auth.id !== id) {  // if the logged in Id (req.auth.id) is NOT EQUAL to the /appointments/user/`id` (req.params.id)
                const newArr = item.map(e => ({ ...e, description: ''}))  // if above is true, update the object property 'description' with an empty string

                res.json(new responses.ItemResponse(newArr));  // send updated object as the response
            } else {
                res.json(new responses.ItemResponse(item));  // if the logged in Id matches the req.params.id, then send the original object as response
            }
        })
        .catch(err => {
            res.set(500).send(err);
        })

    return promise;
}

const create = (req, res) => {
    const promise = appointmentsService.create(req.model);

    promise
        .then(response => {
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).send(err.stack);
        })
}

const updateById = (req, res) => {
    const id = req.params.id;
    const promise = appointmentsService.updateById(id, req.model)
    promise
        .then(response => {
            res.sendStatus(200)
        })
        .catch(err => {
            res.set(500).send(err);
        })
}

const deleteById = (req, res) => {
    const id = req.params.id
    const promise = appointmentsService.del(id)

    promise
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.set(500).send(err);
        })
}

const readByMonthYear = (req, res) => {
    const id = req.params.id
    const year = req.params.year
    const month = req.params.month

    const promise = appointmentsService.readByMonthYear(id, year, month);

    promise
        .then(item => {
            const r = new responses.ItemResponse(item)
            res.json(r)
        })
        .catch(err => {
            res.set(500).set(err);
        })
    return promise;
}

module.exports = {
    readAll
    , readById
    , create
    , updateById
    , deleteById
    , readByMonthYear
}
