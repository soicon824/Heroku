var notes = [];
exports.create = function (key, title, body) {
    notes[key] = { title: title, body: body };
}

exports.update = function (key, title, body) {
    notes[key] = { title: title, body: body };
}


exports.read = function (key) {
    return notes[key];
}

exports.list = function () {
    return Object.values(notes);
}
exports.destroy = function (key) {
    delete notes[key];
}

exports.keys = function () {
    return Object.keys(notes);
}