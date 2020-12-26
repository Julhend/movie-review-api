const express = require('express')
const app = express.Router()
const db = require('../../controllers/paginateController')
const mysqlErrorHandler = require('../../controllers/midleware/errorMiddleware')
const paginate = require('express-paginate')

app.get('/movies/home', paginate.middleware(), async (req, res, next) => {


    const offset = (req.query.page - 1) * req.query.limit
    const field = "movie.id,movie.title,genre.genre,movie.release_date, movie.poster,movie.trailer,movie.creator,movie.featured_song,movie.country,movie.synopsys"
    const allField = "*"
    const configPagination = {
        order: 'ORDER BY title',
        limit: `limit ${req.query.limit}`,
        offset: `offset ${offset}`
    }

    const result = await db.getMovieLimit(field, 'movie', configPagination)
    const itemCount = await db.countData(allField, 'movie')
        .catch((err) => next(err))
    const totalCount = itemCount[0].total
    const pageCount = Math.ceil(totalCount / req.query.limit);

    const response = {
        movies: result,
        pageCount,
        pages: paginate.getArrayPages(req)(10, pageCount, req.query.page)
    }
    res.send(response);

})


app.use(mysqlErrorHandler)
module.exports = app