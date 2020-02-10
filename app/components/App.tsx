import React, { useMemo, useEffect } from "react";
import { useData } from "./_hooks/useData";
import { useScrollValue } from "./_hooks/useScrollValue";
import styled from "@emotion/styled";
import { Chart } from "./Chart";
import { Footer } from "./Footer";
import { ScrollHint } from "./ScrollHint";
import { roundYear } from "./../utils/date";
import { lerp } from "./../utils/math";
import { useScrolledOnce } from "./_hooks/useScrolledOnce";
import { TweetList } from "./TweetList";
import { useYear, years } from "./_hooks/useYear";
import yearTitles from "../assets/content/yearTitles";
import { css } from "@emotion/core";

// @ts-ignore
import fontItalianno from "./../assets/fonts/Italianno/Italianno-Regular-OTF.otf";

export const App = () => {
  const users = useData();
  const k = useScrollValue();
  const scrolledOnce = useScrolledOnce();
  const [year, setYear] = useYear();

  const limit = useMemo(
    () =>
      [
        roundYear(new Date(`01/01/${year} GMT+0`)) + 1,
        roundYear(new Date(`01/01/${year + 1} GMT+0`)) - 1
      ] as [number, number],
    [year]
  );

  const kDate = lerp(limit[0], limit[1])(k);

  const yearColor = `hsl(${(year ^ 3) + (year ^ 2) * 47},60%,40%)`;

  useEffect(() => {
    if (document.body.parentElement)
      document.body.parentElement.style.backgroundColor = yearColor;
  }, [yearColor]);

  return (
    <>
      <Container
        style={{
          backgroundColor: yearColor
        }}
      >
        <Header>
          <YearBar>
            {years.map(y => (
              <YearLink
                key={y}
                selected={y === year}
                href={`#${y}`}
                onClick={e => {
                  setYear(y);
                  window.scrollTo(0, 0);
                  e.preventDefault();
                }}
              >
                {y}
              </YearLink>
            ))}
          </YearBar>

          <Column>
            <Title>〝{yearTitles[year] || yearTitles.default}〟</Title>
            <TweetList_ users={users} limit={limit} date={kDate} width={280} />
          </Column>
        </Header>

        <Chart users={users} limit={limit} date={kDate} />

        <ScrollHint_ displayed={scrolledOnce} />

        <Footer_ />
      </Container>
    </>
  );
};

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const Column = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 600px) {
    align-items: center;
    flex-direction: column;
  }
`;

const TweetList_ = styled(TweetList)`
  height: 400px;
  width: 260px;
  flex: auto 0 0;
`;

const YearBar = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const YearLink = styled.a`
  padding: 10px 10px 4px 10px;
  font-family: helvetica;
  font-size: 20px;
  color: #fff;
  z-index: 5000;
  position: relative;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

  ${(props: any) =>
    props.selected
      ? css`
          text-decoration: underline;
        `
      : ""}
` as any;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color 220ms linear;
  // display: flex;
  // flex-direction: row;
`;

const Footer_ = styled(Footer)`
  position: fixed;
  bottom: 0;
  right: 0;
`;

const ScrollHint_ = styled(ScrollHint)`
  left: calc(50% - 60px);
  right: 0;
  position: absolute;
  top: 60px;

  @media (orientation: portrait) {
    top: auto;
    bottom: 60px;
  }
`;

const Title = styled.h1`

font-size: 38px;
margin:0 10px;
color: #fff;
text-shadow: 0 1px 4px rgba(0,0,0,0.2);
font-family: Italianno, Rockwell, serif;
letter-spacing: 5px;

text-align:center;

display:inline-block;
flex: 100% 1 1;

@media (max-width: 600px) {
font-size: 26px;
letter-spacing: 3px;
}

@font-face {
    font-family: Italianno;
    src: url("${fontItalianno}");
  }`;
