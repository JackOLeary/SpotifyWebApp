//haven't got it working

import { css } from 'styled-components/macro';

const fonts = css`
  @font-face {
    font-family: 'Circular Std';
    src: url('../fonts/roboto.woff2') format('woff2'),
    url('../fonts/roboto.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Circular Std';
    src: url('../fonts/roboto.woff2') format('woff2'),
    url('../fonts/roboto.woff') format('woff');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Circular Std';
    src: url('../fonts/roboto.woff2') format('woff2'),
    url('../fonts/roboto.woff') format('woff');
    font-weight: 900;
    font-style: normal;
  }
`;

export default fonts;