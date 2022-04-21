const mongoose = require('mongoose');
const Album = mongoose.model(process.env.ALBUM_MODEL);


const getAll = (req, res) => {
    let offset = parseInt(process.env.DEFAULT_OFFSET);
    let count = parseInt(process.env.DEFAULT_COUNT);
    const maxCount = parseInt(process.env.DEFAULT_MAX_COUNT);

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };
    let query = {};

    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.q) {
        query = {
            title: {$regex: req.query.q, $options : 'i'}
        };
    }

    if (isNaN(count) || isNaN(offset)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.COUNT_OFFSET_ARE_NUMBERS};
    } else if (count > maxCount) {
        response.status = process.env.USER_ERROR_STATUS_CODE;;
        response.message = {message: process.env.COUNT_LESS_THAN_EQUAL + maxCount};
    }

    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    } else {
        Album.find(query).sort({year: -1}).skip(offset).limit(count).exec()
            .then((albums) => {
                makeAllAlbumsResponse(albums, res);
            })
            .catch((err) => {
                makeErrorResponse(err, res);
            });
    }
};

const makeErrorResponse = (err, res) => {
    res.status(process.env.INTERNAL_ERROR_STATUS_CODE).json({error: err});
};

const makeAllAlbumsResponse = (albums, res) => {
    res.status(process.env.SUCCESS_RESPONSE_STATUS_CODE).json({albums: albums});
};


const addOne = (req, res) => {
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (req.body && req.body.title && req.body.year) {
        const year = parseInt(req.body.year);
        const currentYear = new Date().getFullYear();
        const validatedSongs = _getSongsFromBody(req, response);
        if (isNaN(year)) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.YEAR_SHOULD_BE_NUMBER};
        } else if (year < parseInt(process.env.EARLIEST_ALBUM_YEAR) || year > currentYear) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.YEAR_ABOVE_2004 + currentYear};
        } else if (response.status === process.env.SUCCESS_RESPONSE_STATUS_CODE) {
            const newAlbum = {
                title: req.body.title,
                year: year,
                songs: []
            };
            if (validatedSongs) {
                newAlbum.songs = validatedSongs;
            }
            Album.create(newAlbum)
                .then((album) => {
                    makeCreateAlbumResponse(album, res);
                })
                .catch((err) => {
                    makeErrorResponse(err, res);
                });
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.ALBUM_HAS_TITLE_YEAR};
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const makeCreateAlbumResponse = (album, res) => {
    res.status(process.env.USER_CREATED_STATUS_CODE).json(album);
}

const getOne = (req, res) => {
    const albumId = req.params.albumId;
    
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
        res.status(response.status).json(response.message);
    } else {
        Album.findById(albumId).exec()
            .then((album) => {
                makeSingleAlbumCallback(album, res, albumId);
            })
            .catch((err) => {
                makeErrorResponse(err, res);
            });
    }

}

const makeSingleAlbumCallback = (album, res, albumId) => {
    const response = {};
    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        response.status = process.env.SUCCESS_RESPONSE_STATUS_CODE
        response.message = album;
    }
    res.status(response.status).json(response.message);
}

