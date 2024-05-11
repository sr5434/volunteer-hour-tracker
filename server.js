const express = require('express');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors')

const app = express();
const port = 8000;

const config = {
  user: 'username', // better stored in an app setting such as process.env.DB_USER
  password: 'password', // better stored in an app setting such as process.env.DB_PASSWORD
  server: 'example-server.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
  port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: 'VolunteeringDatabase', // better stored in an app setting such as process.env.DB_NAME
  authentication: {
      type: 'default'
  },
  options: {
      encrypt: true
  }
}

app.use(cors());
app.use(express.urlencoded({ 
  extended: true
}));
app.use(express.json());

app.get('/volunteerData', async (req, res) => {
  const conn = await sql.connect(config);
  const result = await conn.request().query(`SELECT * FROM [dbo].[volunteeringEvents];`);
  res.send(result.recordsets[0])
})

app.post('/add', async (req, res) => {
  const conn = await sql.connect(config);
  const result = await conn.request().query(`INSERT INTO [dbo].[volunteeringEvents] VALUES (
    '${uuidv4()}',
    '${req.body.location}',
    ${req.body.timeSpent},
    '${req.body.date}'
  )`);
  res.send(result)
})
//Example of a post request curl: curl -X POST -H "Content-Type: application/json" -d '{"location":"test", "timeSpent": 1, "date": "2021-01-01"}' http://localhost:8000/add

app.delete('/delete/:id', async (req, res) => {
  const conn = await sql.connect(config);
  const result = await conn.request().query(`DELETE FROM [dbo].[volunteeringEvents] WHERE id = '${req.params.id}';`);
  res.send(result)
});
//Sample delete request curl: curl -X DELETE http://localhost:8000/delete/1

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})