import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const id =  uuidv4();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Find:
// sudo lsof -i :3000
// Kill:
// kill -9 <PID>

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});
 
app.post('/', (req, res) => {
    return res.send('Received a POST HTTP method');
});
 
app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});
 
app.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});
 
app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);

// R for Read
app.get('/users', (req, res) => {
    return res.send('GET HTTP method on user resource');
});

// C for CREATE
app.post('/users', (req, res) => {
    return res.send('POST HTTP method on user resource');
});

// // U for UPDATE
// app.put('/users', (req, res) => {
//     return res.send('PUT HTTP method on user resource');
// });

// // D for DELETE
// app.delete('/users', (req, res) => {
//     return res.send('DELETE HTTP method on user resource');
// });

app.put('/users/:userId', (req, res) => {
    return res.send(
      `PUT HTTP method on user/${req.params.userId} resource`,
    );
});
   
app.delete('/users/:userId', (req, res) => {
    return res.send(
      `DELETE HTTP method on user/${req.params.userId} resource`,
    );
});

let users = {
    1: {
      id: '1',
      username: 'Wanning Ding',
    },
    2: {
      id: '2',
      username: '刘煜城Noah',
    },
};
   
let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'Bye World',
      userId: '2',
    },
};

app.get('/users', (req, res) => {
    return res.send(Object.values(users));
});
   
app.get('/users/:userId', (req, res) => {
    return res.send(users[req.params.userId]);
});

app.get('/messages', (req, res) => {
    return res.send(Object.values(messages));
});
   
app.get('/messages/:messageId', (req, res) => {
    return res.send(messages[req.params.messageId]);
});


// Design a custom Express middleware:
// the authenticated user: user with userID 1 which gets assigned as me property to the request object
app.use((req, res, next) => {
  req.me = users[1];
  next();
});

// Create a message 
app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
      id,
      text: req.body.text,
      userId: req.me.id,
    };
    messages[id] = message;
    return res.send(message);
});
// curl code to run: 
// curl -X POST -H "Content-Type:application/json" http://localhost:3000/messages -d '{"text":"Hi again, World"}'
// HTTP to check:
// http://localhost:3000/messages/9c03bdb9-56ff-4bb5-a44e-448ca5f8896b

app.delete('/messages/:messageId', (req, res) => {
    const {
      [req.params.messageId]: message,
      ...otherMessages
    } = messages;
   
    messages = otherMessages;
   
    return res.send(message);
});
// curl -X DELETE http://localhost:3000/messages/1

// UPDATE
app.put('/messages', (req, res) => {
    const id = req.body.id;
    // const newMessage = {
    //     id: req.body.id,
    //     text: req.body.text,
    //     userId: req.me.id,
    // };
    messages[id]['text'] = req.body.text;
    messages[id]['userId'] = req.me.id;
    return res.send(messages[id]);
});
//curl -X PUT -H "Content-Type:application/json" http://localhost:3000/messages -d '{"id":"1", "text":"PUT HW"}'



app.get('/session', (req, res) => {
    return res.send(users[req.me.id]);
  });