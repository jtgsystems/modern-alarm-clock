import { chromium, firefox, webkit, Browser } from 'playwright'

async function main() {
  const url = process.env.PREVIEW_URL || 'http://localhost:3000'
  const engine = (process.env.BROWSER || 'chromium').toLowerCase()
  const headless = process.env.HEADLESS !== 'false'

  let browser: Browser
  if (engine === 'firefox') browser = await firefox.launch({ headless })
  else if (engine === 'webkit') browser = await webkit.launch({ headless })
  else browser = await chromium.launch({ headless })

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  page.on('console', (msg) => {
    // eslint-disable-next-line no-console
    console.log(`[console:${msg.type()}]`, msg.text())
  })
  page.on('pageerror', (err) => {
    // eslint-disable-next-line no-console
    console.error('[pageerror]', err)
  })
  page.on('response', (res) => {
    if (res.status() >= 400) {
      // eslint-disable-next-line no-console
      console.warn('[response]', res.status(), res.url())
    }
  })

  await page.goto(url, { waitUntil: 'networkidle' })

  if (process.env.SCREENSHOT) {
    await page.screenshot({ path: 'preview-screenshot.png', fullPage: true })
  }

  if (headless) {
    await page.waitForTimeout(3000)
    await browser.close()
  } else {
    // keep open until manually closed
    // eslint-disable-next-line no-console
    console.log('Preview running. Close the window to exit.')
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})

