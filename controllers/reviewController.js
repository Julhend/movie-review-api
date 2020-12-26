const dbConn = require("./connection/dbconnection")
const _ = require("lodash")
const humps = require('humps')

function chainWhere(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((key, index) => {
    let value = parsedObject[key]
    if (typeof value === 'string')
      value = `"${value}"`
    let composedString = `${key} = ${value}`
    if (index + 1 < parsedObjectKeys.length) {
      composedString += ' AND'
    }
    return composedString
  }).join(' ')
}

function chainSet(object) {
  const parsedObject = humps.decamelizeKeys(object)
  const parsedObjectKeys = Object.keys(parsedObject)
  return parsedObjectKeys.map((key, index) => {
    let value = parsedObject[key]
    if (typeof value === 'string')
      value = `"${value}"`
    let composedString = `${key} = ${value}`
    if (index + 1 < parsedObjectKeys.length) {
      composedString += ' ,'
    }
    return composedString
  }).join(' ')
}

function createInsertColumn(object) {
  const parsedObject = humps.decamelizeKeys(object)
  return {
    columns: Object.keys(parsedObject),
    values: Object.values(parsedObject).map(val => {
      if (typeof val === 'string')
        return `"${val}"`
      return val
    })
  }

}

function get(tableName, searchParameters) {
  let query = `SELECT * from ${tableName} `
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += `WHERE ${chainWhere(searchParameters)}`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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

function getTitle(tableName, value) {
  let query = `SELECT * from ${tableName} `
  const searchParameterKeys = Object.keys(value)
  if (searchParameterKeys.length) {
    query += ` WHERE title LIKE '%${value}%'`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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

function getMovieDetail(tableName, searchParameters) {
  let query = `SELECT m.id, m.title, m.trailer, m.poster, m.release_date, m.country, m.creator, m.featured_song, m.synopsys, COUNT(review) as total_review, AVG(rating) as rating FROM movie m 
LEFT JOIN genre g ON m.id = g.movie_id 
LEFT JOIN review r ON m.id = r.movie_id`
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += ` WHERE m.${chainWhere(searchParameters)}`
  }
  else {
    query += ` GROUP BY m.id`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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

function getCharacter(tableName, searchParameters) {
  let query = `SELECT a.id, a.movie_id,m.title, a.character_name,a.character_as,a.character_picture
FROM  artist a 
JOIN movie m ON a.movie_id = m.id `
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += ` WHERE a.${chainWhere(searchParameters)}`
  }
  // else {
  //   query += ` GROUP BY c.id`
  // }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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

function getAllMovie(tableName, searchParameters) {
  let query = `SELECT movie.id,movie.title,genre.genre,movie.release_date, movie.poster,movie.trailer,movie.creator,movie.featured_song,movie.country,movie.synopsys FROM ${tableName}
  LEFT JOIN genre ON movie.id = genre.movie_id`
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += ` WHERE ${chainWhere(searchParameters)}`
  }

  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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


function getUserReview(tableName, searchParameters) {
  let query = `SELECT r.id,r.movie_id,m.title,m.release_date,m.poster, r.user_id ,u.user_name ,
u.full_name , u.profile_picture ,r.date,r.rating, r.impression ,r.review  FROM review r 
JOIN users u ON r.user_id = u.user_id 
JOIN movie m ON r.movie_id = m.id `
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += `WHERE r.${chainWhere(searchParameters)}`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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

function getWatchList(tableName, searchParameters) {
  let query = `SELECT l.id,l.movie_id, l.user_id ,u.user_name , u.full_name , u.profile_picture, m.title FROM watch_list l 
JOIN users u ON l.user_id = u.user_id 
JOIN movie m ON l.movie_id = m.id `
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += `WHERE l.${chainWhere(searchParameters)}`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
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


function add(tableName, body) {
  const columnValue = createInsertColumn(body)
  let query = `INSERT INTO ${tableName} (${columnValue.columns})
  VALUES (${columnValue.values})`
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

function edit(tableName, id, body) {
  let query = `UPDATE ${tableName}
  SET ${chainSet(body)}
  WHERE id = "${id}"`
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}


function remove(tableName, searchParameters) {
  let query = `DELETE FROM ${tableName} `
  const searchParameterKeys = Object.keys(searchParameters)
  if (searchParameterKeys.length) {
    query += `WHERE ${chainWhere(searchParameters)}`
  }
  return new Promise((resolve, reject) => {
    dbConn.query(query, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve('Data has been removed')
      }
    })
  })
}

function detailMovie(id) {
  let sql = `SELECT movie.id, title, trailer, poster, synopsys, release_date, creator, featured_song,COUNT(review) as total_review, AVG(review.rating) as rating FROM movie
    LEFT JOIN review ON movie.id = review.movie_id
    WHERE movie.id = "${id}"`

  return new Promise((resolve, reject) => {
    dbConn.query(sql, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.map(res => {
          const plainObject = _.toPlainObject(res)
          const camelCaseObject = humps.camelizeKeys(plainObject)
          return camelCaseObject
        })
        )
      }
    })

  })
}


module.exports = {
  get,
  add,
  edit,
  getUserReview,
  getAllMovie,
  getTitle,
  getWatchList,
  getMovieDetail,
  detailMovie,
  getCharacter,
  remove
}