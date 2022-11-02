let express = require('express');
var bodyParser = require('body-parser')
const fs = require('fs');


let app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('home'); // archivo dentro de ./views
});

app.get('/servicios', (req, res) => {
  res.render('servicios');// archivo dentro de ./views
});

app.get('/login', (req, res) => {
  res.render('login');// archivo dentro de ./views
});

app.get('/registro', (req, res) => {
  res.render('registro');// archivo dentro de ./views
});



app.post('/registro/guardar', (req, res) => {

  let rawdata = fs.readFileSync('./registro.json'); // json file is db in memory
  let registros = JSON.parse(rawdata);

  if (!registros.data.find((usuario) => usuario.email === req.body.email)) {
    registros.data.push(req.body);

    fs.writeFileSync('registro.json', JSON.stringify(registros, null, 2));
    console.log("registro guardado")
    res.send({ status: "ok" })
  } else {
    console.log("ya existe un usuario con este correo")
    res.send({ status: "error", message: "email ya registrado" })
  }
});

app.post('/validar-login', (req, res) => {

  let rawdata = fs.readFileSync('./registro.json'); // json file is db in memory
  let registros = JSON.parse(rawdata);

  if (registros.data.find((usuario) => usuario.email === req.body.email && usuario.password === req.body.password)) {
    registros.data.push(req.body);

    res.send({ status: "ok" })
  } else {
    res.send({ status: "error", message: "usuario y contrasena no validos" })
  }
});

app.get('/registro/:abc', (req, res) => {

  let rawdata = fs.readFileSync('./registro.json'); // json file is db in memory
  let registros = JSON.parse(rawdata);
  const usuario = registros.data.find((usuario) => usuario.id + "" === req.params.abc);

  if (usuario) {
    res.send({ status: "ok", usuario })
  } else {
    res.send({ status: "error", message: "no existe" })
  }

});

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${process.env.PORT || 3000}!`));