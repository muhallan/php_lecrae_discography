const mongoose = require('mongoose');
const Album = mongoose.model(process.env.ALBUM_MODEL);


const getAll = (req, res) => {
    let offset = 0;
    let count = 5;
    const maxCount = 10;

    const response = {
        status: 200,
        message: {}
    };

    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }

    if (isNaN(count) || isNaN(offset)) {
        response.status = 400;
        response.message = {message: "count and offset must be numbers"};
    } else if (count > maxCount) {
        response.status = 400;
        response.message = {message: "count must be less than or equal to " + maxCount};
    }

    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    } else {
        Album.find().skip(offset).limit(count).exec((err, albums) => makeAllAlbumsResponse(err, albums, response, res));
    }
};

const makeAllAlbumsResponse = (err, albums, response, res) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 200;
        response.message = {albums: albums};
    }
    res.status(response.status).json(response.message);
};


const addOne = (req, res) => {
    const response = {
        status: 200,
        message: {}
    };

    if (req.body && req.body.title && req.body.year) {
        const year = parseInt(req.body.year);
        const currentYear = new Date().getFullYear();
        if (isNaN(year)) {
            response.status = 400;
            response.message = {message: "year should be a number"};
        } else if (year < 2004 || year > currentYear) {
            response.status = 400;
            response.message = {message: "year should be between 2004 and " + currentYear};
        } else {
            const newAlbum = {
                title: req.body.title,
                year: year,
                songs: []
            };

            Album.create(newAlbum, (err, album) => makeCreateAlbumResponse(err, album, response, res));
        }
    } else {
        response.status = 400;
        response.message = {message: "Album requires a title and a year"};
    }
    if (response.status !== 200) {
        res.status(response.status).json(response.message);
    }
};

const makeCreateAlbumResponse = (err, album, response, res) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else {
        response.status = 201;
        response.message = album;
    }
    res.status(response.status).json(response.message);
}

const getOne = (req, res) => {
    const albumId = req.params.albumId;
    
    const response = {
        status: 200,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = 400;
        response.message = {message: "Invalid album ID provided"};
        res.status(response.status).json(response.message);
    } else {
        Album.findById(albumId).exec((err, album) => makeSingleAlbumResponse(err, album, response, res, albumId));
    }

}

const makeSingleAlbumResponse = (err, album, response, res, albumId) => {
    if (err) {
        response.status = 500;
        response.message = {error: err};
    } else if (!album) {
        response.status = 404;
        response.message = {message: "Album with id " + albumId + " not found"};
    } else {
        response.status = 200;
        response.message = album;
    }
    res.status(response.status).json(response.message);
}

module.exports = {
    getAll,
    addOne,
    getOne
}
