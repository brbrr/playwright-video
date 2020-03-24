import { browser as br } from 'puppeteer';
import { Browser } from 'puppeteer/lib/Browser';
import { ScreencastFrameCollector } from '../src/ScreencastFrameCollector';

describe('ScreencastFrameCollector', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await br.launch();
  });

  afterAll(() => browser.close());

  it('emits screencast frames of a page', async () => {
    const page = await browser.newPage();

    const collector = await ScreencastFrameCollector.create(page);
    await collector.start();

    await new Promise(resolve => {
      collector.on('screencastframe', payload => {
        expect(payload.received).toBeTruthy();
        resolve();
      });
    });

    await page.close();
  });

  it('disposes the CDP session when stopped', async () => {
    const page = await browser.newPage();

    const collector = await ScreencastFrameCollector.create(page);
    expect(collector._client._connection).toBeTruthy();

    await collector.stop();
    expect(collector._client._connection).toBeNull();

    await page.close();
  });
});
