import React, {
  ReactElement,
  useContext,
  useState,
  useRef,
  useEffect,
  MouseEvent,
  useMemo,
} from "react";
import { Paper, LinearProgress, Dialog, DialogTitle } from "@material-ui/core";
import Chat from "./Chat";
import ChatHistory from "./ChatHistory";
import ChatProfile from "./ChatProfile";
import ModalProfile from "./ChatProfile/ModalProfile/index";
import { usePaperStyles } from "./styles";
import { UserContext } from "../../context/User/UserContext";
import { ChatContext } from "../../context/Chat/ChatContext";
import { closeConnection } from "../../websocket/index";
import { props, Conversation, Message, Contact, User } from "./types";

const ChatComponent = ({ history }: props): ReactElement => {
  const paperStyles = usePaperStyles();
  const [message, setMessage] = useState<string>("");
  const [option, setOption] = useState<string>("history");
  const [loading, setLoading] = useState<boolean>(true);
  const [currChat, setCurrChat] = useState<string>("");
  const [currConv, setCurrConv] = useState<string>("");
  const [currUser, setCurrUser] = useState<Contact[] | null | undefined>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [toggleProfile, setToggleProfile] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const { state: userState, dispatch: userDispatch } = useContext(UserContext);
  const { state: chatState, dispatch: chatDispatch } = useContext(ChatContext);
  const [contacts, setContacts] = useState<Contact[] | undefined>(
    chatState.contacts
  );
  const [people, setPeople] = useState<User[] | undefined>(chatState.people);
  const chatRef = useRef<HTMLDivElement>(null);
  const [modalResponse, setModalResponse] = useState<string | boolean>(false);

  //Function that fetch all the messages that the user has, when log in or refresh page.
  const fetchMessages = async (): Promise<void> => {
    await chatDispatch("LOGIN", { username: userState.username, messages: [] })
      .then((response) => {
        setLoading(false);
        if (!response) {
          closeConnection();
          history.goBack();
        }
      })
      .catch(() => {
        closeConnection();
        history.goBack();
      });
  };

  //Every time that a new conversation is selected, this function is executed.
  useMemo(() => {
    const currentUser = currChat
      ? chatState.contacts?.filter((contact) => contact.username === currChat)
      : null;
    setCurrUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currChat]);

  //This only executes when tthe search input field is changed
  //It changes the values depending on the selected option, to filter the conversations or de contacts according to the value to search
  useEffect(() => {
    if (option === "history" || option === "archived") {
      const convs = conversations?.filter((conv) =>
        conv.member.includes(searchValue)
      );
      setConversations(convs);
    } else if (option === "people") {
      const cont = contacts?.filter(
        (contact) =>
          contact.name.includes(searchValue) ||
          contact.username.includes(searchValue)
      );

      setContacts(cont);
    } else if (option === "contacts") {
      const peop = people?.filter(
        (person) =>
          person.name.includes(searchValue) ||
          person.username?.includes(searchValue)
      );

      setPeople(peop);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  //This function executes when changing the current option to see the chats, contacts, people or archived chats.
  useEffect(() => {
    if (option === "archived") {
      const convs = chatState.conversations?.filter(
        (conv) =>
          conv.sts === "ARCHIVED" &&
          (conv.creator === userState.username ||
            conv.member === userState.username)
      );
      setConversations(convs);
    } else if (option === "history") {
      const convs = chatState.conversations?.filter(
        (conv) =>
          conv.sts === "CREATED" &&
          (conv.creator === userState.username ||
            conv.member === userState.username)
      );
      setConversations(convs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.conversations, option]);

  //UseEffect that executes once in the component and triggers the fetchMessages function to retrieve all the messages
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Calls every time that messages are changed, or the user selects other conversation.
  //It changes the messages variable and set the messages that corresponds to the selected conversation
  useEffect(() => {
    const filteredMessages =
      chatState.messages &&
      chatState.messages.filter(
        (message) => message.conversationId === currConv
      );
    setMessages(filteredMessages);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.messages, currConv]);

  //Calls every time that a message is being received or a chat is selected and fills the messages variable
  //Used to scroll down the page
  useEffect(() => {
    chatRef.current?.scrollTo({
      behavior: "smooth",
      top: chatRef.current?.scrollHeight,
    });
  }, [messages]);

  // const currUsername =
  //   currUser && currUser.length > 0 ? currUser[0].name : null;

  //Function that sends the message
  const send = (): void => {
    const socketMessage = [
      {
        type: 1,
        body: message,
        sender: userState.username,
        receiver: currChat,
        sts: "SENT",
      },
    ];
    chatDispatch("SEND", { messages: socketMessage });
    setMessage("");
  };

  //Function that changes the searchValue state
  const search = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setSearchValue(e.target.value);
  };

  //Function that closes the Menu, in the ChatProfile component
  const closeMenu = (): void => {
    setAnchorEl(null);
  };

  //Function that opens the Menu, in the ChatProfile component
  //And also attach the menu to the target element
  const openMenu = (e: MouseEvent<HTMLButtonElement> | null): void => {
    setAnchorEl(e && e.currentTarget);
  };

  const user =
    currUser && currUser.length > 0
      ? {
          name: currUser[0].name,
          email: currUser[0].email,
          phone: currUser[0].phone,
          address: currUser[0].address,
          username: currUser[0].username,
        }
      : null;

  //Function that triggers the logout reducer
  const logout = (): void => {
    userDispatch("LOGOUT", { name: "", email: "" }).then((response) => {
      if (response) {
        history.push("/");
      }
    });
  };
  console.log(modalResponse);
  const returnJsx = loading ? (
    <LinearProgress />
  ) : (
    <Paper className={paperStyles.root}>
      <ChatHistory
        setOption={setOption}
        option={option}
        setChat={setCurrChat}
        setConv={setCurrConv}
        conversations={conversations}
        contacts={contacts}
        people={people}
        setAnchorEl={openMenu}
        anchorEl={anchorEl}
        handleClose={closeMenu}
        logout={logout}
        openProfile={setOpenProfile}
        search={search}
      />
      <Chat
        name={user?.name}
        username={user?.username}
        setMessage={setMessage}
        send={send}
        messages={messages}
        message={message}
        chatRef={chatRef}
      />
      <ChatProfile
        user={user}
        toggle={setToggleProfile}
        showProfile={toggleProfile}
      />
      <ModalProfile
        open={openProfile}
        setOpen={setOpenProfile}
        setResponse={setModalResponse}
      />
      <Dialog
        open={typeof modalResponse === "string" ? true : false}
        onClose={() => setModalResponse(false)}
      >
        <DialogTitle>{modalResponse}</DialogTitle>
      </Dialog>
    </Paper>
  );

  return returnJsx;
};

export default ChatComponent;
