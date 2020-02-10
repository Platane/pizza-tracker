import React, { useState, useRef, useEffect } from "react";
import { Tweet } from "./Tweet";
import styled from "@emotion/styled";
import { useTweetList } from "./_hooks/useTweetList";
import { TweetCheapPlaceholder } from "./TweetCheapPlaceholder";

const getStatus = ({
  s
}): "void" | "placeholder" | "cheap-placeholder" | "live" => {
  if (s < 0.01) return "void";

  if (s < 0.3) return "cheap-placeholder";

  // if (s < 0.3) return "placeholder";

  return "live";
};

const defaultHeight = 180;

export const TweetList = ({ width, users, limit, date, ...props }) => {
  const tweets = useTweetList(users, date, limit);

  const [toLoad, setToLoad] = useState([] as string[]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToLoad(toLoad =>
        [
          ...toLoad,
          ...tweets.filter(t => getStatus(t) === "live").map(t => t.tweet_id)
        ]
          .filter((x, i, arr) => i === arr.indexOf(x))
          .slice(0, 30)
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [tweets]);

  return (
    <Container {...props}>
      {tweets.map(t => {
        let children: any = undefined;

        const s = 1 - (1 - t.s) * (1 - t.s);
        const y = t.y;

        const scale = 0.05 + s * 0.8;

        switch (getStatus(t)) {
          case "live":
          case "placeholder":
            children = <Tweet width={width} />;
            break;
          case "cheap-placeholder":
            children = (
              <TweetCheapPlaceholder
                style={{ width: width + "px", height: defaultHeight + "px" }}
              />
            );
            break;
          case "void":
            children = null;
            break;
        }

        if (toLoad.includes(t.tweet_id))
          children = (
            <Tweet worldScale={scale} tweet_id={t.tweet_id} width={width} />
          );

        if (!children) return null;

        return (
          <Block
            key={t.tweet_id}
            style={{
              filter: `contrast(${Math.max(
                0,
                1 - (1 - s) * 1
              )})  grayscale(${(1 - s) * 1.2}) `,
              transform: `translate3d(0,${y * 160 + 160}px,0) scale(${scale})`,
              zIndex: Math.floor(t.s * 500)
            }}
          >
            {children}
          </Block>
        );
      })}
    </Container>
  );
};

const Block = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 2px;
  width: 100%;
  // background-color: yellow;
`;

const Container = styled.div`
  position: relative;
  perspective: 2000px;
`;
