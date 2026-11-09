// 通用 CDP 操作工具：open / html / text / eval / screenshot
const http = require('http');
const fs = require('fs');

const PORT = Number(process.env.CDP_PORT) || 63158;

function httpGet(path, method = 'GET', port) {
  const usePort = Number(port) || PORT;
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: usePort, path, method }, (res) => {
      let b = '';
      res.on('data', (d) => (b += d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(b));
        } catch (e) {
          reject(new Error('parse fail: ' + b.slice(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function wsConnect(url) {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const ws = new WebSocket(url, { perMessageDeflate: false, maxPayload: 200 * 1024 * 1024 });
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

let _id = 0;
function send(ws, method, params = {}, timeout = 45000) {
  const id = ++_id;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout ' + method)), timeout);
    const onMsg = (raw) => {
      let m;
      try {
        m = JSON.parse(raw);
      } catch (e) {
        return;
      }
      if (m.id === id) {
        clearTimeout(timer);
        ws.off('message', onMsg);
        if (m.error) reject(new Error(method + ': ' + JSON.stringify(m.error)));
        else resolve(m.result);
      }
    };
    ws.on('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function newTab(url) {
  const t = await httpGet('/json/new?' + encodeURIComponent(url));
  return t;
}

async function getWs() {
  const ver = await httpGet('/json/version');
  return ver.webSocketDebuggerUrl;
}

module.exports = { httpGet, wsConnect, send, newTab, getWs, PORT, fs };
