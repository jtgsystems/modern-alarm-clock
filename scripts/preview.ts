import puppeteer from 'puppeteer'

async function main() {
  const url = process.env.PREVIEW_URL || 'http://localhost:3000'
  const headless = process.env.HEADLESS !== 'false'

  const browser = await puppeteer.launch({ headless, defaultViewport: { width: 1280, height: 800 } })
  const page = await browser.newPage()

  page.on('console', (msg) => {
    const type = msg.type()
    // eslint-disable-next-line no-console
    console.log(`[console:${type}]`, ...msg.args().map(() => msg.text()))
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

  // Navigate to the app
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120_000 })

  // Optional: take a screenshot for CI visibility
  if (process.env.SCREENSHOT) {
    await page.screenshot({ path: 'preview-screenshot.png', fullPage: true })
  }

  // Keep browser open if not headless so user can interact
  if (!headless) {
    // eslint-disable-next-line no-console
    console.log('Preview running. Close the browser to exit.')
  } else {
    // In headless mode, wait a short time to allow observation then close
    await new Promise((r) => setTimeout(r, 5000))
    await browser.close()
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
