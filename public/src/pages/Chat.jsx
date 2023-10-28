import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import io from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.user._id)
    }
  }, [currentUser])
  useEffect(() => {
    const myfunc = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate("/login");
      }
      else {
        try {
          setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        } catch (err) {
          console.log('ERROR: ', err.message);
        }

      }
    }
    myfunc();

  }, []);
  /// this function is simply cheeck have u crossed the avtar section or not , if u have the avatar, then all the contacts will be deleveried to u , except ur name in those conntacts data by all users route

  useEffect(() => {
    const func = async () => {
      if (currentUser) {
      
        if (currentUser.user.isAvatarImageSet) {

          try {
            const data = await axios.get(`${allUsersRoute}/${currentUser.user._id}`);
           
            setContacts(data.data);
          }
          catch (ex) {
         
            console.log(ex.response);
          }


        }
        else {
         
          navigate('/setAvatar');
        }
      }
    }

    func();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">

          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />

          {currentUser && !currentChat && (
            <Welcome currentUser={currentUser} />
          )}
          {currentUser && currentChat &&
            (
              <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
            )}

        </div>
      </Container>
    </>

  )
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #2C3531;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #116466;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat