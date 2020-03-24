import { pathExists } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { browser } from 'puppeteer';
import { Browser } from 'puppeteer/lib/Browser';
import { saveVideo } from '../src/saveVideo';

describe('saveVideo', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await browser.launch();
  });

  afterAll(() => browser.close());

  it('captures a video of the page', async () => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const savePath = join(tmpdir(), `${Date.now()}.mp4`);

    const capture = await saveVideo(page, savePath);
    await page.setContent('<html>hello world</html>');
    await capture.stop();

    const videoPathExists = await pathExists(savePath);
    expect(videoPathExists).toBe(true);

    await page.close();
  });
});
