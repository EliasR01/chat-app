import styled from "styled-components";

export const ExitWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 40px;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10%;
  justify-content: flex-start;
  align-items: center;
`;

export const MediaWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1);
  max-width: 150px;
  margin-top: 10%;
  margin-left: 5%;
`;

export const Media = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(40px, 60px));
  grid-gap: 1vw;
`;
