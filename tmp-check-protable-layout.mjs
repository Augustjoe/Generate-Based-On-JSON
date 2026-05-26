import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import WebSocket from 'ws'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const port = 9224
const userDataDir = join(process.cwd(), '.tmp-chrome-profile-protable')
const screenshotPath = join(process.cwd(), 'tmp-protable-layout.png')
const metricsPath = join(process.cwd(), 'tmp-protable-layout.json')

rmSync(userDataDir, { recursive: true, force: true })
mkdirSync(userDataDir, { recursive: true })

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--window-size=905,859',
  'about:blank',
])

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const fetchJson = async (url, init) => {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.json()
}

for (let i = 0; i < 50; i += 1) {
  try {
    await fetchJson(`http://127.0.0.1:${port}/json/version`)
    break
  } catch {
    await delay(100)
  }
}

const page = await fetchJson(`http://127.0.0.1:${port}/json/new`, { method: 'PUT' })
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((resolve) => ws.once('open', resolve))

let id = 0
const pending = new Map()
ws.on('message', (raw) => {
  const msg = JSON.parse(String(raw))
  if (!msg.id || !pending.has(msg.id)) return
  const { resolve, reject } = pending.get(msg.id)
  pending.delete(msg.id)
  if (msg.error) reject(new Error(JSON.stringify(msg.error)))
  else resolve(msg.result)
})

const send = (method, params = {}) => {
  id += 1
  ws.send(JSON.stringify({ id, method, params }))
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
}

await send('Page.enable')
await send('Runtime.enable')
await send('Page.navigate', { url: 'http://localhost:5173/login' })
await delay(1000)
await send('Runtime.evaluate', {
  expression: `
    localStorage.setItem('token', 'mock-token-layout-check');
    localStorage.setItem('userInfo', JSON.stringify({ userName: 'admin' }));
  `,
})
await send('Page.navigate', { url: 'http://localhost:5173/proTable' })
await delay(4000)

const metrics = await send('Runtime.evaluate', {
  returnByValue: true,
  expression: `
    (() => {
      const searchCard = document.querySelector('.pro-table > div:first-child .n-card__content')
      const rect = (el) => {
        const r = el.getBoundingClientRect()
        return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }
      }
      return {
        searchCard: searchCard ? rect(searchCard) : null,
        formItems: Array.from(searchCard?.querySelectorAll('.n-form-item') || []).map((el) => ({ text: el.innerText, ...rect(el) })),
        inputs: Array.from(searchCard?.querySelectorAll('.n-input, .n-base-selection') || []).map((el) => ({ text: el.textContent, ...rect(el) })),
        buttons: Array.from(searchCard?.querySelectorAll('button') || []).map((el) => ({ text: el.innerText, ...rect(el) })),
      }
    })()
  `,
})
writeFileSync(metricsPath, JSON.stringify(metrics.result.value, null, 2), 'utf8')

const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true })
writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'))
ws.close()
chrome.kill()
