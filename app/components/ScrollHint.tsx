import React from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/core";

export const ScrollHint = ({ displayed, ...props }) => {
  // const status = ([status, setStatus] = useState());
  //
  // useEffect(() => {}, [displayed]);

  return (
    <Container {...props} displayed={displayed} viewBox="-120 -120 240 240">
      <PathShadow d="M-100 -20 Q-100 -120 0 -120 Q100 -120 100 -20 L100 20 Q100 120 0 120 Q-100 120 -100 20z" />
      <Group transform="translate(0,-24)">
        <PathTic d="M0 -2 L0 2" />
        <PathPotato d="M-25 -20 Q-25 -45 0 -45 Q25 -45 25 -20 L25 20 Q25 45 0 45 Q-25 45 -25 20z" />
        <Text x={0} y={90} data-nosnippet>
          scroll
        </Text>
      </Group>
    </Container>
  );
};

const disappearAnimation = keyframes`
0%{
    transform   : translate3d(0,0,0);
    opacity     : 1;
}
20%{
    transform   : translate3d(0,10px,0);
    opacity     : 1;
}
100%{
    transform   : translate3d(0,-100px,0);
    opacity     : 0;
}`;

const shadowAnimation = keyframes`
  0%{ transform   : scale(0.92); }
  75%{ transform   : scale(1); }
  100%{ transform   : scale(0.92); }
`;
const ticAnimation = keyframes`
  0%{ transform    : translate3d(0,-10px,0); }
  75%{ transform   : translate3d(0,10px,0); }
  100%{ transform  : translate3d(0,-10px,0); }
`;
const mouseAnimation = keyframes`
  0%{ transform   : translate3d(0,-40px,0) }
  75%{ transform   : translate3d(0,-8px,0) }
  100%{ transform   : translate3d(0,-40px,0) }
`;
const textAnimation = keyframes`
  0%{ transform   : translate3d(0,4px,0) }
  70%{ transform   : translate3d(0,2px,0) }
  75%{ transform   : translate3d(0,-6px,0) }
  100%{ transform   : translate3d(0,4px,0) }
`;

const Container = styled.svg`
  width: 120px;
  height: 120px;

  ${(props: any) =>
    props.displayed
      ? css`
          animation: ${disappearAnimation} 400ms ease;
          opacity: 0;
        `
      : ""}
` as any;

const PathTic = styled.path`
  fill: none;
  stroke: #fff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;

  animation: ${ticAnimation} 2000ms Infinite;
  stroke-width: 6;
`;

const PathPotato = styled.path`
  fill: none;
  stroke: #fff;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const PathShadow = styled.path`
  fill: rgba(0, 0, 0, 0.3);
  animation: ${shadowAnimation} 2000ms Infinite;
`;

const Text = styled.text`
  fill: #fff;
  font-family: helvetica;
  font-size: 32px;
  text-anchor: middle;
  letter-spacing: 12px;

  animation: ${textAnimation} 2000ms Infinite;
`;

const Group = styled.g`
  animation: ${mouseAnimation} 2000ms Infinite;
`;
