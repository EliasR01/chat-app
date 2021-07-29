import { ReactElement } from "react";
import { chatModalProps, modalMap, modalOptions } from "./types";
import { Menu, MenuItem } from "@material-ui/core";

const ChatModal = ({
  type,
  element,
  open,
  handleClose,
  action,
  action2,
}: //   closeAction,
chatModalProps): ReactElement => {
  const menuOptions: modalMap = {
    people: [{ title: "Add contact", action: action }],
    contacts: [
      { title: "Text a message", action: action },
      { title: "Remove contact", action: action2 },
    ],
  };

  return (
    <Menu
      id="simple-menu"
      keepMounted
      anchorEl={element}
      open={open}
      onClose={handleClose}
    >
      {menuOptions[type] &&
        menuOptions[type].map(({ title, action }: modalOptions, index) => (
          <MenuItem
            onClick={() => {
              action();
              handleClose();
            }}
            key={index}
          >
            {title}
          </MenuItem>
        ))}
    </Menu>
  );
};

export default ChatModal;
