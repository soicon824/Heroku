var notes = require('../models/notes');
exports.list = function(req, res, next) {
    res.render('pages/notelist', { title: 'Notes', notes: notes.list(), keys: notes.keys() });
}
// .get('/list', async (req, res) => {
//     res.render('pages/notelist', { title: 'Notes', notes: notes });
//   })
exports.add = function(req, res, next) {
    res.render('pages/noteedit', {
        title: "Add a note",
        docreate: true,
        notekey: "",
        note: undefined
    });
}
exports.save = function(req, res, next) {
    if (req.body.docreate === 'create') {
        notes.create(req.body.notekey,
                     req.body.title,
                     req.body.body);
    } else {
        notes.update(req.body.notekey,
                     req.body.title,
                     req.body.body);
    }
    res.redirect('/noteview?key='+req.body.notekey);
}
exports.view = function(req, res, next) {
    var note = undefined;
    if(req.query.key) {
        note = notes.read(req.query.key);
    }
    res.render('pages/noteview', {
        title: note ? note.title : "",
        notekey: req.query.key,
        note: note
    });
}
exports.edit = function(req, res, next) {
    var note = undefined;
    if(req.query.key) {
        note = notes.read(req.query.key);
    }
    res.render('pages/noteedit', {
        title: note ? ("Edit " + note.title) : "Add a Note",
        docreate: note ? false : true,
        notekey: req.query.key,
        note: note
    });
}
exports.destroy = function(req, res, next) {
    var note = undefined;
    if(req.query.key) {
        note = notes.read(req.query.key);
    }
    res.render('pages/notedestroy', {
        title: note ? note.title : "",
        notekey: req.query.key,
        note: note
    });
}
exports.dodestroy = function(req, res, next) {
    notes.destroy(req.body.notekey);
    res.redirect('pages/notelist');
 }