import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { RightOutlined, DeleteOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import './chat.css';
import { Col, Form, Button, Input } from 'antd';
import { Message } from '../types/Types';
import { addMessage, deleteMessages } from '../store/slices/message';
import jwtDecode from 'jwt-decode';
import { selectUser } from '../store/slices/user';

interface Props {
  messages: Message[];
}

interface JWTToken {
  sub: string;
  iat: number;
  exp: number;
}

export default function Chat({ messages }: Props) {
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const accessToken = useSelector(selectUser).tokens.accessToken;
  const [msg, setMsg] = useState('');
  const dispatch = useDispatch();
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    'ws://localhost:3000/messages'
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const createMessage = (content: string, type: string) => {
    const id = uuidv4();
    const message: Message = { id, content, type };
    return message;
  };

  useEffect(() => {
    if (connectionStatus === 'Open' && messages.length === 0) {
      const message = createMessage(
        'Salut! Aici poti afla mai multe detalii despre proiectele si angajatii din beecoded. Ex: Descrie un proiect din cadrul companiei.',
        'received'
      );
      dispatch(addMessage(message));
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (lastJsonMessage !== null) {
      const message = createMessage(lastJsonMessage.toString(), 'received');
      dispatch(addMessage(message));
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMsg(event.target.value);
  }

  function handleSubmit() {
    if (msg === '') {
      return;
    }
    if (connectionStatus !== 'Open') {
      return;
    }
    const message = createMessage(msg, 'sent');
    const token: JWTToken = jwtDecode(accessToken);
    sendJsonMessage({
      event: 'messages',
      data: {
        message: msg,
        userId: token.sub,
      },
    });
    dispatch(addMessage(message));
    setMsg('');
  }

  function handleRefresh() {
    dispatch(deleteMessages());
  }

  return (
    <Col xs={21} sm={18} md={15} lg={12} className="chat">
      <Col className="messages">
        {messages.map((message) => (
          <div className={`message-${message.type}`} key={message.id}>
            <p className="text">{message.content}</p>
          </div>
        ))}
        <div ref={messageEndRef} />
      </Col>
      <Form className="chat-footer">
        <Button onClick={() => handleRefresh()} className="refresh">
          <DeleteOutlined />
        </Button>
        <Input
          placeholder="Type in your message"
          value={msg}
          onChange={(event) => handleChange(event)}
          className="input-style"
        />
        <Button
          htmlType="submit"
          onClick={() => handleSubmit()}
          className="send"
        >
          <RightOutlined />
        </Button>
      </Form>
    </Col>
  );
}
