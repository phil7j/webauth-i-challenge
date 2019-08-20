const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')

// const db = require('./db/dbConfig.js');
const authRouter = require('./authRoutes/authRouter')
const Users = require('./users/users-model.js');
const restricted = require('./middleware/restricted.js');

const server = express();

const sessionConfig = {
  name: 'monkey',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 30,
    secure: false, //true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false //GDPR laws against setting cookies automatically
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.use('/api/restricted', restricted)

server.use('/api/auth', authRouter)




// can only be accessed by clients with valid credentials
server.get('/api/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

// can only be accessed by clients with valid credentials
server.get('/api/restricted', (req, res) => {
    res.send("It's alive!");
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
