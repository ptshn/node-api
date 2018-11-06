const usersMilestonesService = require('../services/usersMilestonesService');
const responses = require('../models/responses/index');
const mentorsClientListService = require('../services/mentorsClientList.service');
const types = require('../enums/userTypes')

const readByUserIdAndMentorId = (req, res) => {
    const userId = req.params.userId;
    const mentorId = req.params.mentorId;
    const typeId = req.auth.roles
    const authId = req.auth.id

    if ((parseInt(mentorId) !== authId) || (typeId !== types.MENTOR)) {
        res.status(401).send('')
    } else {
        const promise = mentorsClientListService.readByMentorId(mentorId)
        promise
            .then(response => {
                const responseArr = response.some(e => e.userId === parseInt(userId))

                if (responseArr === true) {
                    const promise = usersMilestonesService.readByUserIdAndMentorId(userId, mentorId)
                    return promise
                }
            })
            .then(response => {
                const responseObj = new responses.ItemsResponse()
                responseObj.items = response;
                res.status(200).json(responseObj)
            })
            .catch(err => {
                const responseObj = new responses.ErrorResponse()
                responseObj.error = err.stack;
                res.status(500).send(responseObj);
            })
    }
}

module.exports = {
    readByUserIdAndMentorId
}
