import {
  ReactElement,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Paper, LinearProgress, Dialog, DialogTitle } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Chat from "./Chat";
import ChatHistory from "./ChatHistory";
import ChatProfile from "./ChatProfile";
import ModalProfile from "./ChatProfile/ModalProfile/index";
import { usePaperStyles } from "./styles";
import { UserContext } from "../../context/User/UserContext";
import { ChatContext } from "../../context/Chat/ChatContext";
import { closeConnection } from "../../websocket/index";
import { Props, Conversation, Message, Contact, User } from "./types";
import { EmojiData } from "emoji-mart";

const ChatComponent = ({ history }: Props): ReactElement => {
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
  const [anchorEl, setAnchorEl] =
    useState<HTMLLIElement | HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[] | undefined>([]);
  const [people, setPeople] = useState<User[] | undefined>([]);
  const [modalResponse, setModalResponse] = useState<string | boolean>(false);
  const [menuOption, setMenuOption] = useState<string>("");
  const [error, setError] = useState<string | boolean>(false);
  const { state: userState, dispatch: userDispatch } = useContext(UserContext);
  const { state: chatState, dispatch: chatDispatch } = useContext(ChatContext);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //Function that fetch all the messages that the user has, when log in or refresh page.
  const fetchMessages = async (): Promise<void> => {
    await chatDispatch("LOGIN", {
      username: userState.username,
      messages: {},
      conversations: {},
    })
      .then((response) => {
        setLoading(false);
        if (response.code !== 1) {
          closeConnection();
          history.goBack();
        }
      })
      .catch(() => {
        closeConnection();
        history.goBack();
      });
  };

  //UseEffect that executes once in the component and triggers the fetchMessages function to retrieve all the messages
  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //This updates the contacts and people
  useEffect(() => {
    const allPeople = chatState.people?.filter(
      (person) => person.name !== userState.name
    );
    setPeople(allPeople);
    setContacts(chatState.contacts);
  }, [chatState.people, chatState.contacts, userState.name]);
  //Every time that a new conversation is selected, this   function is executed.
  useEffect(() => {
    const currentUser = currChat
      ? chatState.contacts?.filter((contact) => contact.username === currChat)
      : null;
    setCurrUser(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currChat]);

  //This only executes when the search input field is changed
  //It changes the values depending on the selected option, to filter the conversations or de contacts according to the value to search
  useEffect(() => {
    if (option === "history" || option === "archived") {
      let convs = [];

      for (const index in chatState.conversations) {
        if (
          chatState.conversations[index].sts === "CREATED" &&
          (chatState.conversations[index].creator.includes(searchValue) ||
            chatState.conversations[index].member.includes(searchValue)) &&
          chatState.conversations[index].sts !== "DELETED"
        ) {
          const messageIdx = chatState.conversations[index].lastMessage.String;
          const conversation: Conversation = {
            createdAt: chatState.conversations[index].createdAt,
            creator: chatState.conversations[index].creator,
            deletedAt: chatState.conversations[index].deletedAt,
            id: index,
            member: chatState.conversations[index].member,
            sts: chatState.conversations[index].sts,
            updatedAt: chatState.conversations[index].updatedAt,
            lastMessage:
              messageIdx.length > 1 &&
              chatState.messages[messageIdx] &&
              (chatState.messages[messageIdx].sts === "READED" ||
                chatState.messages[messageIdx].sts === "SENT")
                ? chatState.messages[messageIdx].body
                : "",
          };
          convs.push(conversation);
        }
      }

      setConversations(convs);
    } else if (option === "contacts") {
      const cont = chatState.contacts?.filter(
        (contact) =>
          contact.name.includes(searchValue) ||
          contact.username.includes(searchValue)
      );

      setContacts(cont);
    } else if (option === "people") {
      const peop = chatState.people?.filter(
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
      const convs = [];

      for (const index in chatState.conversations) {
        if (
          chatState.conversations[index].sts === "ARCHIVED" &&
          (chatState.conversations[index].creator === userState.username ||
            chatState.conversations[index].member === userState.username) &&
          chatState.conversations[index].sts !== "DELETED"
        ) {
          const messageIdx = chatState.conversations[index].lastMessage.String;
          const conversation: Conversation = {
            createdAt: chatState.conversations[index].createdAt,
            creator: chatState.conversations[index].creator,
            deletedAt: chatState.conversations[index].deletedAt,
            id: index,
            member: chatState.conversations[index].member,
            sts: chatState.conversations[index].sts,
            updatedAt: chatState.conversations[index].updatedAt,
            lastMessage:
              messageIdx.length > 1 &&
              chatState.messages[messageIdx] &&
              (chatState.messages[messageIdx].sts === "READED" ||
                chatState.messages[messageIdx].sts === "SENT")
                ? chatState.messages[messageIdx].body
                : "",
          };
          convs.push(conversation);
        }
      }
      setConversations(convs);
    } else if (option === "history") {
      const convs = [];
      for (const index in chatState.conversations) {
        if (
          chatState.conversations[index].sts === "CREATED" &&
          (chatState.conversations[index].creator === userState.username ||
            chatState.conversations[index].member === userState.username) &&
          chatState.conversations[index].sts !== "DELETED"
        ) {
          const messageIdx = chatState.conversations[index].lastMessage.String;
          const conversation: Conversation = {
            createdAt: chatState.conversations[index].createdAt,
            creator: chatState.conversations[index].creator,
            deletedAt: chatState.conversations[index].deletedAt,
            id: index,
            member: chatState.conversations[index].member,
            sts: chatState.conversations[index].sts,
            updatedAt: chatState.conversations[index].updatedAt,
            lastMessage:
              messageIdx.length > 1 &&
              chatState.messages[messageIdx] &&
              (chatState.messages[messageIdx].sts === "READED" ||
                chatState.messages[messageIdx].sts === "SENT")
                ? chatState.messages[messageIdx].body
                : "",
          };
          convs.push(conversation);
        }
      }
      setConversations(convs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatState.conversations, option]);

  //Calls every time that messages are changed, or the user selects other conversation.
  //It changes the messages variable and set the messages that corresponds to the selected conversation
  useEffect(() => {
    const filteredMessages = [];
    for (const index in chatState.messages) {
      if (
        chatState.messages[index].conversationId === currConv &&
        (chatState.messages[index].sts === "READED" ||
          chatState.messages[index].sts === "SENT")
      ) {
        const message: Message = {
          id: index,
          body: chatState.messages[index].body,
          sts: chatState.messages[index].sts,
          type: chatState.messages[index].type,
          conversationId: chatState.messages[index].conversationId,
          createdAt: chatState.messages[index].createdAt,
          receiver: chatState.messages[index].receiver,
          sender: chatState.messages[index].sender,
          updatedAt: chatState.messages[index].updatedAt,
          userId: chatState.messages[index].userId,
        };
        filteredMessages.push(message);
      }
    }
    filteredMessages.sort((a, b) =>
      a.createdAt && b.createdAt ? (a.createdAt > b.createdAt ? 1 : -1) : 0
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
  }, [messages, currConv]);

  //Function that sends the message
  const send = (): void => {
    const socketMessage = {
      type: 1,
      body: message,
      sender: userState.username,
      receiver: currChat,
      sts: "SENT",
      conversationId: currConv,
    };

    const uniqueMessage = {
      first: socketMessage,
    };

    chatDispatch("SEND", { messages: uniqueMessage, conversations: {} }).then(
      (res) => {
        if (res.code === 1) {
          setMessage("");
        } else {
          //Error
        }
      }
    );
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
    setMenuOption("");
  };

  //Function that opens the Menu, in the ChatProfile component
  //And also attach the menu to the target element
  // const openMenu = (e: MouseEvent<HTMLButtonElement> | null): void => {
  //   setAnchorEl(e && e.currentTarget);
  // };

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
    userDispatch("LOGOUT", {
      data: new FormData(),
      email: "",
      password: "",
    }).then((response) => {
      if (response) {
        history.push("/");
      }
    });
  };
  //Add emoji to chat message
  const addEmoji = (emoji: EmojiData) => {
    setMessage(message + emoji.native);
  };

  //Anchors the menu to the chosen element
  const anchorOptions = (
    e: HTMLLIElement | HTMLButtonElement | null,
    option: string
  ) => {
    setAnchorEl(e);
    setMenuOption(option);
  };

  //AddContact function, adds a new contact to the user
  const addContact = useCallback(
    (person: User) => {
      chatDispatch("ADD_CONTACT", {
        people: [person],
        username: userState.username,
        messages: {},
        conversations: {},
      }).then((response) => {
        if (response.code === 1) {
          //Do the response
          console.log(response.data);
        } else {
          //Do the error
          console.log(response.data);
        }
      });
    },
    [chatDispatch, userState.username]
  );

  //RemoveContact function, detaches user's contact
  const removeContact = useCallback(
    (contact: Contact) => {
      chatDispatch("REMOVE_CONTACT", {
        contacts: [contact],
        messages: {},
        conversations: {},
      }).then((res) => {
        if (res.code === 1) {
          //Not error
        } else {
          //Error
        }
      });
    },
    [chatDispatch]
  );

  //CreateConv function, creates a new conversation
  const createConv = (contactUsername: string) => {
    const conversation = conversations?.find(
      (conv) =>
        conv.member === contactUsername || conv.creator === contactUsername
    );

    if (conversation) {
      setCurrChat(contactUsername);
      setCurrConv(conversation.id);
      setOption("history");
      return;
    }

    chatDispatch("CREATE_CONV", {
      messages: {},
      conversations: {},
      username: contactUsername,
      creator: userState.username,
    }).then((res) => {
      if (res.code === 1) {
        setOption("history");
        setCurrChat(contactUsername);
        setCurrConv(res.data);
      } else {
        //Error
      }
    });
  };
  // console.log(currUser, currChat);
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
        anchorEl={anchorEl}
        handleClose={closeMenu}
        logout={logout}
        openProfile={setOpenProfile}
        search={search}
        anchorOptions={anchorOptions}
        menuOption={menuOption}
        addContact={addContact}
        removeContact={removeContact}
        createConv={createConv}
      />
      <Chat
        name={user?.name}
        username={user?.username}
        setMessage={setMessage}
        send={send}
        messages={messages}
        message={message}
        chatRef={chatRef}
        inputRef={inputRef}
        addEmoji={addEmoji}
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
      {error ? (
        <Alert severity="error" onClose={() => setError(false)}>
          {error}
        </Alert>
      ) : null}
    </Paper>
  );

  return returnJsx;
};

export default ChatComponent;
