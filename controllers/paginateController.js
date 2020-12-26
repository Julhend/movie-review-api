const dbConn = require("./connection/dbconnection")
const _ = require('lodash')
const humps = require('humps')

function getMovieLimit(tableField, tableName, setting) {
    let sql = `SELECT ${tableField} FROM ${tableName} 
    JOIN genre ON movie.id = genre.movie_id  
     ${setting.order} ${setting.limit} ${setting.offset}`
    return new Promise((resolve, reject) => {
        dbConn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.map(res => {
                    const plainObject = _.toPlainObject(res)
                    const camelCaseObject = humps.camelizeKeys(plainObject)
                    return camelCaseObject
                }))
            }
        })
    })
}

function countData(tableField, tableName) {
    let sql = `SELECT COUNT(${tableField}) as total FROM ${tableName}`

    return new Promise((resolve, reject) => {
        dbConn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


function countField(tableField, tableName) {
    let sql = `SELECT COUNT(${tableField}) as total FROM ${tableName}`

    return new Promise((resolve, reject) => {
        dbConn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = {
    getMovieLimit,
    countData,
    countField
}