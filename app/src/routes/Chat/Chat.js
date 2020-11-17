import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import io from 'socket.io-client';

import {UserContext} from "../../App";
import Header from "../../components/Header/Header";

import './chat.css';

const Chat = () => {
    const token = sessionStorage.getItem('token');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const currentUser = useContext(UserContext).currentUser || sessionStorage.getItem('username');
    console.log(currentUser)
    const socket = io('http://localhost:3002');

    useEffect(() => {
        socket.on('connect', () => {
            socket
                .on('messages', data => {
                  setMessages(data);
                })
                .on('addMessage', newMessage => {
                    console.log('new message')
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages.push(newMessage);
                        return newMessages;
                    });
                })
        });
        return () => socket.disconnect();
    }, [])

    const handleChange = event => {
        setInput(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('newMessage', {message: input, username: currentUser});
        setInput('');
    }


    return (
        <div className="chatPage">
            {!token || token === 'undefined' ? <Redirect to="signin"/> : null}

            <Header />
            <h1>Messages</h1>
            {messages.map(message => (
                <div key={message._id} className="message">
                    <div className="flex">
                        <h5>{message.user}</h5>
                        <div className="date">{new Date(message.created_at).toLocaleString([], {year: 'numeric', month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false})}</div>
                    </div>
                    <p>{message.message}</p>
                </div>
            ))}
            <form onSubmit={handleSubmit}>
                <input type="text" name="message" onChange={handleChange} value={input}/>
                <button disabled={!input}>Send</button>
            </form>
        </div>
    )
};

export default Chat;