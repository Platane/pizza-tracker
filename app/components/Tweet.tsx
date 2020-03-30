import React, { useState, useRef, useEffect } from "react";
import { TweetPlaceholder } from "./TweetPlaceholder";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { wait } from "../utils/time";
import { useTwitterSDK } from "./_hooks/useTwitterSDK";

export const Tweet = ({
  width,
  defaultHeight = 180,
  tweet_id = undefined as undefined | string,
  worldScale = 1,
  ...props
}) => {
  const twttr = useTwitterSDK();
  const [status, setStatus] = useState(
    "not-loaded" as "not-loaded" | "transition" | "loaded"
  );
  const [height, setHeight] = useState(defaultHeight as number | null);
  const ref = useRef(null as any);
  const worldScaleRef = useRef(worldScale);
  worldScaleRef.current = worldScale;

  useEffect(() => {
    setStatus("not-loaded");
    setHeight(defaultHeight);

    if (!twttr) return;
    if (!tweet_id) return;

    let canceled = false;

    while (ref.current.children[0])
      ref.current.removeChild(ref.current.children[0]);

    twttr.widgets
      .createTweet(tweet_id, ref.current, {
        conversation: "none",
        "link-color": "#4d107b",
        width
      })
      .then(async () => {
        await wait(60);

        if (canceled) return;

        const height =
          ref.current.getBoundingClientRect().height / worldScaleRef.current;
        setStatus("transition");
        setHeight(height);

        await wait(800);

        if (canceled) return;

        setStatus("loaded");
        setHeight(null);
      });

    return () => {
      canceled = true;
    };
  }, [twttr, tweet_id]);

  return (
    <Container
      {...props}
      style={{
        width: width + "px",
        height: height ? height + "px" : "auto",
        ...props.style
      }}
    >
      {status !== "loaded" && <Placeholder />}
      <Wrapper ref={ref} loaded={status !== "not-loaded"} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  transition: height 200ms;
`;

const Placeholder = styled(TweetPlaceholder)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: auto;
`;

const Wrapper = styled.div`
  position: relative;

  ${(props: any) =>
    props.loaded
      ? css`
          opacity: 1;
          transition: opacity 300ms 400ms;
        `
      : css`
          opacity: 0.01;
          transition: opacity 300ms;
        `}

  & .twitter-tweet {
    margin: 0 !important;
  }
` as any;
