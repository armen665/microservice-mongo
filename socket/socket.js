const io = require('socket.io').listen(3002);
const createSchemas = require('users-messages-schemas12');

const {Message} = createSchemas(process.env.MONGO_DB_URL);


io.on('connect', socket => {
    Message.find({}, (err, data) => {
        if(err) {
            return 'Something went wrong with getting all messages'
        }
        socket.emit('messages', data);
    })
    socket.on('newMessage', data => {
        const newMessage = {message: data.message, user: data.username};
        Message.create(newMessage, (err, m) => {
            if(err) {
                return console.log('Something went wrong with new message');
            };
            console.log('new message');
            io.emit('addMessage', m);
        })

    });
});

