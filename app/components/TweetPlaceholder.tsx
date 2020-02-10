import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";

export const TweetPlaceholder = ({ ...props }) => (
  <Container {...props}>
    <Background />
    <Block1 />
    <Block2 />
    <Block3 />
    <Block4 />
    <Block5 />
    <Block6 />
  </Container>
);

const Container = styled.div`
  position: relative;
  border: solid 20px #fff;
  border-radius: 4px;
  width: 100%;
  height: calc(100% - 20px);
`;

const backgroundFlatLoading = keyframes`
    0%{background-position:0px 0}
    100%{background-position:200px 0}
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #efefef;
  background-image: linear-gradient(
    63deg,
    rgba(190, 190, 190, 0.1) 0%,
    rgba(190, 190, 190, 0) 2.5%,
    rgba(190, 190, 190, 0) 37.5%,
    rgba(190, 190, 190, 0.2) 42.5%,
    rgba(190, 190, 190, 0.2) 47.5%,
    rgba(190, 190, 190, 0) 52.5%,
    rgba(190, 190, 190, 0) 87.5%,
    rgba(190, 190, 190, 0.2) 92.5%,
    rgba(190, 190, 190, 0.2) 97.5%,
    rgba(190, 190, 190, 0.1) 100%
  );
  background-size: 200px 400px;
  z-index: 0;

  animation: ${backgroundFlatLoading} 1s infinite linear;
`;

const Block = styled.div`
  background-color: #fff;
  position: absolute;
  z-index: 2;
`;
const Block1 = styled(Block)`
  left: 0;
  right: 0;
  height: 40px;
  bottom: 16px;
`;
const Block2 = styled(Block)`
  left: 0;
  right: 0;
  height: 10px;
  top: 35px;
`;
const Block3 = styled(Block)`
  left: 35px;
  width: 10px;
  top: 0;
  height: 35px;
`;
const Block4 = styled(Block)`
  right: 105;
  width: 80px;
  top: 20px;
  height: 15px;
`;
const Block5 = styled(Block)`
  right: 0;
  width: 105px;
  top: 0;
  height: 35px;
`;
const Block6 = styled(Block)`
  right: 0;
  width: 200px;
  bottom: 0;
  height: 16px;
`;
