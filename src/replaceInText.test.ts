import { expect } from "./expect.test";
import { replaceInText } from "./replaceInText";

describe(`replaceInText`, () => {
  const imgUrl = `https://example.com/image.jpg`;
  const expected = `![Original source: ${imgUrl}](./img/image.jpg)`;
  it(`Basic function`, () => {
    const toReplace = `![](image.jpg)](${imgUrl})`;
    const res = replaceInText(toReplace, toReplace, imgUrl, `./img/image.jpg`);

    expect(res).to.be.eq(expected);
  });
  it(`Replaces multiple occurences`, () => {
    const content = `![](image.jpg)](${imgUrl})`;
    let body = content.repeat(10);
    body = replaceInText(body, content, imgUrl, `./img/image.jpg`);
    expect(body).to.be.eq(expected.repeat(10));
  });
  it(`Includes original source info`, () => {
    const content = `![](image.jpg)](${imgUrl})`;
    const res = replaceInText(content, content, imgUrl, `./img/image.jpg`);

    expect(res).to.contain(`${imgUrl}`);
  });
});
