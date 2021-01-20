import styled from "styled-components";

export const HeaderWrapper = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;

export const ItemsWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin: auto;
`;

export const ChatActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
`;

export const InputWrapper = styled.div`
  width: 50%;
  margin: auto;
`;

export const ChatWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: safe flex-end;
  flex-flow: column;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: none;
`;
