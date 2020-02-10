import React from "react";
import styled from "@emotion/styled";

const githubLogoPath =
  "M.933.261A.498.498 0 00.249.08a.498.498 0 00-.154.727.49.49 0 00.247.18C.353.99.362.988.368.983a.026.026 0 00.008-.02 15.138 15.138 0 000-.092L.36.872A.268.268 0 01.28.87.1.1 0 01.235.85.083.083 0 01.207.81L.201.795A.16.16 0 00.18.762.078.078 0 00.15.737L.148.735A.052.052 0 01.14.726.036.036 0 01.133.717C.132.714.133.712.136.71a.042.042 0 01.02-.003l.012.002a.107.107 0 01.064.05c.01.017.022.03.036.04.014.01.028.014.043.014A.19.19 0 00.348.81.128.128 0 00.377.8.106.106 0 01.409.733.446.446 0 01.342.72.268.268 0 01.281.696.175.175 0 01.194.584.325.325 0 01.181.486.19.19 0 01.233.352.175.175 0 01.237.219C.25.215.268.22.293.228A.39.39 0 01.375.27a.461.461 0 01.25 0L.65.255A.353.353 0 01.71.226C.733.218.75.216.763.22c.02.05.02.093.005.133a.19.19 0 01.051.134c0 .037-.004.07-.013.098A.203.203 0 01.77.652.183.183 0 01.72.696.268.268 0 01.657.72a.448.448 0 01-.066.012c.022.02.034.05.034.092v.138c0 .007.002.014.008.02.005.004.014.006.025.004A.49.49 0 00.905.806.486.486 0 001 .512a.49.49 0 00-.067-.25z";

export const Footer = props => (
  <Container {...props}>
    <div>
      made by <A href="https://twitter.com/platane_">@platane</A>
    </div>
    <A title="github" href="https://github.com/platane/pizza-tracker">
      <Icon viewBox="0 0 1 1">
        <path d={githubLogoPath} />
      </Icon>
    </A>
  </Container>
);

const Container = styled.footer`
  color: #fff;
  font-family: helvetica;
  font-size: 0.9em;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Icon = styled.svg`
  margin-left: 10px;
  width: 18px;
  height: 18px;
  fill: #fff;
`;
const A = styled.a`
  color: #19b27f;
`;
