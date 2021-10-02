const users = {
    users_list:
        [
            {
                id: 'xyz789',
                name: 'Charlie',
                job: 'Janitor',
            },
            {
                id: 'abc123',
                name: 'Mac',
                job: 'Bouncer',
            },
            {
                id: 'ppp222',
                name: 'Mac',
                job: 'Professor',
            },
            {
                id: 'yat999',
                name: 'Dee',
                job: 'Aspring actress',
            },
            {
                id: 'zap555',
                name: 'Dennis',
                job: 'Bartender',
            }
        ]
}

const express = require('express');
const app = express();
const port = 5000;

// linking frontend and backend
const cors = require('cors');
app.use(cors());

app.use(express.json());

// STEP 1 - print "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// make backend server listen to incoming http requests on defined port number
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// STEP 4 - find user by name
app.get('/users', (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    }
    else {
        res.send(users);
    }
});

const findUserByName = (name) => {
    return users['users_list'].filter((user) => user['name'] === name);
}

// STEP 5 - find user when given id
app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = { users_list: result };
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find((user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

// STEP 6 - use POST to add members to list 
app.post('/users', (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(200).send(userToAdd);     // linking part 6.3 - return updated representation of user w/ new ID, change from sending 201 code
});

// linking part 6.2
function addUser(user) {
    const id = randomIDGen().toString();  // turn random int to string
    user['id'] = id;
    users['users_list'].push(user);
}

// linking part 6 - random ID generator
function randomIDGen() {
    return Math.floor(Math.random() * 100000);    // return random integer between 0 to 99999
}

// STEP 7a - hard delete operation to remove a particulat user by id from list
app.delete('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        db.remove(id)
            .then(removed => {
                if (removed) {
                    res.status(204).end();
                } else { // 400 handles temporary errors
                    res.status(404).json({ message: 'Resource not found.' }) 
                }
            })
            .catch(err => { // handles bad request
                res.status(500).json({ err })
            })
    }
});

// STEP 7b - get all users that match a given name and job
app.get('/users/:name/:job', (req, res) => {
    const name = req.params['name'];
    const job = req.params['job'];
    if (name != undefined && job != undefined) {
        let result = findUserByNameAndJob(name, job);
        result = { users_list: result };
        res.send(result);
    }
    else {
        res.send(users);
    }
});

const findUserByNameAndJob = (name, job) => {
    return users['users_list'].filter((user) => (user['name'] === name && user['job'] === job));
}