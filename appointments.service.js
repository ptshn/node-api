const mssql = require('../../mssql');
const { TYPES } = require('tedious');
const moment = require('moment')

const readAll = () => {
    const promise = mssql.executeProc('Appointments_SelectAll')
        .then(response => {
            const items = response.resultSets[1];
            return items
        })
        .catch(responseErrorHandler);

    return promise;
}

const readById = id => {
    const promise = mssql.executeProc('Appointments_Select_ById', sqlRequest => {
        sqlRequest.addParameter('RequesterId', TYPES.Int, id);
    })
        .then(response => {
            return response.resultSets[1];
        })
        .catch(responseErrorHandler)

    return promise;
}

const create = item => {
    const promise = mssql
        .executeProc('Appointments_Insert', sqlRequest => {
            sqlRequest.addParameter('RequesterId', TYPES.Int, item.requesterId),
                sqlRequest.addParameter('GuestId', TYPES.Int, item.guestId),
                sqlRequest.addParameter('AppointmentDate', TYPES.DateTime2, item.appointmentDate),
                sqlRequest.addParameter('AppointmentEndDate', TYPES.DateTime2, item.appointmentEndDate),
                sqlRequest.addParameter('Location', TYPES.NVarChar, item.location, {
                    length: 4000
                });
            sqlRequest.addParameter('Description', TYPES.NVarChar, item.description, {
                length: 4000
            });
            sqlRequest.addOutputParameter('Id', TYPES.Int, null);
        })
        .then(response => {
            return response.outputParameters;
        })
        .catch(responseErrorHandler);

    return promise;
}

const updateById = (id, item) => {
    const promise = mssql.executeProc('Appointments_Update_ById', sqlRequest => {
        sqlRequest.addParameter('RequesterId', TYPES.Int, item.requesterId);
        sqlRequest.addParameter('GuestId', TYPES.Int, item.guestId);
        sqlRequest.addParameter('AppointmentDate', TYPES.DateTime2, item.appointmentDate);
        sqlRequest.addParameter('Location', TYPES.NVarChar, item.location, {
            length: 4000
        });
        sqlRequest.addParameter('Description', TYPES.NVarChar, item.description, {
            length: 4000
        });
        sqlRequest.addParameter('Id', TYPES.Int, id);
    })
        .then(response => {
            return response
        })
        .catch(responseErrorHandler)

    return promise;
}

const readByMonthYear = (id, year, month) => {
    const startOfMonth = moment([year, month - 1]);  // using Moment for date manipulation. month in Moment is 0 based, so January is 0 (not 1) etc. 
    const endOfMonth = moment(startOfMonth).endOf('month');  // further explanation https://stackoverflow.com/questions/26131003/moment-js-start-and-end-of-given-month

    const promise = mssql.executeProc('Appointments_Select_ByMonthAndYear', sqlRequest => {
        sqlRequest.addParameter('SelectedId', TYPES.Int, id);
        sqlRequest.addParameter('StartDate', TYPES.DateTime2, startOfMonth);
        sqlRequest.addParameter('EndDate', TYPES.DateTime2, endOfMonth);
    })
        .then(response => {
            return response.resultSets[1];
        })
        .catch(responseErrorHandler)

    return promise;
}

const del = id => {
    const promise = mssql.executeProc('Appointments_Delete', sqlRequest => {
        sqlRequest.addParameter('Id', TYPES.Int, id)
    })
        .then(response => {
            return response
        })
        .catch(responseErrorHandler)

    return promise;
}

const responseErrorHandler = error => {
    console.log(error);
    if (error && error.response && error.response.data && error.response.data.errors) {
        console.error(error.response.data.errors);
    }
    return Promise.reject(error);
}

module.exports = {
    create
    , readAll
    , readById
    , updateById
    , del
    , readByMonthYear
}