const deleteOne = (req, res) => {
    const albumId = req.params.albumId;

    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else {
        Album.findByIdAndDelete(albumId).exec()
            .then((album) => {
                deleteAlbumCallback(album, res, albumId);
            })
            .catch((err) => {
                makeErrorResponse(err, res);
            });
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const deleteAlbumCallback = (album, res, albumId) => {
    const response = {};
    if(!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        response.status = process.env.SUCCESS_RESPONSE_STATUS_CODE
        response.message = {message: process.env.ALBUM_DELETED_SUCCESS};
    }
    res.status(response.status).json(response.message);
}

const updateOne = (req, res, setAlbumUpdateDetails) => {
    const albumId = req.params.albumId;
    
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };

    if (!mongoose.isValidObjectId(albumId)) {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.INVALID_ALBUM_ID};
    } else {
        Album.findById(albumId).exec()
            .then((album) => {
                getAlbumForUpdate(album, req, res, albumId, setAlbumUpdateDetails);
            })
            .catch(err => {
                makeErrorResponse(err, res);
            });
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
}


const fullUpdateOne = (req, res) => {
    updateOne(req, res, setFullAlbumUpdateDetails);
}

const partialUpdateOne = (req, res) => {
    updateOne(req, res, setPartialAlbumUpdateDetails);
};

const getAlbumForUpdate = (album, req, res, albumId, setAlbumUpdateDetails) => {
    const response = {
        status: process.env.SUCCESS_RESPONSE_STATUS_CODE,
        message: {}
    };
    if (!album) {
        response.status = process.env.NOT_FOUND_STATUS_CODE;
        response.message = {message: process.env.ALBUM_WITH_ID + albumId + process.env.NOT_FOUND};
    } else {
        setAlbumUpdateDetails(req, album, response);

        if (response.status === process.env.SUCCESS_RESPONSE_STATUS_CODE) {
            album.save()
                .then((updatedAlbum) => {
                    makeOneAlbumRespose(updatedAlbum, res);
                })
                .catch(err => {
                    makeErrorResponse(err, res);
                });
        }
    }
    if (response.status !== process.env.SUCCESS_RESPONSE_STATUS_CODE) {
        res.status(response.status).json(response.message);
    }
};

const makeOneAlbumRespose = (updatedAlbum, res) => {
    res.status(process.env.SUCCESS_RESPONSE_STATUS_CODE).json(updatedAlbum);
};

const setFullAlbumUpdateDetails = (req, album, response) => {
    if (req.body && req.body.title && req.body.year) {
        const year = parseInt(req.body.year);
        const currentYear = new Date().getFullYear();
        if (isNaN(year)) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.YEAR_SHOULD_BE_NUMBER};
        } else if (year < parseInt(process.env.EARLIEST_ALBUM_YEAR) || year > currentYear) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.YEAR_ABOVE_2004 + currentYear};
        } else {
            album.title = req.body.title;
            album.year = year;
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.ALBUM_HAS_TITLE_YEAR};
    }

    const validatedSongs = _getSongsFromBody(req, response);
    album.songs = validatedSongs;
};

const _getSongsFromBody = (req, response) => {
    const isValid = true;
    const validatedSongs = [];
    if (req.body && req.body.songs) {
        const songs = req.body.songs;
        for (let song of songs) {
            if (_validateSong(song, response)) {
                validatedSongs.push(song);
            } else {
                isValid = false;
                break;
            }
        }
    } 
    if (isValid) {
        return validatedSongs;
    }
    return [];
}

const _validateSong = (song, response) => {
    if (song && song.name && song.writers) {
        const writers = song.writers;
        if (!Array.isArray(writers) || !writers.length) {
            response.status = process.env.USER_ERROR_STATUS_CODE;
            response.message = {message: process.env.WRITERS_ARE_STRINGS_ARRAY};
            return false;
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.SONG_HAS_NAME_WRITERS};
        return false;
    }
    return true;
}

const setPartialAlbumUpdateDetails = (req, album, response) => {
    
    if (req.body) {
        album.title = req.body.title || album.title;
        if (req.body.year) {
            const year = parseInt(req.body.year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year)) {
                response.status = process.env.USER_ERROR_STATUS_CODE;
                response.message = {message: process.env.YEAR_SHOULD_BE_NUMBER};
            } else if (year < parseInt(process.env.EARLIEST_ALBUM_YEAR) || year > currentYear) {
                response.status = process.env.USER_ERROR_STATUS_CODE;
                response.message = {message: process.env.YEAR_ABOVE_2004 + currentYear};
            } else {
                album.year = year;
            }
        }
        const validatedSongs = _getSongsFromBody(req, response);
        if (validatedSongs && validatedSongs.length) {
            album.songs = validatedSongs;
        }
    } else {
        response.status = process.env.USER_ERROR_STATUS_CODE;
        response.message = {message: process.env.NO_JSON_PROVIDED};
    }
};


module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}
