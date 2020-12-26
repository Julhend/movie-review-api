const _ = require('lodash')

function mysqlErrorHandler(err, req, res, next) {
    const parsedError = _.toPlainObject(err)
    if (parsedError.code === 'ER_BAD_FIELD_ERROR')
        res.status(400).send('Bad request, wrong key name');
    else if (parsedError.code === 'ER_DATA_TOO_LONG')
        res.status(400).send('Bad request, data too long');
    else if (parsedError.code === 'ERR_NOT_FOUND')
        res.status(401).send('Not found!');
    else if (parsedError.code === 'ER_NO_DEFAULT_FOR_FIELD')
        res.status(401).send('Lack Field');
    else if (parsedError.code === 'ER_DUP_ENTRY')
        res.status(401).send('Duplicate Entry!');
    else if (parsedError.code === 'ER_TRUNCATED_WRONG_VALUE')
        res.status(404).send('Data Not Found!');
    else if (parsedError.code === ' ER_PARSE_ERROR')
        res.status(401).send('Body Should Not Empty!');
    else
        res.status(500).send(parsedError)

}

module.exports = mysqlErrorHandler