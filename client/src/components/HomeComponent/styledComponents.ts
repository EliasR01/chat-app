import styled from "styled-components";

export const Text = styled.span`
  align-self: justify;
  font-size: 2em;
  margin-left: 1em;
`;

export const ForgotPassword = styled.span`
  align-self: center;
  color: #007fff;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Error = styled.span`
  align-self: center;
  color: #ff0000;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  margin: auto;
`;

export const Title = styled.h2`
  align-self: justify;
  color: #007fff;
  font-size: 3em;
`;
