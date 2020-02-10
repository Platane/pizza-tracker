import React from "react";
import styled from "@emotion/styled";

// @ts-ignore
import fontItalianno from "../assets/fonts/Italianno/Italianno-Regular-OTF.otf";

export const Title = ({ year, title, ...props }) => (
  <Container {...props}>
    <H1>〝 {title} 〟</H1>
  </Container>
);
// <H1 style={{ fontSize: "50px", letterSpacing: "12px" }}>{year}</H1>
// <H1 style={{ transform: "rotate(65deg)", display: "block" }}>f</H1>

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  opacity: 0.8;
  width: 100%;
  max-width: 600px;
  padding: 16px;
`;

const H1 = styled.h1`

font-size: 48px;
margin:0;
color: #fff;
text-shadow: 0 1px 4px rgba(0,0,0,0.5);
font-family: Italianno, serif;
letter-spacing: 4px;


@font-face {
    font-family: Italianno;
    src: url("${fontItalianno}");
  }`;
