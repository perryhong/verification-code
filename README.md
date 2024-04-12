## verification code library

### Install

Using `npm` to install

```bash
npm install @pekings/verification-code --save
```

Using `yarn` to install

```bash
yarn add @pekings/verification-code
```

### Quickstart

```js
// 引入lib
import VerificationCode from "@pekings/verification-code";

<canvas width="200" height="100" id="v-code"></canvas>;

const vCode = new VerificationCode(
  document.getElementById("v-code"),
  (code) => {
    // 接收每次生成的随机验证码
    console.log(code);
  }
);
// 开启渲染
vCode.draw();
```
