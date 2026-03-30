(async () => {

try { if (localStorage.getItem('_am_s_persist') === '1') localStorage.setItem('_am_persist_v2', '1'); } catch(e) {}
const _amAutoStart = window._amouraAutoStart || false;
const _amClickReq = parseInt(localStorage.getItem('_am_click_req') || '1');
if (!window._amClickCount) window._amClickCount = 0;
if (!_amAutoStart) window._amClickCount++;
if (window._amouraRunning) {
  if (_amAutoStart) return;
  const hiddenRoot = document.getElementById('_amoura_root');
  if (hiddenRoot && hiddenRoot.style.display === 'none') { hiddenRoot.style.display = ''; window._amClickCount = 0; window._amWasHiddenByBlur = false; return; }
  window._amouraRunning = false; hiddenRoot?.remove(); window._amClickCount = 0; await new Promise(r=>setTimeout(r,200));
}
if (!_amAutoStart && window._amClickCount < _amClickReq) { console.log('[amoura] click ' + window._amClickCount + '/' + _amClickReq); return; }
window._amClickCount = 0;
window._amouraAutoStart = false;
window._amouraRunning = true;

try { if (!localStorage.getItem('_am_discord_opened')) { localStorage.setItem('_am_discord_opened', '1'); window.open('https://discord.gg/dXpuTuGQ24', '_blank'); } } catch(e) {}

(function _hideGlobals() {
  const keys = ['_amouraRunning','_amouraAutoStart','_amouraInjecting','_bypassFetch','_solverServer','_amClickCount','_amWasHiddenByBlur','_netLog','_netSuspicious','_netByDomain'];
  for (const k of keys) {
    if (k in window) {
      const v = window[k];
      Object.defineProperty(window, k, { value: v, writable: true, enumerable: false, configurable: true });
    } else {
      Object.defineProperty(window, k, { value: undefined, writable: true, enumerable: false, configurable: true });
    }
  }
})();

const PROXY_URL = 'https://amoura-proxy.modmojheh.workers.dev';
const FB_KEY = 'AIzaSyAdGFar2cKaGkOsAEL_uWMmsl8MC9vb0hs';
const FB_PROJECT = 'ixll-2bc78';
const FB_AUTH_SIGNUP = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB_KEY;
const FB_AUTH_SIGNIN = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FB_KEY;
const FB_AUTH_REFRESH = 'https://securetoken.googleapis.com/v1/token?key=' + FB_KEY;
const FB_AUTH_UPDATE = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + FB_KEY;
const FB_FIRESTORE = 'https://firestore.googleapis.com/v1/projects/' + FB_PROJECT + '/databases/(default)/documents';
function _pingCounter() {
  try {
    fetch(FB_FIRESTORE.replace('/documents', '/documents:commit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes: [{ transform: { document: 'projects/' + FB_PROJECT + '/databases/(default)/documents/stats/global', fieldTransforms: [{ fieldPath: 'questionsAnswered', increment: { integerValue: '1' } }] } }] })
    }).catch(() => {});
  } catch(e) {}
}
function _logUnsupportedType(q) {
  try {
    const qEl = findQuestionEl();
    const html = (qEl && qEl.outerHTML || '').slice(0, 50000);
    const url = window.location.href;
    const ts = new Date().toISOString();
    const docId = 'unsupported_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const docPath = FB_FIRESTORE + '/unsupportedTypes/' + docId;
    const fields = {
      html: { stringValue: html },
      url: { stringValue: url },
      text: { stringValue: (q.text || '').slice(0, 4000) },
      timestamp: { stringValue: ts },
      subject: { stringValue: q.qType?.subject || 'unknown' },
      detectedType: { stringValue: q.qType?.type || 'unknown' }
    };
    fetch(docPath, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    }).catch(() => {});
    if (typeof _secFetch === 'function' && typeof _authHeaders === 'function' && typeof _authToken !== 'undefined' && _authToken) {
      fetch(PROXY_URL + '/log-unsupported', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ..._authHeaders() },
        body: JSON.stringify({ html: html.slice(0, 30000), url, text: (q.text || '').slice(0, 4000), subject: q.qType?.subject || 'unknown', timestamp: ts })
      }).catch(() => {});
    }
    console.log('[amoura] logged unsupported question type to Firebase:', docId);
  } catch(e) { console.warn('[amoura] failed to log unsupported type:', e.message); }
}
let DELAY_MIN = 800;
let DELAY_MAX = 2000;
const _fetch = window._bypassFetch;
const SERVER = window._solverServer || 'https://ixll-2bc78.web.app';
if (!_fetch) { console.error('[amoura] no bypass fetch'); return; }
const sleep = ms => new Promise(r => setTimeout(r, ms));
function _gr(mean, sd, lo, hi) { let u,v,s; do { u=Math.random()*2-1; v=Math.random()*2-1; s=u*u+v*v; } while(s>=1||s===0); return Math.max(lo,Math.min(hi,Math.round(mean+sd*u*Math.sqrt(-2*Math.log(s)/s)))); }

const _origToString = Function.prototype.toString;
const _nativeBrand = new WeakMap();
function _cloak(fn, name) { _nativeBrand.set(fn, 'function ' + name + '() { [native code] }'); }
Function.prototype.toString = function() { return _nativeBrand.get(this) || _origToString.call(this); };
Function.prototype.toString.toString = function() { return 'function toString() { [native code] }'; };
_cloak(Function.prototype.toString, 'toString');

(function _poisonCanvas() {
  
  var _seed = 0;
  try { _seed = parseInt(sessionStorage.getItem('_am_cseed') || '0'); } catch(e) {}
  if (!_seed) { _seed = (Math.random() * 2147483647) | 0; try { sessionStorage.setItem('_am_cseed', String(_seed)); } catch(e) {} }

  
  function _xor32() { _seed ^= _seed << 13; _seed ^= _seed >> 17; _seed ^= _seed << 5; return (_seed >>> 0) / 4294967296; }

  
  var _origToDataURL = HTMLCanvasElement.prototype.toDataURL;
  var _poisonedToDataURL = function() {
    var ctx = this.getContext('2d');
    if (ctx && this.width > 0 && this.height > 0) {
      try {
        var w = Math.min(this.width, 16), h = Math.min(this.height, 16);
        var img = ctx.getImageData(0, 0, w, h);
        for (var i = 0; i < img.data.length; i += 4) {
          
          if (_xor32() < 0.3) img.data[i] ^= 1;
        }
        ctx.putImageData(img, 0, 0);
      } catch(e) {  }
    }
    return _origToDataURL.apply(this, arguments);
  };
  HTMLCanvasElement.prototype.toDataURL = _poisonedToDataURL;
  _cloak(_poisonedToDataURL, 'toDataURL');

  
  var _origToBlob = HTMLCanvasElement.prototype.toBlob;
  var _poisonedToBlob = function(cb) {
    var ctx = this.getContext('2d');
    if (ctx && this.width > 0 && this.height > 0) {
      try {
        var w = Math.min(this.width, 16), h = Math.min(this.height, 16);
        var img = ctx.getImageData(0, 0, w, h);
        for (var i = 0; i < img.data.length; i += 4) {
          if (_xor32() < 0.3) img.data[i] ^= 1;
        }
        ctx.putImageData(img, 0, 0);
      } catch(e) {}
    }
    return _origToBlob.apply(this, arguments);
  };
  HTMLCanvasElement.prototype.toBlob = _poisonedToBlob;
  _cloak(_poisonedToBlob, 'toBlob');

  
  var _origReadPixels = WebGLRenderingContext.prototype.readPixels;
  var _poisonedReadPixels = function() {
    _origReadPixels.apply(this, arguments);
    var buf = arguments[6];
    if (buf && buf.length) {
      for (var j = 0; j < Math.min(buf.length, 64); j += 4) {
        if (_xor32() < 0.25) buf[j] ^= 1;
      }
    }
  };
  WebGLRenderingContext.prototype.readPixels = _poisonedReadPixels;
  _cloak(_poisonedReadPixels, 'readPixels');

  
  if (typeof WebGL2RenderingContext !== 'undefined') {
    var _origReadPixels2 = WebGL2RenderingContext.prototype.readPixels;
    var _poisonedReadPixels2 = function() {
      _origReadPixels2.apply(this, arguments);
      var buf = arguments[6];
      if (buf && buf.length) {
        for (var j = 0; j < Math.min(buf.length, 64); j += 4) {
          if (_xor32() < 0.25) buf[j] ^= 1;
        }
      }
    };
    WebGL2RenderingContext.prototype.readPixels = _poisonedReadPixels2;
    _cloak(_poisonedReadPixels2, 'readPixels');
  }
})();

(function _bypassDevToolsDetect() {
  
  
  var _origFunction = window.Function;
  var _safeFunction = function() {
    var src = arguments.length > 0 ? String(arguments[arguments.length - 1]) : '';
    if (/\bdebugger\b/.test(src)) {
      
      return function() {};
    }
    return _origFunction.apply(this, arguments);
  };
  _safeFunction.prototype = _origFunction.prototype;
  window.Function = _safeFunction;
  _cloak(_safeFunction, 'Function');

  
  var _origSetInterval = window.setInterval;
  var _origSetTimeout = window.setTimeout;
  var _guardTimer = function(orig) {
    return function(fn, ms) {
      if (typeof fn === 'string' && /\bdebugger\b/.test(fn)) {
        return orig.call(this, function(){}, ms);
      }
      if (typeof fn === 'function') {
        try {
          var s = _origToString.call(fn);
          if (/\bdebugger\b/.test(s) && s.length < 200) {
            return orig.call(this, function(){}, ms);
          }
        } catch(e) {}
      }
      return orig.apply(this, arguments);
    };
  };
  window.setInterval = _guardTimer(_origSetInterval);
  window.setTimeout = _guardTimer(_origSetTimeout);
  _cloak(window.setInterval, 'setInterval');
  _cloak(window.setTimeout, 'setTimeout');

  
  
  var _realConsole = {};
  var cMethods = ['log','warn','error','info','debug','table','trace','dir'];
  for (var ci = 0; ci < cMethods.length; ci++) {
    _realConsole[cMethods[ci]] = console[cMethods[ci]];
  }
  
  var _origClear = console.clear;
  console.clear = function() {  };
  _cloak(console.clear, 'clear');

  
  
  var _origDefProp = Object.defineProperty;
  var _safeDefProp = function(obj, prop, desc) {
    
    if (prop === 'id' && desc && typeof desc.get === 'function') {
      try {
        var gs = _origToString.call(desc.get);
        if (/devtool|debugger/i.test(gs)) return obj;
      } catch(e) {}
    }
    return _origDefProp.call(Object, obj, prop, desc);
  };
  
  
  window.addEventListener('resize', function(e) {
    
    if (e && e.isTrusted === false) { e.stopImmediatePropagation(); }
  }, true);
})();

let _lastMouseX = Math.round(window.innerWidth * 0.5);
let _lastMouseY = Math.round(window.innerHeight * 0.5);
async function _simMousePath(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const tx = rect.left + rect.width * (0.3 + Math.random() * 0.4);
  const ty = rect.top + rect.height * (0.3 + Math.random() * 0.4);
  const sx = _lastMouseX, sy = _lastMouseY;
  const dist = Math.hypot(tx - sx, ty - sy);
  const steps = Math.max(4, Math.min(18, Math.round(dist / 40)));
  const cx1 = sx + (tx - sx) * 0.3 + (Math.random() - 0.5) * 60;
  const cy1 = sy + (ty - sy) * 0.1 + (Math.random() - 0.5) * 60;
  const cx2 = sx + (tx - sx) * 0.7 + (Math.random() - 0.5) * 30;
  const cy2 = sy + (ty - sy) * 0.9 + (Math.random() - 0.5) * 30;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const px = u*u*u*sx + 3*u*u*t*cx1 + 3*u*t*t*cx2 + t*t*t*tx;
    const py = u*u*u*sy + 3*u*u*t*cy1 + 3*u*t*t*cy2 + t*t*t*ty;
    const mo = { bubbles:true, clientX:px, clientY:py, movementX:px-_lastMouseX, movementY:py-_lastMouseY, view:window };
    const elAtPoint = document.elementFromPoint(px, py) || document.body;
    elAtPoint.dispatchEvent(new PointerEvent('pointermove', mo));
    elAtPoint.dispatchEvent(new MouseEvent('mousemove', mo));
    _lastMouseX = px; _lastMouseY = py;
    await sleep(_gr(12, 5, 4, 28));
  }
  _lastMouseX = tx; _lastMouseY = ty;
}

document.addEventListener('mousemove', function(e) { _lastMouseX = e.clientX; _lastMouseY = e.clientY; }, { passive: true, capture: true });

function qHash(s) { let h=0; for(let i=0;i<s.length;i++) h=Math.imul(31,h)+s.charCodeAt(i)|0; return h; }
function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

let _SESSION_ID;
try { _SESSION_ID = sessionStorage.getItem('_am_sid'); } catch(e) {}
if (!_SESSION_ID) {
  _SESSION_ID = Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b => b.toString(16).padStart(2, '0')).join('');
  try { sessionStorage.setItem('_am_sid', _SESSION_ID); } catch(e) {}
}

function _genNonce() {
  return Array.from(crypto.getRandomValues(new Uint8Array(20))).map(b => b.toString(16).padStart(2, '0')).join('');
}

let _sessKeyBytes = null;
let _sessKeyExpiry = 0;

let _sessInitRetryAfter = 0;
async function _initServerSession() {
  if (_sessKeyBytes && Date.now() < _sessKeyExpiry) return true;
  if (Date.now() < _sessInitRetryAfter) {
    console.warn('[amoura] session init back-off, waiting ' + Math.round((_sessInitRetryAfter - Date.now()) / 1000) + 's');
    await sleep(_sessInitRetryAfter - Date.now());
  }

  if (!_authToken || Date.now() >= _authExpiry - 300_000) {
    const refreshed = await _refreshIfNeeded();
    if (!refreshed && (!_authUser || _authAnonymous)) await _authAnonymousLogin();
  }
  if (!_authToken) return false;
  try {
    const res = await _fetch(PROXY_URL + '/session/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _authToken, 'Origin': location.origin },
      body: JSON.stringify({ sessionId: _SESSION_ID }),
    });
    if (res.status === 429) {
      const retryAfter = Math.min(parseInt(res.headers.get('Retry-After') || '0') * 1000 || 15000, 30000);
      _sessInitRetryAfter = Date.now() + retryAfter;
      console.warn('[amoura] session init 429, backing off ' + Math.round(retryAfter / 1000) + 's');
      return false;
    }
    if (!res.ok) { console.warn('[amoura] session init failed:', res.status); return false; }
    const data = await res.json();
    if (!data.sessionKey) return false;

    const hex = data.sessionKey;
    _sessKeyBytes = new Uint8Array(hex.length >> 1);
    for (let i = 0; i < hex.length; i += 2) _sessKeyBytes[i >> 1] = parseInt(hex.slice(i, i + 2), 16);
    _sessKeyExpiry = Date.now() + ((data.expiresIn || 3600) * 1000) - 60_000;
    _sessInitRetryAfter = 0;
    _aesKeyCache = null; _aesKeySrc = null;
    console.log('[amoura] session key obtained from server');
    _prefetchChallenge();
    return true;
  } catch(e) { console.warn('[amoura] session init error:', e.message); return false; }
}

let _initPromise = null;
async function _getSessionKey() {
  if (_sessKeyBytes && Date.now() < _sessKeyExpiry) return _sessKeyBytes;
  if (!_initPromise) _initPromise = _initServerSession().finally(() => { _initPromise = null; });
  await _initPromise;
  return _sessKeyBytes;
}

let _aesKeyCache = null;
let _aesKeySrc = null;
async function _getAesKey(keyBytes) {
  if (_aesKeyCache && _aesKeySrc === keyBytes) return _aesKeyCache;
  _aesKeyCache = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt']);
  _aesKeySrc = keyBytes;
  return _aesKeyCache;
}

async function _aesEncrypt(plaintext) {
  const kb = await _getSessionKey();
  if (!kb) throw new Error('No session key for encryption');
  const key = await _getAesKey(kb);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext)));
  const buf = new Uint8Array(12 + ct.length);
  buf.set(iv); buf.set(ct, 12);
  let b64 = ''; const chunk = 32768;
  for (let i = 0; i < buf.length; i += chunk) b64 += String.fromCharCode(...buf.subarray(i, Math.min(i + chunk, buf.length)));
  return btoa(b64);
}

async function _aesDecrypt(b64) {
  const kb = await _getSessionKey();
  if (!kb) throw new Error('No session key for decryption');
  const key = await _getAesKey(kb);
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  const iv = buf.slice(0, 12);
  const ct = buf.slice(12);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(pt);
}

async function _hashBody(bodyStr) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(bodyStr));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function _signRequest(path, bodyStr, nonce, timestamp) {
  const bodyHash = await _hashBody(bodyStr);
  const message = path + '|' + nonce + '|' + timestamp + '|' + bodyHash + '|' + _SESSION_ID;
  const skBytes = await _getSessionKey();
  if (!skBytes) throw new Error('No session key — connection failed, retrying...');
  const key = await crypto.subtle.importKey('raw', skBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function _getFingerprint() {
  const parts = [
    navigator.userAgent || '',
    screen.width + 'x' + screen.height,
    screen.colorDepth || '',
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    navigator.language || '',
    navigator.hardwareConcurrency || '',
    navigator.platform || '',
    new Date().getTimezoneOffset(),
    navigator.maxTouchPoints || 0,
    navigator.deviceMemory || 0,
  ];

  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) { parts.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || ''); parts.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || ''); }
    }
  } catch(e) {}
  let h = 0;
  const s = parts.join('|');
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return (h >>> 0).toString(36);
}
const _FINGERPRINT = _getFingerprint();

async function _getChallenge() {
  try {
    const res = await _fetch(PROXY_URL + '/challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': location.origin, 'X-Fingerprint': _FINGERPRINT, 'X-Session-Id': _SESSION_ID },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.challenge || '';
  } catch(e) {
    console.warn('[amoura] challenge fetch failed:', e.message);
    return '';
  }
}

let _prefetchedChallenge = null;
let _prefetchingChallenge = null;
function _prefetchChallenge() {
  if (_prefetchingChallenge) return _prefetchingChallenge;
  _prefetchingChallenge = _getChallenge().then(c => { _prefetchedChallenge = c; _prefetchingChallenge = null; return c; }).catch(() => { _prefetchingChallenge = null; return ''; });
  return _prefetchingChallenge;
}
async function _consumeChallenge() {
  const c = _prefetchedChallenge;
  _prefetchedChallenge = null;
  if (c) { _prefetchChallenge(); return c; }
  return _getChallenge();
}

async function _secFetch(url, opts, { withChallenge = false } = {}) {
  const nonce = _genNonce();
  const timestamp = Date.now();
  const path = new URL(url).pathname;

  let bodyStr = opts.body || '';
  let useEnc = false;
  if (bodyStr && _sessKeyBytes) {
    try {
      bodyStr = await _aesEncrypt(bodyStr);
      useEnc = true;
    } catch(e) { bodyStr = opts.body || ''; }
  }

  const tasks = [_signRequest(path, bodyStr, nonce, String(timestamp))];
  if (withChallenge) tasks.push(_consumeChallenge());
  const [signature, chal] = await Promise.all(tasks);

  const headers = { ...(opts.headers || {}), 'X-Nonce': nonce, 'X-Timestamp': String(timestamp), 'X-Signature': signature, 'X-Fingerprint': _FINGERPRINT, 'X-Session-Id': _SESSION_ID };
  if (useEnc) headers['X-Enc'] = '1';
  if (chal) headers['X-Challenge'] = chal;

  let res;
  try {
    res = await _fetch(url, { ...opts, body: bodyStr, headers, signal: opts.signal });
  } catch (fetchErr) {
    if (withChallenge) { _prefetchedChallenge = null; _prefetchingChallenge = null; }
    throw fetchErr;
  }
  if (withChallenge) _prefetchChallenge();

  if (res.ok && (useEnc || res.headers.get('X-Enc') === '1')) {
    const ct = await res.text();
    try {
      const pt = await _aesDecrypt(ct);
      return new Response(pt, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch(e) {
      return new Response(ct, { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return res;
}
const _origDispatch = EventTarget.prototype.dispatchEvent;
const _patchedDispatch = function(ev) {
  try { Object.defineProperty(ev, 'isTrusted', { get: () => true }); } catch(e) {}
  return _origDispatch.call(this, ev);
};
EventTarget.prototype.dispatchEvent = _patchedDispatch;
_cloak(_patchedDispatch, 'dispatchEvent');

let _authToken = null;
let _authRefresh = null;
let _authUid = null;
let _authUser = null;
let _authExpiry = 0;
let _authAnonymous = false;
const _settingsCache = {};

function _authHeaders() { const h = { 'Content-Type': 'application/json' }; if (_authToken) h['Authorization'] = 'Bearer ' + _authToken; return h; }

async function _refreshIfNeeded(force) {
  if (!force && _authToken && Date.now() < _authExpiry - 300_000) return true;
  if (!_authRefresh) return false;
  try {
    const ac = new AbortController();
    const tid = setTimeout(() => ac.abort(), 15000);
    const r = await _fetch(FB_AUTH_REFRESH, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(_authRefresh), signal: ac.signal });
    clearTimeout(tid);
    const d = await r.json();
    if (d.id_token) {
      _authToken = d.id_token;
      _authRefresh = d.refresh_token || _authRefresh;
      _authExpiry = Date.now() + (parseInt(d.expires_in || '3600') * 1000);
      try { localStorage.setItem('_amoura_rt', _authRefresh); } catch(e) {}
      return true;
    }
  } catch(e) {}
  return false;
}

async function _authSignUp(username, password) {
  if (_hasProfanity(username)) throw new Error('Username contains inappropriate language');
  if (username.length < 3) throw new Error('Username must be at least 3 characters');
  if (username.length > 20) throw new Error('Username must be 20 characters or less');
  if (!/^[a-zA-Z0-9_]+$/.test(username)) throw new Error('Username can only contain letters, numbers, and underscores');
  const email = username.toLowerCase().replace(/[^a-z0-9_]/g, '') + '@amoura.app';
  const r = await _fetch(FB_AUTH_SIGNUP, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message?.replace(/_/g, ' ') || 'Signup failed');
  _authToken = d.idToken; _authRefresh = d.refreshToken; _authUid = d.localId; _authUser = username;
  _authExpiry = Date.now() + 3600_000;
  _authAnonymous = false;
  await _fetch(FB_AUTH_UPDATE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: _authToken, displayName: username }) });
  try { localStorage.setItem('_amoura_rt', _authRefresh); localStorage.setItem('_amoura_user', username); localStorage.setItem('_amoura_uid', _authUid); } catch(e) {}
  await _fetch(FB_FIRESTORE + '/users/' + _authUid + '?updateMask.fieldPaths=username&updateMask.fieldPaths=solved&updateMask.fieldPaths=joined&updateMask.fieldPaths=discordOpened', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _authToken },
    body: JSON.stringify({ fields: { username: { stringValue: username }, solved: { integerValue: '0' }, joined: { stringValue: new Date().toISOString().slice(0, 10) }, discordOpened: { booleanValue: !!localStorage.getItem('_am_discord_opened') } } })
  });

  await _initServerSession();
  return { uid: _authUid, username };
}

async function _authSignIn(username, password) {
  const email = username.toLowerCase().replace(/[^a-z0-9_]/g, '') + '@amoura.app';
  const r = await _fetch(FB_AUTH_SIGNIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, returnSecureToken: true }) });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message?.replace(/_/g, ' ') || 'Login failed');
  _authToken = d.idToken; _authRefresh = d.refreshToken; _authUid = d.localId; _authUser = d.displayName || username;
  _authExpiry = Date.now() + 3600_000;
  _authAnonymous = false;
  try { localStorage.setItem('_amoura_rt', _authRefresh); localStorage.setItem('_amoura_user', _authUser); localStorage.setItem('_amoura_uid', _authUid); } catch(e) {}

  await _initServerSession();
  try {
    const uDoc = await _fetch(FB_FIRESTORE + '/users/' + _authUid, { headers: { 'Authorization': 'Bearer ' + _authToken } });
    const uData = await uDoc.json();
    if (uData.fields?.discordOpened?.booleanValue) localStorage.setItem('_am_discord_opened', '1');
    else if (localStorage.getItem('_am_discord_opened')) {
      _fetch(FB_FIRESTORE + '/users/' + _authUid + '?updateMask.fieldPaths=discordOpened', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _authToken }, body: JSON.stringify({ fields: { discordOpened: { booleanValue: true } } }) }).catch(() => {});
    }
  } catch(e) {}
  return { uid: _authUid, username: _authUser };
}

async function _tryAutoLogin() {
  try {
    _authRefresh = localStorage.getItem('_amoura_rt');
    _authUser = localStorage.getItem('_amoura_user');
    _authUid = localStorage.getItem('_amoura_uid');
  } catch(e) {}
  if (_authRefresh) {
    try {
      const ok = await _refreshIfNeeded(true);
      if (ok) { _authAnonymous = !_authUser || _authUser === '__anon__'; return true; }
    } catch(e) {}
    if (_authUser && _authUser !== '__anon__') {
      console.warn('[amoura] refresh failed for signed-in user, skipping anon fallback');
      return false;
    }
  }

  return await _authAnonymousLogin();
}

async function _authAnonymousLogin() {
  try {
    const existingRt = _authRefresh || (function() { try { return localStorage.getItem('_amoura_rt'); } catch(e) { return null; } })();
    if (existingRt) {
      try {
        const ac2 = new AbortController();
        const tid2 = setTimeout(() => ac2.abort(), 10000);
        const r2 = await _fetch(FB_AUTH_REFRESH, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(existingRt), signal: ac2.signal });
        clearTimeout(tid2);
        const d2 = await r2.json();
        if (d2.id_token) {
          _authToken = d2.id_token; _authRefresh = d2.refresh_token || existingRt; _authUid = d2.user_id || _authUid;
          _authExpiry = Date.now() + (parseInt(d2.expires_in || '3600') * 1000);
          _authAnonymous = true; _authUser = '__anon__';
          try { localStorage.setItem('_amoura_rt', _authRefresh); } catch(e) {}
          console.log('[amoura] reused existing anon account via refresh');
          return true;
        }
      } catch(e) { console.warn('[amoura] existing RT refresh failed, creating new anon:', e.message); }
    }
    const ac = new AbortController();
    const tid = setTimeout(() => ac.abort(), 15000);
    const r = await _fetch(FB_AUTH_SIGNUP, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }), signal: ac.signal });
    clearTimeout(tid);
    const d = await r.json();
    if (d.error) { console.warn('[amoura] anon login failed:', d.error.message); return false; }
    _authToken = d.idToken; _authRefresh = d.refreshToken; _authUid = d.localId; _authUser = '__anon__';
    _authExpiry = Date.now() + 3600_000;
    _authAnonymous = true;
    try { localStorage.setItem('_amoura_rt', _authRefresh); localStorage.setItem('_amoura_uid', _authUid); localStorage.setItem('_amoura_user', '__anon__'); } catch(e) {}
    console.log('[amoura] anonymous auth OK, uid:', _authUid);
    return true;
  } catch(e) { console.warn('[amoura] anon login error:', e.message); return false; }
}

async function _getMyStats() {
  if (!_authToken || !_authUid) return null;
  try {
    const r = await _fetch(FB_FIRESTORE + '/users/' + _authUid, { headers: { 'Authorization': 'Bearer ' + _authToken } });
    const d = await r.json();
    if (!d.fields) return null;
    return { solved: parseInt(d.fields.solved?.integerValue || '0'), username: d.fields.username?.stringValue || _authUser, joined: d.fields.joined?.stringValue || '' };
  } catch(e) { return null; }
}

async function _getLeaderboard() {
  if (!_authToken) return [];
  try {
    const r = await _fetch(FB_FIRESTORE + ':runQuery', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _authToken },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: 'users' }], orderBy: [{ field: { fieldPath: 'solved' }, direction: 'DESCENDING' }], limit: 20 } }) });
    const d = await r.json();
    return (d || []).filter(e => e.document).map(e => ({ username: e.document.fields?.username?.stringValue || '?', solved: parseInt(e.document.fields?.solved?.integerValue || '0') }));
  } catch(e) { return []; }
}

function _hasProfanity(str) {
  const s = str.toLowerCase().replace(/[0@]/g,'o').replace(/[1!|]/g,'i').replace(/[$5]/g,'s').replace(/3/g,'e').replace(/4/g,'a').replace(/[^a-z]/g,'');
  const words = ['fuck','shit','bitch','dick','cock','pussy','cunt','nigger','nigga','faggot','fag','retard','whore','slut','penis','vagina','porn','hentai','nazi','rape','molest','pedo','kys'];
  return words.some(w => s.includes(w));
}

async function _syncSettingsToCloud() {
  if (!_authToken || !_authUid) return;
  const fields = {};
  ['_am_s_auto','_am_s_autonext','_am_s_gotit','_am_s_autoskip','_am_s_thinking','_am_s_budget','_am_s_delay','_am_s_disappear','_am_s_minblur','_am_s_advanced','_am_s_quitconfirm','_am_s_answermin','_am_s_color','_am_s_custom_hex','_am_click_req','_am_s_modelmode','_am_s_betaobs','_am_s_persist','_am_s_autostart','_am_s_screenshot','_am_s_stopat100'].forEach(k => { const v = _settingsCache[k] !== undefined ? _settingsCache[k] : localStorage.getItem(k); if (v !== null && v !== undefined) fields[k] = { stringValue: String(v) }; });
  try { await _fetch(FB_FIRESTORE + '/users/' + _authUid + '/settings/prefs', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _authToken }, body: JSON.stringify({ fields }) }); } catch(e) {}
}
let _syncTimer = null;
function _debouncedSync() { if (_syncTimer) clearTimeout(_syncTimer); _syncTimer = setTimeout(_syncSettingsToCloud, 2000); }

async function _loadSettingsFromCloud() {
  if (!_authToken || !_authUid) return false;
  try {
    const r = await _fetch(FB_FIRESTORE + '/users/' + _authUid + '/settings/prefs', { headers: { 'Authorization': 'Bearer ' + _authToken } });
    if (!r.ok) return false;
    const d = await r.json();
    if (!d.fields) return false;
    Object.entries(d.fields).forEach(([k, v]) => { if (v.stringValue !== undefined) _settingsCache[k] = v.stringValue; });
    return true;
  } catch(e) { return false; }
}

let _logoURL = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%231d4ed8"/><text x="50" y="62" text-anchor="middle" fill="white" font-size="32" font-weight="bold">A</text></svg>');
(async () => {
  try {
    const r = await _fetch(SERVER + '/logo.png');
    if (r.ok) {
      const blob = await r.blob();
      _logoURL = URL.createObjectURL(blob);
      const logos = document.querySelectorAll('#_am_logo,#_am_m_logo,#_am_auth_hero_logo');
      logos.forEach(el => { el.src = _logoURL; });
    }
  } catch(e) {}
})();

const IC = {
  bolt: '<svg width="1em" height="1em" viewBox="0 0 10 14" fill="currentColor"><path d="M6 0L0 8h4l-1 6 6-8H5z"/></svg>',
  check: '<svg width="1em" height="1em" viewBox="0 0 11 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4.5 4 7.5 10 1"/></svg>',
  pause: '<svg width="1em" height="1em" viewBox="0 0 11 13" fill="currentColor"><rect x="0" y="0" width="4" height="13" rx="1.5"/><rect x="7" y="0" width="4" height="13" rx="1.5"/></svg>',
  play: '<svg width="1em" height="1em" viewBox="0 0 11 12" fill="currentColor"><path d="M1 0.5v11l9-5.5z"/></svg>',
  stop: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor"><rect x="0" y="0" width="12" height="12" rx="2"/></svg>',
  x: '<svg width="1em" height="1em" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg>',
  minus: '<svg width="1em" height="1em" viewBox="0 0 10 10" fill="currentColor"><rect x="0" y="4" width="10" height="2" rx="1"/></svg>',
  max: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1h4v4"/><line x1="11" y1="1" x2="6" y2="6"/><path d="M5 11H1V7"/><line x1="1" y1="11" x2="6" y2="6"/></svg>',
  star: '<svg width="1em" height="1em" viewBox="0 0 12 11" fill="currentColor"><path d="M6 0l1.5 3.5H11l-2.8 2 1.1 3.5L6 7.1 2.7 9l1.1-3.5L1 3.5h3.5z"/></svg>',
  hash: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="2" y1="4" x2="10" y2="4"/><line x1="2" y1="8" x2="10" y2="8"/><line x1="4" y1="1" x2="3" y2="11"/><line x1="9" y1="1" x2="8" y2="11"/></svg>',
  clock: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="6" r="5"/><polyline points="6 3 6 6 8.5 8.5"/></svg>',
  target: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="6" r="5"/><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="6" r="0.75" fill="currentColor" stroke="none"/></svg>',
  sparkle: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0l.8 4.2L11 6l-4.2.8L6 12l-.8-5.2L1 6l5.2-.8z"/></svg>',
  warn: '<svg width="1em" height="1em" viewBox="0 0 13 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1L12 11H1z"/><line x1="6.5" y1="5" x2="6.5" y2="7.5"/><circle cx="6.5" cy="9.5" r="0.6" fill="currentColor" stroke="none"/></svg>',
  eye: '<svg width="1em" height="1em" viewBox="0 0 13 9" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 4.5C2.5 1.5 10.5 1.5 12 4.5S10.5 7.5 1 4.5z"/><circle cx="6.5" cy="4.5" r="1.75" fill="currentColor" stroke="none"/></svg>',
  grip: '<svg width="1em" height="1em" viewBox="0 0 8 12" fill="currentColor" opacity=".5"><circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/><circle cx="2" cy="6" r="1.2"/><circle cx="6" cy="6" r="1.2"/><circle cx="2" cy="10" r="1.2"/><circle cx="6" cy="10" r="1.2"/></svg>',
  chat: '<svg width="1em" height="1em" viewBox="0 0 13 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="11" height="7.5" rx="2"/><path d="M4 12l2-2.5h3"/></svg>',
  send: '<svg width="1em" height="1em" viewBox="0 0 13 12" fill="currentColor"><path d="M1 1l11 5-11 5V7.5l7-1.5-7-1.5z"/></svg>',
  imgIcon: '<svg width="1em" height="1em" viewBox="0 0 13 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="1" width="11" height="10" rx="2"/><circle cx="4.5" cy="4.5" r="1.2"/><path d="M1 8.5l3-3 2.5 2.5 2-2 3 3"/></svg>',
  back: '<svg width="1em" height="1em" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 2 2 5 6 8"/></svg>',
  compass: '<svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="9" r="7.5"/><line x1="9" y1="3" x2="9" y2="15"/><line x1="3" y1="9" x2="15" y2="9"/></svg>',
  settings: '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>',
  user: '<svg width="1em" height="1em" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="4" r="3"/><path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5"/></svg>',
  flash: '<svg width="1em" height="1em" viewBox="0 0 12 16" fill="currentColor"><path d="M7.5 0L1 9h4.2L3.5 16 11 7H6.8z"/></svg>',
  brain: '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14V8"/><path d="M5.5 3.5a2.5 2.5 0 0 1 5 0"/><path d="M3.5 6a2.5 2.5 0 0 1 2-2.45"/><path d="M12.5 6a2.5 2.5 0 0 0-2-2.45"/><path d="M3 8.5a2.5 2.5 0 0 0 2 2.45"/><path d="M13 8.5a2.5 2.5 0 0 1-2 2.45"/><path d="M4 6c-1.1.5-1.5 1.8-1 3"/><path d="M12 6c1.1.5 1.5 1.8 1 3"/><circle cx="5.5" cy="6" r=".6" fill="currentColor" stroke="none"/><circle cx="10.5" cy="6" r=".6" fill="currentColor" stroke="none"/></svg>',
  wand: '<svg width="1em" height="1em" viewBox="0 0 14 14" fill="currentColor"><path d="M5 0l.6 2.4L8 3.5 5.6 4.1 5 6.5l-.6-2.4L2 3.5l2.4-.6z"/><path d="M10 5l.4 1.6L12 7l-1.6.4L10 9l-.4-1.6L8 7l1.6-.4z"/><rect x="1.5" y="9" width="8" height="1.8" rx=".9" transform="rotate(-45 5.5 9.9)"/></svg>',
  sync: '<svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 7a6 6 0 0 1 10.5-4"/><polyline points="12 1 12 4.5 8.5 4.5"/><path d="M13 7a6 6 0 0 1-10.5 4"/><polyline points="2 13 2 9.5 5.5 9.5"/></svg>',
};

function getUsername() {
  const el = document.querySelector('[class*="user-name"],[class*="userName"],[class*="UserName"],.site-nav-user-name,#hd-user-name');
  if (el) return el.textContent.trim();
  const profileLink = document.querySelector('a[href*="/profile"]');
  if (profileLink) return profileLink.textContent.trim();
  return '';
}
function getSmartScore() {
  const sels = ['.smartscore-text','.statistic-content','.game-state-smart-score-wrapper .game-state-smart-score-value','[data-cy="smart-score-value"]','.smart-score-badge-value','.smart-score-badge-count'];
  for (const s of sels) { const el = document.querySelector(s); if (el) { const t = el.textContent.trim(); if (/\d/.test(t)) return t; } }
  const boxes = document.querySelectorAll('[class*="SmartScore"],[class*="smartScore"],[class*="smart-score"],[class*="smartscore"]');
  for (const c of boxes) {
    const leaves = [...c.querySelectorAll('*')].filter(e => e.children.length === 0 && /^\d+$/.test(e.textContent.trim()));
    if (leaves.length) return leaves[0].textContent.trim();
    const m = c.textContent.match(/(\d+)/); if (m) return m[1];
  }
  return '--';
}
function getQuestionsAnswered() {

  const pa = document.querySelector('.problems-attempted .statistic-content');
  if (pa) { const t = pa.textContent.trim(); if (/\d/.test(t)) return t.match(/\d+/)[0]; }
  const sels = ['[data-cy="questions-answered-value"]','.game-state-questions-answered .game-state-stat-value','[class*="questions-answered"] [class*="value"]','[class*="questionsAnswered"] [class*="value"]'];
  for (const s of sels) { const el = document.querySelector(s); if (el) { const t = el.textContent.trim(); if (/\d/.test(t)) return t; } }
  const boxes = document.querySelectorAll('[class*="questionsAnswered"],[class*="questions-answered"],[class*="QuestionsAnswered"]');
  for (const c of boxes) { const m = c.textContent.match(/(\d+)/); if (m) return m[1]; }
  return '0';
}
function _normLessonText(t) {

  t = t.replace(/^([A-Z]+\.?\d+(?:\.\d+)?)([A-Z][a-z])/, '$1 $2');

  t = t.replace(/([a-z])(\d?[A-Z]{2,5})$/, '$1 $2');
  return t.trim();
}

function getLessonName() {

  if (/^\/(benchmark|diagnostic)\b/.test(window.location.pathname)) {
    const sub = new URLSearchParams(window.location.search).get('subject');
    const subName = sub === 'm' ? 'Math' : sub === 'e' ? 'ELA' : sub === 's' ? 'Science' : sub === 'ss' ? 'Social Studies' : '';
    const type = window.location.pathname.startsWith('/benchmark') ? 'Benchmark' : 'Diagnostic';
    return 'IXL ' + type + (subName ? ' — ' + subName : '');
  }
  const b = document.querySelector('.breadcrumb-title');
  if (b) return _normLessonText(b.textContent.trim()).slice(0, 60);
  const s = document.querySelector('.skill-name');
  if (s) return _normLessonText(s.textContent.trim()).slice(0, 60);
  const lc = document.querySelector('.breadcrumb-element:last-child a, .breadcrumb-element:last-child span');
  if (lc) return _normLessonText(lc.textContent.trim()).slice(0, 60);
  return _normLessonText(document.title.replace(/\s*[|\-]\s*IXL.*$/i, '').trim()).slice(0, 60) || 'IXL Practice';
}

function parseLessonInfo(name) {
  const m = name.match(/^([A-Z]+\.?\d+(?:\.\d+)?)\s+(.+)$/i);
  if (m) return { code: m[1], name: m[2] };
  return { code: '', name: name };
}

var _am_last_answer_raw = null;
(function loadKaTeX() {
  if (typeof katex !== 'undefined') return;

  const KATEX_VER = '0.16.21';
  const CDN = 'https://cdn.jsdelivr.net/npm/katex@' + KATEX_VER + '/dist';

  const injectCSS = (cssText) => {
    if (document.getElementById('_am_katex_css')) return;
    const style = document.createElement('style');
    style.id = '_am_katex_css';
    style.textContent = cssText;
    document.head.appendChild(style);
  };

  const onKaTeXLoaded = () => {
    if (_am_last_answer_raw && typeof setAnswer === 'function') setAnswer(_am_last_answer_raw);
  };

  const isValid = (code, minLen) => typeof code === 'string' && code.length > (minLen || 1000) && !code.trimStart().startsWith('<');

  const loadJSFromCode = (code) => {
    if (!isValid(code)) return false;
    try { (0, eval)(code); if (typeof katex !== 'undefined') { onKaTeXLoaded(); return true; } } catch(_) {}
    return false;
  };

  const tryFetchJS = (url) => fetch(url).then(r => { if (!r.ok) throw 0; return r.text(); }).then(code => { if (!loadJSFromCode(code)) throw 0; });
  const tryFetchCSS = (url) => fetch(url).then(r => { if (!r.ok) throw 0; return r.text(); }).then(t => { if (!isValid(t, 500)) throw 0; injectCSS(t.replace(/url\((?:["'])?fonts\//g, 'url(' + CDN + '/fonts/')); });

  
  tryFetchJS(PROXY_URL + '/katex-js').catch(() => tryFetchJS(CDN + '/katex.min.js')).catch(() => {});

  
  tryFetchCSS(PROXY_URL + '/katex-css').catch(() => tryFetchCSS(CDN + '/katex.min.css')).catch(() => {});
})();

function buildUI() {
  const existing = document.getElementById('_amoura_root');
  if (existing) existing.remove();
  const root = document.createElement('div');
  root.id = '_amoura_root';
  const logoSrc = _logoURL;
  root.innerHTML = '<style>' +
'*{box-sizing:border-box}' +
'@keyframes _amPulse{0%,100%{box-shadow:0 0 0 1px rgba(59,130,246,.3),inset 0 0 40px rgba(59,130,246,.04),0 0 35px rgba(59,130,246,.45),0 0 90px rgba(59,130,246,.2),0 30px 60px rgba(0,0,0,.75)}50%{box-shadow:0 0 0 1px rgba(99,160,255,.55),inset 0 0 50px rgba(59,130,246,.07),0 0 60px rgba(59,130,246,.7),0 0 140px rgba(59,130,246,.32),0 30px 60px rgba(0,0,0,.75)}}' +
'@keyframes _amGlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}' +
'@keyframes _amSpin{to{transform:rotate(360deg)}}' +
'@keyframes _amFadeIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}' +
'@keyframes _amSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
'@keyframes _amDots{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}' +
'@keyframes _amShine{0%{left:-150%}100%{left:150%}}' +
'@keyframes _amBorder{0%,100%{border-color:rgba(59,130,246,.2)}50%{border-color:rgba(59,130,246,.45)}}' +
'@keyframes _amWave{0%,100%{transform:scaleY(.35);opacity:.4}50%{transform:scaleY(1);opacity:1}}' +
'@keyframes _amParticleUp{0%{transform:translateY(0) scale(1);opacity:.7}100%{transform:translateY(-60px) scale(0);opacity:0}}' +
'@keyframes _amToastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}' +
'@keyframes _amToastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}' +
'#_am_logo,#_am_m_logo{border-radius:0;background:transparent;border:none;flex-shrink:0;object-fit:contain;transition:all .3s;filter:drop-shadow(0 0 14px rgba(59,130,246,.6)) drop-shadow(0 0 30px rgba(59,130,246,.3))}' +
'#_am_logo{height:80px;width:auto;margin-bottom:2px}' +
'#_am_m_logo{height:30px;width:auto}' +
'#_am_auth_hero_logo{max-width:220px;width:100%;height:auto;filter:drop-shadow(0 0 24px rgba(59,130,246,.6));animation:_amFadeIn .6s ease-out;margin-bottom:4px}' +
'#_am_not_lesson{display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;padding:30px;gap:14px;text-align:center;animation:_amFadeIn .4s ease-out}' +
'#_am_not_lesson_icon{font-size:36px;margin-bottom:4px}' +
'#_am_not_lesson_title{font-size:16px;font-weight:700;color:#60a5fa}' +
'#_am_not_lesson_sub{font-size:12px;color:#737373;line-height:1.6;max-width:300px}' +
'#_am_not_lesson_check{margin-top:8px;font-size:11px;color:#525252;display:flex;align-items:center;gap:6px}' +

'#_am_overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;display:flex;align-items:center;justify-content:flex-end;padding:20px;animation:_amFadeIn .4s ease-out;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","SF Pro Display",sans-serif;transition:opacity .3s ease,transform .3s ease;pointer-events:none}' +

'#_am_panel{width:440px;min-width:320px;min-height:300px;max-width:96vw;max-height:92vh;max-height:92dvh;border-radius:22px;overflow:hidden;background:linear-gradient(170deg,#080810 0%,#0d0d14 50%,#090910 100%);border:1px solid rgba(59,130,246,.35);animation:_amPulse 4s ease-in-out infinite,_amSlideUp .5s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;position:relative;resize:both;pointer-events:auto;transition:width .4s cubic-bezier(.16,1,.3,1),min-height .4s cubic-bezier(.16,1,.3,1),border-radius .3s,bottom .4s cubic-bezier(.16,1,.3,1),right .4s cubic-bezier(.16,1,.3,1);-webkit-transform:translateZ(0)}' +
'@supports (-webkit-touch-callout: none){#_am_panel{resize:none}}' +

'#_am_header{background:linear-gradient(180deg,rgba(59,130,246,.1) 0%,rgba(59,130,246,.03) 60%,transparent 100%);padding:22px 16px 16px;display:flex;flex-direction:column;align-items:center;gap:4px;border-bottom:1px solid rgba(59,130,246,.12);position:relative;overflow:hidden;flex-shrink:0;-webkit-user-select:none;user-select:none}' +
'#_am_header::before{content:"";position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(99,160,255,.6),transparent)}' +
'#_am_header::after{content:"";position:absolute;top:0;left:-150%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(59,130,246,.06),transparent);animation:_amShine 6s ease-in-out infinite}' +
'#_am_htext{text-align:center;min-width:0}' +
'#_am_title{font-size:22px;font-weight:900;letter-spacing:4px;text-transform:uppercase;background:linear-gradient(90deg,#60a5fa,#93c5fd,#3b82f6,#60a5fa);background-size:300%;animation:_amGlow 4s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:"Inter","Segoe UI","SF Pro Display",sans-serif}' +
'#_am_subtitle{font-size:11px;color:#999;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:4px}' +
'#_am_hbtns{position:absolute;top:12px;right:12px;display:flex;gap:5px}' +
'._am_hbtn{width:30px;height:30px;border-radius:10px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.06);color:#8b8b8b;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;padding:0;line-height:1}' +
'._am_hbtn:hover{background:rgba(59,130,246,.15);color:#3b82f6;transform:scale(1.08)}' +
'._am_hbtn.danger{border-color:rgba(239,68,68,.25);color:#ef4444}._am_hbtn.danger:hover{background:rgba(239,68,68,.15);color:#f87171}' +
'a._am_hbtn{text-decoration:none;color:#5865F2}a._am_hbtn:hover{color:#7289da;background:rgba(88,101,242,.15)}' +
'a._am_hbtn.globe{color:#3b82f6}a._am_hbtn.globe:hover{color:#60a5fa;background:rgba(59,130,246,.15)}' +

'#_am_body{flex:1;display:flex;flex-direction:column;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 20px;gap:14px;position:relative;min-height:0}' +
'#_am_body::-webkit-scrollbar{width:5px}#_am_body::-webkit-scrollbar-thumb{background:rgba(59,130,246,.2);border-radius:3px}' +

'#_am_stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex-shrink:0}' +
'._am_stat{background:rgba(255,255,255,.02);border:1px solid rgba(59,130,246,.08);border-radius:14px;padding:12px 10px;text-align:center;transition:border-color .3s}' +
'._am_stat:hover{border-color:rgba(59,130,246,.2)}' +
'._am_stat_icon{display:flex;justify-content:center;margin-bottom:4px;color:#737373}' +
'._am_stat_value{font-size:20px;font-weight:700;color:#e5e5e5;line-height:1.2}' +
'._am_stat_value.green{color:#60a5fa}._am_stat_value.purple{color:#3b82f6}._am_stat_value.amber{color:#60a5fa}._am_stat_value.blue{color:#60a5fa}' +
'._am_stat_label{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#525252;margin-top:2px}' +

'#_am_current{background:rgba(255,255,255,.02);border:1px solid rgba(59,130,246,.08);border-radius:14px;padding:14px 16px;flex-shrink:0;animation:_amBorder 3s ease-in-out infinite}' +
'#_am_cur_label{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#525252;margin-bottom:6px;display:flex;align-items:center;gap:6px}' +
'#_am_cur_status{font-size:13px;color:#d4d4d4;line-height:1.5}' +
'#_am_cur_answer{margin-top:8px}' +
'._am_answer_box{background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.18);border-radius:12px;padding:12px 16px;font-size:15px;color:#93c5fd;font-weight:500;line-height:1.8;word-break:break-word;text-align:center;letter-spacing:.3px;transition:all .25s ease}' +
'._am_answer_box:hover{border-color:rgba(59,130,246,.35);box-shadow:0 0 16px rgba(59,130,246,.12)}' +
'._am_answer_box .katex{font-size:1.35em;color:inherit}._am_answer_box .katex-display{margin:0}._am_answer_box .katex-display>.katex{text-align:center}' +
'._am_hist_text .katex{font-size:.85em}._am_toast .katex{font-size:.9em;color:inherit}' +

'#_am_history{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;border:1px solid rgba(59,130,246,.06);border-radius:14px;background:rgba(0,0,0,.15);min-height:0}' +
'#_am_history::-webkit-scrollbar{width:5px}#_am_history::-webkit-scrollbar-thumb{background:rgba(59,130,246,.25);border-radius:3px}' +
'#_am_hist_label{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#525252;padding:10px 14px 6px;display:flex;align-items:center;gap:6px}' +
'._am_hist_item{padding:8px 14px;border-bottom:1px solid rgba(59,130,246,.04);display:flex;align-items:center;gap:10px;font-size:12px;animation:_amFadeIn .25s ease-out}' +
'._am_hist_num{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0}' +
'._am_hist_num.ok{background:rgba(59,130,246,.1);color:#60a5fa}._am_hist_num.fail{background:rgba(96,165,250,.1);color:#60a5fa}' +
'._am_hist_text{flex:1;color:#a3a3a3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
'._am_hist_type{font-size:10px;color:#5c5c5c;flex-shrink:0;background:rgba(59,130,246,.06);padding:2px 8px;border-radius:6px}' +

'#_am_footer{display:flex;flex-direction:column;gap:6px;padding:12px 20px;border-top:1px solid rgba(59,130,246,.08);flex-shrink:0}' +
'#_am_footer_btns{display:flex;gap:8px}' +
'#_am_social{display:flex;justify-content:center;gap:18px;padding-top:2px}' +
'._am_social_btn{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:500;color:rgba(255,255,255,.32);text-decoration:none;letter-spacing:.2px;transition:color .2s;white-space:nowrap;font-family:inherit}' +
'._am_social_btn:hover{color:rgba(255,255,255,.7)}' +
'._am_fbtn{flex:1;padding:10px 0;border-radius:12px;border:1px solid transparent;font-size:12px;font-weight:600;cursor:pointer;transition:all .25s;text-align:center;letter-spacing:.5px;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px}' +
'#_am_next_btn{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.3);color:#60a5fa}' +
'#_am_next_btn:hover{background:rgba(59,130,246,.2);color:#93c5fd;border-color:rgba(59,130,246,.55)}' +
'#_am_pause_btn{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.15);color:#60a5fa}#_am_pause_btn:hover{background:rgba(59,130,246,.18)}' +
'#_am_stop_btn{background:rgba(96,165,250,.08);border-color:rgba(96,165,250,.15);color:#60a5fa}#_am_stop_btn:hover{background:rgba(96,165,250,.18)}' +

'#_am_settings{background:rgba(255,255,255,.02);border:1px solid rgba(59,130,246,.08);border-radius:14px;padding:14px 16px;flex-shrink:0}' +
'#_am_settings_title{font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#525252;margin-bottom:10px}' +
'._am_setting{display:flex;align-items:center;justify-content:space-between;padding:8px 0}' +
'._am_setting_label{font-size:13px;color:#d4d4d4}' +
'._am_setting_desc{font-size:10px;color:#888;margin-top:2px;line-height:1.4}' +
'._am_seg_row{display:flex;gap:4px;margin-bottom:6px}' +
'._am_seg{flex:1;padding:7px 2px;border:1px solid rgba(100,100,120,.2);border-radius:7px;background:rgba(100,100,120,.08);color:#777;font-size:11px;cursor:pointer;transition:all .2s;font-weight:500}' +
'._am_seg:hover{color:#aaa;border-color:rgba(100,100,120,.35)}' +
'._am_seg.active{background:rgba(59,130,246,.18);border-color:rgba(59,130,246,.35);color:#93c5fd}' +
'._am_toggle{position:relative;width:40px;height:22px;border-radius:11px;background:rgba(100,100,120,.25);cursor:pointer;transition:background .25s;flex-shrink:0;border:none;padding:0}' +
'._am_toggle.on{background:rgba(59,130,246,.45)}' +
'._am_toggle::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#e5e5e5;transition:transform .25s cubic-bezier(.34,1.56,.64,1)}' +
'._am_toggle.on::after{transform:translateX(18px)}' +
'._am_slider_row{display:flex;align-items:center;gap:10px;padding:8px 0}' +
'._am_slider_row input[type=range]{flex:1;-webkit-appearance:none;height:4px;border-radius:2px;background:rgba(59,130,246,.15);outline:none}' +
'._am_slider_row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#3b82f6;cursor:pointer;border:none}' +
'._am_slider_val{font-size:12px;color:#3b82f6;font-weight:600;min-width:36px;text-align:right;font-family:"SF Mono",Monaco,Consolas,monospace}' +
'._am_swatch{width:22px;height:22px;border-radius:50%;cursor:pointer;transition:transform .15s,box-shadow .15s;flex-shrink:0;border:none;outline:none}' +
'._am_swatch:hover{transform:scale(1.15)}' +
'._am_swatch_rainbow{background:transparent!important;overflow:hidden}' +
'._am_swatch_custom{position:relative;overflow:hidden;border:none!important;background:transparent!important;display:flex;align-items:center;justify-content:center}' +
'._am_swatch_custom:hover{transform:scale(1.15)!important}' +

'._am_spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(167,139,250,.2);border-top-color:#3b82f6;border-radius:50%;animation:_amSpin .6s linear infinite;vertical-align:middle;margin-right:6px}' +
'._am_dots{display:inline-flex;gap:3px;margin-left:6px}._am_dots span{width:5px;height:5px;border-radius:50%;background:#3b82f6;animation:_amDots 1.4s ease-in-out infinite}._am_dots span:nth-child(2){animation-delay:.2s}._am_dots span:nth-child(3){animation-delay:.4s}' +
'._am_wave{display:inline-flex;align-items:center;gap:2px;height:14px;vertical-align:middle;margin-right:8px}._am_wave span{display:block;width:3px;border-radius:2px;background:#3b82f6;animation:_amWave .9s ease-in-out infinite}._am_wave span:nth-child(1){height:10px;animation-delay:0s}._am_wave span:nth-child(2){height:14px;animation-delay:.15s}._am_wave span:nth-child(3){height:8px;animation-delay:.3s}._am_wave span:nth-child(4){height:12px;animation-delay:.45s}._am_wave span:nth-child(5){height:6px;animation-delay:.6s}' +
'._am_loader_text{font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#60a5fa}' +
'#_am_particles{position:absolute;bottom:0;left:0;right:0;height:100%;pointer-events:none;overflow:hidden;z-index:0}' +
'._am_particle{position:absolute;bottom:-4px;border-radius:50%;animation:_amParticleUp 3s ease-out forwards;pointer-events:none}' +
'#_am_toasts{position:fixed;bottom:80px;right:24px;z-index:2147483647;display:flex;flex-direction:column-reverse;gap:8px;pointer-events:none}' +
'._am_toast{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;background:linear-gradient(135deg,rgba(15,15,20,.95),rgba(20,20,28,.95));border:1px solid rgba(59,130,246,.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 8px 32px rgba(0,0,0,.4),0 0 0 1px rgba(59,130,246,.06);font-size:12px;font-weight:500;color:#d4d4d4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:_amToastIn .35s cubic-bezier(.16,1,.3,1) forwards;pointer-events:auto;max-width:280px}' +
'._am_toast.out{animation:_amToastOut .3s ease-in forwards}' +
'._am_toast_icon{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:8px;flex-shrink:0;font-size:13px}' +
'._am_toast_icon.success{background:rgba(34,197,94,.12);color:#22c55e}._am_toast_icon.info{background:rgba(59,130,246,.12);color:#3b82f6}._am_toast_icon.warn{background:rgba(245,158,11,.12);color:#f59e0b}._am_toast_icon.error{background:rgba(239,68,68,.12);color:#ef4444}' +
'._am_toast_text{flex:1;line-height:1.4}' +

'#_am_complete{display:none;text-align:center;padding:14px 12px}' +
'#_am_complete_title{font-size:15px;font-weight:800;color:#60a5fa;margin-bottom:4px;display:flex;align-items:center;justify-content:center;gap:6px}' +
'#_am_complete_sub{font-size:11px;color:#737373}' +

'#_am_mini{position:fixed;bottom:20px;right:20px;z-index:2147483647;background:linear-gradient(145deg,#0a0a0a,#111111);border:1px solid rgba(59,130,246,.25);border-radius:50%;width:48px;height:48px;display:none;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.5),0 0 0 1px rgba(59,130,246,.08);transition:all .35s cubic-bezier(.16,1,.3,1);pointer-events:auto;cursor:pointer;animation:_amPulse 4s ease-in-out infinite}' +
'#_am_mini:hover{transform:scale(1.1)}' +
'#_am_m_logo{height:28px;width:auto}' +

'#_am_chat{display:none;flex:1;flex-direction:column;overflow:hidden;min-height:0}' +
'#_am_chat_head{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-shrink:0}' +
'#_am_chat_back{width:28px;height:28px;border-radius:8px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.06);color:#8b8b8b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s}' +
'#_am_chat_back:hover{background:rgba(59,130,246,.15);color:#3b82f6}' +
'#_am_chat_title{font-size:13px;font-weight:600;color:#d4d4d4;flex:1}' +
'#_am_chat_limit{font-size:9px;color:#5c5c5c;letter-spacing:.5px}' +
'#_am_chat_msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px 0;min-height:0}' +
'#_am_chat_msgs::-webkit-scrollbar{width:5px}#_am_chat_msgs::-webkit-scrollbar-thumb{background:rgba(59,130,246,.2);border-radius:3px}' +
'._am_cmsg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word;animation:_amFadeIn .2s ease-out}' +
'._am_cmsg.user{align-self:flex-end;background:rgba(59,130,246,.15);color:#d4d4d4;border-bottom-right-radius:4px}' +
'._am_cmsg.ai{align-self:flex-start;background:rgba(255,255,255,.04);color:#b5b5b5;border-bottom-left-radius:4px}' +
'._am_cmsg img{max-width:100%;border-radius:8px;margin-top:6px;display:block}' +
'#_am_chat_bar{display:flex;gap:6px;margin-top:10px;flex-shrink:0;align-items:center}' +
'#_am_chat_img_btn{width:34px;height:34px;border-radius:10px;border:1px solid rgba(59,130,246,.15);background:rgba(59,130,246,.06);color:#8b8b8b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s;flex-shrink:0}' +
'#_am_chat_img_btn:hover{background:rgba(59,130,246,.15);color:#3b82f6}' +
'#_am_chat_img_btn.disabled{opacity:.3;cursor:not-allowed}' +
'#_am_chat_input{flex:1;height:34px;border-radius:10px;border:1px solid rgba(59,130,246,.12);background:rgba(255,255,255,.03);color:#d4d4d4;padding:0 12px;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s;min-width:0}' +
'#_am_chat_input:focus{border-color:rgba(59,130,246,.35)}' +
'#_am_chat_input::placeholder{color:#525252}' +
'#_am_chat_send{width:34px;height:34px;border-radius:10px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.12);color:#3b82f6;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s;flex-shrink:0}' +
'#_am_chat_send:hover{background:rgba(59,130,246,.25)}' +
'#_am_chat_send:disabled{opacity:.3;cursor:not-allowed}' +
'#_am_chat_cooldown{font-size:9px;color:#5c5c5c;text-align:center;margin-top:4px;flex-shrink:0}' +
'#_am_chat_preview{display:none;margin-top:6px;flex-shrink:0;position:relative}' +
'#_am_chat_preview img{height:48px;border-radius:8px;border:1px solid rgba(59,130,246,.15)}' +
'#_am_chat_preview_x{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:rgba(96,165,250,.8);color:#fff;border:none;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;padding:0}' +
'#_am_chat_btn{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.15);color:#3b82f6}#_am_chat_btn:hover{background:rgba(59,130,246,.18)}' +

'#_am_auth{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:30px 40px;gap:16px;animation:_amFadeIn .4s ease-out}' +
'#_am_auth_title{font-size:28px;font-weight:900;letter-spacing:4px;text-transform:uppercase;background:linear-gradient(90deg,#3b82f6,#60a5fa,#2563eb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px;font-family:"Inter","Segoe UI","SF Pro Display",sans-serif}' +
'#_am_auth_sub{font-size:12px;color:#5c5c5c;margin-bottom:12px}' +
'._am_auth_tabs{display:flex;gap:0;border-radius:10px;overflow:hidden;border:1px solid rgba(59,130,246,.15);margin-bottom:8px}' +
'._am_auth_tab{flex:1;padding:8px 20px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;color:#737373;transition:all .2s;font-family:inherit;letter-spacing:.5px}' +
'._am_auth_tab.active{background:rgba(59,130,246,.15);color:#3b82f6}' +
'._am_auth_input{width:100%;max-width:280px;height:38px;border-radius:10px;border:1px solid rgba(59,130,246,.15);background:rgba(255,255,255,.03);color:#e5e5e5;padding:0 14px;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}' +
'._am_auth_input:focus{border-color:rgba(59,130,246,.4)}' +
'._am_auth_input::placeholder{color:#525252}' +
'#_am_auth_submit{width:100%;max-width:280px;padding:10px;border-radius:10px;border:none;background:linear-gradient(135deg,rgba(59,130,246,.35),rgba(37,99,235,.3));color:#e5e5e5;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;letter-spacing:.5px}' +
'#_am_auth_submit:hover{background:linear-gradient(135deg,rgba(59,130,246,.5),rgba(37,99,235,.45))}' +
'#_am_auth_submit:disabled{opacity:.4;cursor:not-allowed}' +
'#_am_auth_err{font-size:11px;color:#60a5fa;max-width:280px;text-align:center;min-height:16px}' +
'#_am_panel.auth-mode #_am_header{display:none!important}' +
'#_am_auth_skip{width:100%;max-width:280px;padding:9px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:transparent;color:#525252;font-size:12px;cursor:pointer;transition:all .2s;font-family:inherit;letter-spacing:.3px;margin-top:2px}' +
'#_am_auth_skip:hover{border-color:rgba(59,130,246,.2);color:#737373;background:rgba(59,130,246,.04)}' +
'#_am_profile_btn{width:30px;height:30px;border-radius:50%;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.08);color:#3b82f6;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;padding:0;flex-shrink:0}' +
'#_am_profile_btn:hover{background:rgba(59,130,246,.22);transform:scale(1.06)}' +
'#_am_profile_drop{display:none;position:absolute;top:58px;right:14px;background:linear-gradient(160deg,#0f0f0f,#181818);border:1px solid rgba(59,130,246,.2);border-radius:14px;padding:14px 16px;min-width:190px;z-index:20;animation:_amFadeIn .15s ease-out;box-shadow:0 8px 32px rgba(0,0,0,.6)}' +
'#_am_profile_drop.open{display:block}' +
'#_am_profile_drop_name{font-size:14px;font-weight:700;color:#e5e5e5;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
'#_am_profile_drop_stat{font-size:11px;color:#737373;margin-bottom:12px}' +
'._am_profile_drop_btn{width:100%;padding:7px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.08);color:#60a5fa}' +
'._am_profile_drop_btn:hover{background:rgba(59,130,246,.22)}' +
'._am_profile_drop_btn.out{border-color:rgba(255,255,255,.08);background:transparent;color:#525252;margin-top:6px}' +
'._am_profile_drop_btn.out:hover{background:rgba(255,255,255,.06);color:#737373}' +
'#_am_guest_banner{display:none;align-items:center;gap:8px;padding:7px 12px;background:rgba(59,130,246,.05);border:1px solid rgba(59,130,246,.1);border-radius:10px;font-size:11px;color:#525252;flex-shrink:0}' +
'#_am_guest_banner span{flex:1}' +
'#_am_guest_signin{padding:4px 11px;border-radius:6px;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.1);color:#60a5fa;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap;transition:all .2s}' +
'#_am_guest_signin:hover{background:rgba(59,130,246,.2)}' +

'#_am_acct_section{display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px 0}' +
'#_am_acct_section input{margin-bottom:2px}' +
'#_am_acct_welcome{font-size:13px;color:#e5e5e5;font-weight:600;margin-bottom:4px;text-align:center}' +
'#_am_acct_loggedin{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%}' +
'#_am_acct_loggedout{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%}' +
'._am_acct_btn{padding:8px 16px;border-radius:8px;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.1);color:#60a5fa;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s;flex:1}' +
'._am_acct_btn:hover{background:rgba(59,130,246,.2)}' +
'._am_acct_btn:disabled{opacity:.4;cursor:not-allowed}' +
'#_am_acct_err{font-size:11px;color:#ef4444;min-height:14px;text-align:center;max-width:280px}' +

'#_am_lb{display:none;flex:1;flex-direction:column;overflow:hidden;min-height:0}' +
'#_am_lb_head{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-shrink:0}' +
'#_am_lb_back{width:28px;height:28px;border-radius:8px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.06);color:#8b8b8b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s}' +
'#_am_lb_back:hover{background:rgba(59,130,246,.15);color:#3b82f6}' +
'#_am_lb_title{font-size:13px;font-weight:600;color:#d4d4d4;flex:1}' +
'#_am_lb_list{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding:4px 0;min-height:0}' +
'#_am_lb_list::-webkit-scrollbar{width:5px}#_am_lb_list::-webkit-scrollbar-thumb{background:rgba(59,130,246,.2);border-radius:3px}' +
'._am_lb_row{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;font-size:13px;background:rgba(255,255,255,.02);border:1px solid rgba(59,130,246,.05)}' +
'._am_lb_rank{width:24px;font-weight:700;color:#3b82f6;text-align:center;flex-shrink:0}' +
'._am_lb_name{flex:1;color:#d4d4d4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
'._am_lb_score{font-weight:600;color:#60a5fa;flex-shrink:0}' +
'._am_lb_row:nth-child(1) ._am_lb_rank{color:#60a5fa}._am_lb_row:nth-child(2) ._am_lb_rank{color:#d1d5db}._am_lb_row:nth-child(3) ._am_lb_rank{color:#93c5fd}' +

'#_am_user_badge{font-size:10px;color:#737373;display:flex;align-items:center;gap:4px;margin-top:1px}' +
'#_am_user_badge span{color:#3b82f6;font-weight:600}' +
'#_am_expand_btn{display:none}' +
'#_am_home_controls{display:flex;flex-direction:column;gap:6px;flex-shrink:0}' +
'._am_hc_row{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.02);border:1px solid rgba(59,130,246,.08);border-radius:12px;padding:10px 14px}' +
'._am_hc_icon{color:#525252;display:flex;align-items:center;flex-shrink:0}' +
'._am_hc_label{font-size:12px;color:#a3a3a3;flex:1;font-weight:500}' +
'#_am_home_swatches{display:flex;gap:6px;flex-wrap:wrap}' +
'._am_hswatch{width:18px;height:18px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .2s;padding:0;outline:none;background:none}' +
'._am_hswatch:hover{transform:scale(1.15)}' +
'._am_hswatch_rainbow{background:transparent!important;overflow:hidden}' +
'._am_hswatch_custom{position:relative;overflow:hidden;border:none!important;background:transparent!important;display:flex;align-items:center;justify-content:center}' +
'._am_hswatch_custom:hover{transform:scale(1.15)!important}' +
'#_am_overlay.compact #_am_home_controls{display:none}' +
'#_am_overlay.compact #_am_expand_btn{display:flex}' +
'#_am_overlay.compact{background:transparent!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;pointer-events:none;transition:background .4s}' +
'#_am_overlay.compact #_am_panel{position:fixed;bottom:20px;right:20px;width:300px;min-width:240px;min-height:unset;max-height:90vh;pointer-events:auto;resize:none;transition:width .4s cubic-bezier(.16,1,.3,1),min-height .4s cubic-bezier(.16,1,.3,1),border-radius .3s,bottom .4s cubic-bezier(.16,1,.3,1),right .4s cubic-bezier(.16,1,.3,1)}' +
'#_am_overlay.compact #_am_header{flex-direction:row;padding:10px 14px;gap:10px;align-items:center}' +
'#_am_overlay.compact #_am_hbtns{position:static}' +
'#_am_overlay.compact #_am_logo{height:26px;width:auto}' +
'#_am_overlay.compact #_am_title{font-size:16px;letter-spacing:2px}' +
'#_am_overlay.compact #_am_stats{grid-template-columns:repeat(2,1fr);gap:6px}' +
'#_am_overlay.compact ._am_stat{padding:8px 6px}' +
'#_am_overlay.compact ._am_stat_value{font-size:15px}' +
'#_am_settings_view{display:none;position:absolute;inset:0;flex-direction:column;background:linear-gradient(170deg,#080810 0%,#0d0d14 50%,#090910 100%);z-index:3;padding:0 16px 4px}' +
'#_am_settings_view.open{display:flex}' +
'#_am_sv_head{display:flex;align-items:center;gap:10px;padding:2px 0 10px;flex-shrink:0;border-bottom:1px solid rgba(59,130,246,.08);margin-bottom:10px}' +
'#_am_sv_back{width:28px;height:28px;border-radius:8px;border:1px solid rgba(59,130,246,.2);background:rgba(59,130,246,.06);color:#8b8b8b;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:all .2s;flex-shrink:0}' +
'#_am_sv_back:hover{background:rgba(59,130,246,.15);color:#3b82f6}' +
'#_am_sv_title{font-size:13px;font-weight:600;color:#d4d4d4;flex:1;letter-spacing:.3px}' +
'#_am_sv_body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 4px 0 0}' +
'#_am_sv_body::-webkit-scrollbar{width:5px}#_am_sv_body::-webkit-scrollbar-thumb{background:rgba(59,130,246,.2);border-radius:3px}' +
'#_am_overlay.compact #_am_settings_view{display:none!important}' +
'#_am_overlay.compact #_am_body{padding:10px 14px;gap:10px}' +
'#_am_overlay.compact #_am_history{max-height:100px}' +
'#_am_overlay.compact #_am_footer{padding:8px 14px}' +
'#_am_overlay.compact ._am_fbtn{padding:7px 0;font-size:11px}' +
'#_am_overlay.compact #_am_subtitle{font-size:10px}' +
'#_am_overlay.compact #_am_user_badge{display:none}' +
'#_am_overlay.compact ._am_social_text{display:none}' +
'#_am_overlay.compact #_am_social{gap:10px}' +
'#_am_overlay.compact ._am_social_btn svg{width:14px;height:14px}' +
'#_am_chat{transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s ease}' +
'#_am_chat.sliding-out{transform:translateX(100%);opacity:0}' +
'#_am_perf_warn{display:none;align-items:center;gap:7px;padding:8px 11px;background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.18);border-radius:10px;font-size:11px;color:#60a5fa;margin-top:6px;line-height:1.4}' +
'#_am_quit_modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483648;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;animation:_amFadeIn .2s ease-out;pointer-events:auto}' +
'#_am_quit_box{background:linear-gradient(160deg,#0f0f0f,#161616);border:1px solid rgba(59,130,246,.2);border-radius:20px;padding:28px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:260px;width:90%}' +
'#_am_quit_icon{color:#60a5fa;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:14px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15)}' +
'#_am_quit_title{font-size:15px;font-weight:700;color:#e5e5e5;letter-spacing:.3px}' +
'#_am_quit_sub{font-size:12px;color:#737373;line-height:1.55;max-width:210px}' +
'#_am_quit_btns{display:flex;gap:8px;width:100%;margin-top:4px}' +
'#_am_quit_yes{flex:1;padding:10px 0;border-radius:12px;border:1px solid rgba(96,165,250,.2);background:rgba(96,165,250,.08);color:#60a5fa;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}' +
'#_am_quit_yes:hover{background:rgba(96,165,250,.2)}' +
'#_am_quit_no{flex:1;padding:10px 0;border-radius:12px;border:1px solid rgba(255,255,255,.06);background:rgba(255,255,255,.03);color:#a3a3a3;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .2s}' +
'#_am_quit_no:hover{background:rgba(255,255,255,.08);color:#e5e5e5}' +

'#_am_drag{display:none}' +
'#_am_rc_nw{position:absolute;top:0;left:0;width:18px;height:18px;cursor:nw-resize;z-index:12;border-radius:20px 0 8px 0;background:rgba(59,130,246,.12);transition:background .2s;display:none;align-items:center;justify-content:center;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:none}' +
'#_am_rc_nw:hover{background:rgba(59,130,246,.3)}' +
'#_am_rc_nw svg{pointer-events:none}' +
'#_am_overlay.compact #_am_rc_nw{display:flex}' +
'#_am_overlay.compact #_am_panel{cursor:grab;-webkit-user-select:none;user-select:none;touch-action:none}' +
'#_am_overlay.compact #_am_panel:active{cursor:grabbing}' +
'#_am_overlay.compact #_am_panel button,#_am_overlay.compact #_am_panel input,#_am_overlay.compact #_am_panel a{cursor:pointer}' +
'#_am_overlay.compact #_am_header button{cursor:pointer}' +
'</style>' +

'<svg width="0" height="0" style="position:absolute;pointer-events:none"><defs><filter id="_am_logo_tint" color-interpolation-filters="sRGB"><feFlood id="_am_logo_flood" flood-color="hsl(220,68%,60%)" result="c"/><feComposite in="c" in2="SourceAlpha" operator="in"/></filter></defs></svg>' +
'<div id="_am_overlay"><div id="_am_panel">' +
'<div id="_am_rc_nw"><svg width="10" height="10" viewBox="0 0 10 10" fill="#64748b"><path d="M10 0L10 10L0 10z"/></svg></div>' +
'<div id="_am_header">' +
'<img id="_am_logo" src="'+logoSrc+'">' +
'<div id="_am_htext"><div id="_am_title">AMOURA</div><div id="_am_subtitle"></div><div id="_am_user_badge"></div></div>' +
'<div id="_am_hbtns"><button class="_am_hbtn" id="_am_settings_btn" title="Settings">'+IC.settings+'</button><button class="_am_hbtn" id="_am_expand_btn" title="Open Full">'+IC.max+'</button><button class="_am_hbtn" id="_am_min_btn" title="Minimize">'+IC.minus+'</button><button class="_am_hbtn danger" id="_am_close" title="Stop">'+IC.x+'</button></div>' +
'</div>' +
'<div id="_am_particles"></div>' +
'<div id="_am_body">' +
'<div id="_am_guest_banner" style="display:none"></div>' +
'<div id="_am_stats">' +
'<div class="_am_stat"><div class="_am_stat_icon">'+IC.check+'</div><div class="_am_stat_value green" id="_am_count">0</div><div class="_am_stat_label">Solved</div></div>' +
'<div class="_am_stat"><div class="_am_stat_icon">'+IC.target+'</div><div class="_am_stat_value purple" id="_am_score">--</div><div class="_am_stat_label">SmartScore</div></div>' +
'<div class="_am_stat"><div class="_am_stat_icon">'+IC.hash+'</div><div class="_am_stat_value amber" id="_am_ixlq">0</div><div class="_am_stat_label">Questions</div></div>' +
'<div class="_am_stat"><div class="_am_stat_icon">'+IC.clock+'</div><div class="_am_stat_value blue" id="_am_timer">0:00</div><div class="_am_stat_label">Session</div></div>' +
'</div>' +
'<div id="_am_current"><div id="_am_cur_label">'+IC.bolt+' Current</div><div id="_am_cur_status">Initializing...</div><div id="_am_cur_answer"></div></div>' +
'<div id="_am_home_controls">' +
'<div class="_am_hc_row"><div class="_am_hc_icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div><div class="_am_hc_label">Auto Answer</div><button class="_am_toggle on" id="_am_home_auto"></button></div>' +
'<div class="_am_hc_row"><div class="_am_hc_icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg></div><div class="_am_hc_label">Theme</div><div id="_am_home_swatches"></div></div>' +
'</div>' +
'<div id="_am_complete"><div id="_am_complete_title">'+IC.sparkle+' Lesson Complete!</div><div id="_am_complete_sub">SmartScore reached 100</div></div>' +
'<div id="_am_history"><div id="_am_hist_label">'+IC.clock+' History</div><div id="_am_hist_list"></div></div>' +
'<div id="_am_not_lesson"><div id="_am_not_lesson_icon">'+IC.compass+'</div><div id="_am_not_lesson_title">No Active Lesson</div><div id="_am_not_lesson_sub">Navigate to an IXL practice lesson first, then Amoura will start automatically.</div><div id="_am_not_lesson_check"><span class="_am_spinner"></span> Watching for lesson...</div></div>' +
'<div id="_am_settings_view">' +
'<div id="_am_sv_head"><button id="_am_sv_back">'+IC.back+'</button><div id="_am_sv_title">Settings</div></div>' +
'<div id="_am_sv_body">' +
'<div id="_am_settings_title">AI Model</div>' +
'<div class="_am_seg_row"><button class="_am_seg" id="_am_seg_flash">'+IC.flash+' Flash</button><button class="_am_seg" id="_am_seg_pro">'+IC.brain+' Pro</button><button class="_am_seg" id="_am_seg_auto">'+IC.wand+' Auto</button></div>' +
'<div class="_am_setting_desc" id="_am_model_desc" style="font-size:10.5px;text-align:center;margin:0 0 10px;opacity:.65"></div>' +
'<div id="_am_settings_title">Automation</div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Auto Start</div><div class="_am_setting_desc">Start solving immediately when AMOURA loads</div></div><button class="_am_toggle" id="_am_toggle_autostart"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Auto Answer</div><div class="_am_setting_desc">Auto-submit answers (off = show only)</div></div><button class="_am_toggle on" id="_am_toggle_auto"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Auto Next</div><div class="_am_setting_desc">Auto-start next question after solving</div></div><button class="_am_toggle on" id="_am_toggle_autonext"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Auto Got It</div><div class="_am_setting_desc">Auto-dismiss wrong answer screen</div></div><button class="_am_toggle on" id="_am_toggle_gotit"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Auto Skip</div><div class="_am_setting_desc">Auto-skip Continue/OK explanation screens</div></div><button class="_am_toggle on" id="_am_toggle_autoskip"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Stop at 100</div><div class="_am_setting_desc">Stop when SmartScore reaches 100</div></div><button class="_am_toggle on" id="_am_toggle_stopat100"></button></div>' +
'<div id="_am_settings_title" style="margin-top:10px">AI Tuning</div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">AI Thinking</div><div class="_am_setting_desc">Let AI reason before answering</div></div><button class="_am_toggle on" id="_am_toggle_thinking"></button></div>' +
'<div class="_am_slider_row"><div class="_am_setting_label" style="min-width:95px">Think Budget</div><input type="range" id="_am_thinking_budget" min="0" max="8192" step="1024" value="4096"><span class="_am_slider_val" id="_am_thinking_val">4096</span></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Include Screenshot</div><div class="_am_setting_desc">Send page screenshot for better accuracy</div></div><button class="_am_toggle on" id="_am_toggle_screenshot"></button></div>' +
'<div class="_am_slider_row"><div class="_am_setting_label" style="min-width:95px">Speed (delay)</div><input type="range" id="_am_delay_slider" min="0" max="5000" step="100" value="800"><span class="_am_slider_val" id="_am_delay_val">0.8s</span></div>' +
'<div id="_am_perf_warn">'+IC.warn+' Low accuracy risk: enable AI Thinking or increase delay speed</div>' +
'<div id="_am_settings_title" style="margin-top:10px">Appearance</div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Advanced Mode</div><div class="_am_setting_desc">Show stats, history &amp; full details</div></div><button class="_am_toggle" id="_am_toggle_adv"></button></div>' +
'<div class="_am_setting_label" style="font-size:11px;color:#737373;margin-bottom:6px">Accent Color</div>' +
'<div id="_am_color_swatches" style="display:flex;gap:8px;flex-wrap:wrap;padding:2px 0 8px;align-items:center"></div>' +
'<div id="_am_settings_title" style="margin-top:6px">Stealth</div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Disappear on Tab Switch</div><div class="_am_setting_desc">Fully hide UI when you leave the tab</div></div><button class="_am_toggle" id="_am_toggle_disappear"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Minimize on Tab Switch</div><div class="_am_setting_desc">Shrink to mini bar when you leave the tab</div></div><button class="_am_toggle" id="_am_toggle_minblur"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Quit Confirmation</div><div class="_am_setting_desc">Show confirm dialog before quitting</div></div><button class="_am_toggle on" id="_am_toggle_quitconfirm"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Answer While Minimized</div><div class="_am_setting_desc">Keep solving when fully minimized to dot</div></div><button class="_am_toggle on" id="_am_toggle_answermin"></button></div>' +
'<div class="_am_slider_row"><div class="_am_setting_label" style="min-width:95px">Clicks to Open</div><input type="range" id="_am_clicks_slider" min="1" max="10" step="1" value="'+ (parseInt(localStorage.getItem('_am_click_req')||'1')) +'"><span class="_am_slider_val" id="_am_clicks_val">'+ (parseInt(localStorage.getItem('_am_click_req')||'1')) +'</span></div>' +
'<div id="_am_settings_title" style="margin-top:10px">Beta</div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Instant Question Detection</div><div class="_am_setting_desc">Detect new questions instantly via DOM changes instead of polling</div></div><button class="_am_toggle on" id="_am_toggle_betaobs"></button></div>' +
'<div class="_am_setting"><div><div class="_am_setting_label">Persist on IXL</div><div class="_am_setting_desc">Stay active when navigating between IXL pages</div></div><button class="_am_toggle" id="_am_toggle_persist"></button></div>' +

'<div id="_am_settings_title" style="margin-top:10px">Account</div>' +
'<div id="_am_acct_section">' +
'<div id="_am_acct_loggedout">' +
'<div class="_am_setting_desc" style="margin-bottom:6px;text-align:center">Sign in to sync settings across devices</div>' +
'<form autocomplete="off" onsubmit="return false" style="display:contents">' +
'<input class="_am_auth_input" id="_am_acct_user" placeholder="Username" maxlength="20" autocomplete="username">' +
'<input class="_am_auth_input" id="_am_acct_pass" type="password" placeholder="Password" maxlength="40" autocomplete="current-password">' +
'<div id="_am_acct_err"></div>' +
'<div style="display:flex;gap:8px;width:100%;max-width:280px">' +
'<button class="_am_acct_btn" id="_am_acct_signin" type="submit">Sign In</button>' +
'<button class="_am_acct_btn" id="_am_acct_signup" type="button">Sign Up</button>' +
'</div>' +
'</form>' +
'</div>' +
'<div id="_am_acct_loggedin" style="display:none">' +
'<div id="_am_acct_welcome">Welcome!</div>' +
'<div style="display:flex;gap:8px;width:100%;max-width:280px">' +
'<div id="_am_sync_status" style="font-size:10px;color:#60a5fa;text-align:center;margin-bottom:4px;opacity:.8">'+IC.sync+' Auto-sync enabled</div>' +
'<button class="_am_acct_btn" id="_am_acct_signout" style="background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.25);color:#ef4444">Sign Out</button>' +
'</div>' +
'</div>' +
'</div>' +
'</div>' +
'</div>' +
'</div>' +
'<div id="_am_footer">' +
'<div id="_am_footer_btns"><button class="_am_fbtn" id="_am_pause_btn">'+IC.pause+' Pause</button><button class="_am_fbtn" id="_am_stop_btn">Quit</button><button class="_am_fbtn" id="_am_next_btn" style="display:none"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style="display:inline;vertical-align:middle"><path d="M2 1.5L9.5 6L2 10.5Z"/><rect x="9.5" y="1.5" width="1.8" height="9" rx=".9"/></svg> Solve Next</button></div>' +
'<div id="_am_social">' +
'<a class="_am_social_btn" href="https://tinyurl.com/AmouraIXl" target="_blank" rel="noopener"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><span class="_am_social_text">tinyurl.com/AmouraIXl</span></a>' +
'<a class="_am_social_btn" href="https://discord.gg/dXpuTuGQ24" target="_blank" rel="noopener"><svg width="11" height="9" viewBox="0 0 71 55" fill="currentColor"><path d="M60.1 4.9A58.5 58.5 0 0 0 45.7.2a.2.2 0 0 0-.2.1 40.7 40.7 0 0 0-1.8 3.7 54 54 0 0 0-16.2 0A26.4 26.4 0 0 0 25.7.3a.2.2 0 0 0-.2-.1A58.4 58.4 0 0 0 11.1 4.9a.2.2 0 0 0-.1.1C1.6 18.7-.9 32 .3 45.1v.2a58.9 58.9 0 0 0 17.7 9 .2.2 0 0 0 .3-.1 42 42 0 0 0 3.6-5.9.2.2 0 0 0-.1-.3 38.8 38.8 0 0 1-5.5-2.6.2.2 0 0 1 0-.4l1.1-.9a.2.2 0 0 1 .2 0 42 42 0 0 0 35.8 0 .2.2 0 0 1 .2 0l1.1.9a.2.2 0 0 1 0 .4 36.4 36.4 0 0 1-5.5 2.6.2.2 0 0 0-.1.3 47.2 47.2 0 0 0 3.6 5.9.2.2 0 0 0 .3.1A58.7 58.7 0 0 0 70.7 45.3v-.2c1.4-15-2.3-28-9.8-39.6a.2.2 0 0 0-.1-.1zM23.7 37c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7zm23.3 0c-3.4 0-6.3-3.2-6.3-7s2.8-7 6.3-7 6.4 3.2 6.3 7-2.8 7-6.3 7z"/></svg><span class="_am_social_text">discord.gg/dXpuTuGQ24</span></a>' +
'</div>' +
'</div>' +
'<div id="_am_profile_drop" style="display:none"></div>' +
'</div></div>' +

'<div id="_am_mini">' +
'<img id="_am_m_logo" src="'+logoSrc+'">' +
'</div>' +

'<div id="_am_quit_modal"><div id="_am_quit_box"><div id="_am_quit_title">Quit AMOURA?</div><div id="_am_quit_sub">Your session will end and the solver will stop.</div><div id="_am_quit_btns"><button id="_am_quit_yes">Quit</button><button id="_am_quit_no">Cancel</button></div></div></div>';
  document.documentElement.appendChild(root);

  root.style.cssText = 'position:fixed!important;z-index:2147483647!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;overflow:visible!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;';

  const _reattachFn = () => {
    if (!window._amouraRunning) return;
    if (!root.isConnected) {
      console.log('[amoura] WATCHDOG: root was removed, re-attaching');
      document.documentElement.appendChild(root);
    }

    if (root.style.display === 'none' || root.style.visibility === 'hidden') {
      console.log('[amoura] WATCHDOG: root was hidden, forcing visible');
      root.style.display = 'block';
      root.style.visibility = 'visible';
    }
  };
  const _reattachObs = new MutationObserver(_reattachFn);
  _reattachObs.observe(document.documentElement, { childList: true });
  _reattachObs.observe(document.body, { childList: true });
  const _reattach = setInterval(_reattachFn, 200);
  const overlay = root.querySelector('#_am_overlay');
  const mini = root.querySelector('#_am_mini');

  mini.style.pointerEvents = 'auto';
  const panel = root.querySelector('#_am_panel');
  panel.style.pointerEvents = 'auto';
  const p = {
    status: root.querySelector('#_am_cur_status'),
    curAnswer: root.querySelector('#_am_cur_answer'),
    count: root.querySelector('#_am_count'),
    score: root.querySelector('#_am_score'),
    ixlq: root.querySelector('#_am_ixlq'),
    timer: root.querySelector('#_am_timer'),
    subtitle: root.querySelector('#_am_subtitle'),
    histList: root.querySelector('#_am_hist_list'),
    mCount: null,
    mStatus: null,
    complete: root.querySelector('#_am_complete'),
    settings: root.querySelector('#_am_settings'),
    authSection: root.querySelector('#_am_auth'),
    userBadge: root.querySelector('#_am_user_badge'),
    lbSection: root.querySelector('#_am_lb'),
    lbList: root.querySelector('#_am_lb_list'),
  };

  const S_KEYS = { auto: '_am_s_auto', autonext: '_am_s_autonext', gotit: '_am_s_gotit', autoskip: '_am_s_autoskip', thinking: '_am_s_thinking', budget: '_am_s_budget', delay: '_am_s_delay', disappear: '_am_s_disappear', minblur: '_am_s_minblur', advanced: '_am_s_advanced', quitconfirm: '_am_s_quitconfirm', answermin: '_am_s_answermin', modelMode: '_am_s_modelmode', betaobs: '_am_s_betaobs', persist: '_am_s_persist', autostart: '_am_s_autostart', screenshot: '_am_s_screenshot', stopat100: '_am_s_stopat100' };
  function saveSetting(key, val) { _settingsCache[key] = String(val); try { localStorage.setItem(key, val); } catch(e) {} _debouncedSync(); }
  function loadBool(key, def) { if (key in _settingsCache) return _settingsCache[key] === '1'; const v = localStorage.getItem(key); return v === null ? def : v === '1'; }
  function loadInt(key, def) { if (key in _settingsCache) { const p = parseInt(_settingsCache[key]); return isNaN(p) ? def : p; } const v = localStorage.getItem(key); return v === null ? def : parseInt(v); }

  let autoAnswer = loadBool(S_KEYS.auto, true);
  const toggleAuto = root.querySelector('#_am_toggle_auto');
  toggleAuto.classList.toggle('on', autoAnswer);
  toggleAuto.onclick = () => { autoAnswer = !autoAnswer; toggleAuto.classList.toggle('on', autoAnswer); saveSetting(S_KEYS.auto, autoAnswer ? '1' : '0'); };

  let autoStart = loadBool(S_KEYS.autostart, false);
  const toggleAutoStart = root.querySelector('#_am_toggle_autostart');
  toggleAutoStart.classList.toggle('on', autoStart);
  toggleAutoStart.onclick = () => { autoStart = !autoStart; toggleAutoStart.classList.toggle('on', autoStart); saveSetting(S_KEYS.autostart, autoStart ? '1' : '0'); };

  let autoNext = loadBool(S_KEYS.autonext, true);
  const toggleAutoNext = root.querySelector('#_am_toggle_autonext');
  toggleAutoNext.classList.toggle('on', autoNext);
  toggleAutoNext.onclick = () => { autoNext = !autoNext; toggleAutoNext.classList.toggle('on', autoNext); saveSetting(S_KEYS.autonext, autoNext ? '1' : '0'); };

  let autoGotIt = loadBool(S_KEYS.gotit, true);
  const toggleGotIt = root.querySelector('#_am_toggle_gotit');
  toggleGotIt.classList.toggle('on', autoGotIt);
  toggleGotIt.onclick = () => { autoGotIt = !autoGotIt; toggleGotIt.classList.toggle('on', autoGotIt); saveSetting(S_KEYS.gotit, autoGotIt ? '1' : '0'); };

  let autoSkip = loadBool(S_KEYS.autoskip, true);
  const toggleAutoSkip = root.querySelector('#_am_toggle_autoskip');
  toggleAutoSkip.classList.toggle('on', autoSkip);
  toggleAutoSkip.onclick = () => { autoSkip = !autoSkip; toggleAutoSkip.classList.toggle('on', autoSkip); saveSetting(S_KEYS.autoskip, autoSkip ? '1' : '0'); };

  let modelMode = _settingsCache[S_KEYS.modelMode] || localStorage.getItem(S_KEYS.modelMode) || 'auto';
  const MODEL_DESCS = { flash: 'Fast & cheap — great for simple questions', pro: 'Full power — best for hard questions', auto: 'Picks Flash or Pro based on complexity' };
  function updateModelSeg() {
    ['flash','pro','auto'].forEach(m => root.querySelector('#_am_seg_'+m)?.classList.toggle('active', modelMode === m));
    const desc = root.querySelector('#_am_model_desc'); if (desc) desc.textContent = MODEL_DESCS[modelMode];
  }
  updateModelSeg();
  ['flash','pro','auto'].forEach(m => { const btn = root.querySelector('#_am_seg_'+m); if (btn) btn.onclick = () => { modelMode = m; saveSetting(S_KEYS.modelMode, m); updateModelSeg(); }; });

  let thinkingEnabled = loadBool(S_KEYS.thinking, true);
  let thinkingBudget = loadInt(S_KEYS.budget, 4096);
  const toggleThinking = root.querySelector('#_am_toggle_thinking');
  const thinkingSlider = root.querySelector('#_am_thinking_budget');
  const thinkingValEl = root.querySelector('#_am_thinking_val');
  toggleThinking.classList.toggle('on', thinkingEnabled);
  thinkingSlider.value = thinkingBudget; thinkingValEl.textContent = thinkingEnabled ? thinkingBudget : 'OFF';
  thinkingSlider.disabled = !thinkingEnabled;
  toggleThinking.onclick = () => { thinkingEnabled = !thinkingEnabled; toggleThinking.classList.toggle('on', thinkingEnabled); thinkingSlider.disabled = !thinkingEnabled; thinkingValEl.textContent = thinkingEnabled ? thinkingBudget : 'OFF'; saveSetting(S_KEYS.thinking, thinkingEnabled ? '1' : '0'); updatePerfWarn(); };
  thinkingSlider.oninput = () => { thinkingBudget = parseInt(thinkingSlider.value); thinkingValEl.textContent = thinkingBudget; saveSetting(S_KEYS.budget, thinkingBudget); };

  let screenshotEnabled = loadBool(S_KEYS.screenshot, true);
  const toggleScreenshot = root.querySelector('#_am_toggle_screenshot');
  toggleScreenshot.classList.toggle('on', screenshotEnabled);
  toggleScreenshot.onclick = () => { screenshotEnabled = !screenshotEnabled; toggleScreenshot.classList.toggle('on', screenshotEnabled); saveSetting(S_KEYS.screenshot, screenshotEnabled ? '1' : '0'); };

  let stopAt100 = loadBool(S_KEYS.stopat100, true);
  const toggleStopAt100 = root.querySelector('#_am_toggle_stopat100');
  toggleStopAt100.classList.toggle('on', stopAt100);
  toggleStopAt100.onclick = () => { stopAt100 = !stopAt100; toggleStopAt100.classList.toggle('on', stopAt100); saveSetting(S_KEYS.stopat100, stopAt100 ? '1' : '0'); };

  const delaySlider = root.querySelector('#_am_delay_slider');
  const delayValEl = root.querySelector('#_am_delay_val');
  const perfWarn = root.querySelector('#_am_perf_warn');
  const savedDelay = loadInt(S_KEYS.delay, 800);
  DELAY_MIN = savedDelay; DELAY_MAX = Math.max(savedDelay, savedDelay + 600);
  delaySlider.value = savedDelay; delayValEl.textContent = (savedDelay / 1000).toFixed(1) + 's';
  function updatePerfWarn() { perfWarn.style.display = (!thinkingEnabled && DELAY_MIN < 400) ? 'flex' : 'none'; }
  delaySlider.oninput = () => { const v = parseInt(delaySlider.value); DELAY_MIN = v; DELAY_MAX = Math.max(v, v + 600); delayValEl.textContent = (v / 1000).toFixed(1) + 's'; saveSetting(S_KEYS.delay, v); updatePerfWarn(); };

  let stealthDisappear = loadBool(S_KEYS.disappear, false);
  let stealthMinBlur = loadBool(S_KEYS.minblur, false);
  const toggleDisappear = root.querySelector('#_am_toggle_disappear');
  const toggleMinBlur = root.querySelector('#_am_toggle_minblur');
  toggleDisappear.classList.toggle('on', stealthDisappear);
  toggleMinBlur.classList.toggle('on', stealthMinBlur);
  toggleDisappear.onclick = () => { stealthDisappear = !stealthDisappear; toggleDisappear.classList.toggle('on', stealthDisappear); saveSetting(S_KEYS.disappear, stealthDisappear ? '1' : '0'); if (stealthDisappear && stealthMinBlur) { stealthMinBlur = false; toggleMinBlur.classList.remove('on'); saveSetting(S_KEYS.minblur, '0'); } };
  toggleMinBlur.onclick = () => { stealthMinBlur = !stealthMinBlur; toggleMinBlur.classList.toggle('on', stealthMinBlur); saveSetting(S_KEYS.minblur, stealthMinBlur ? '1' : '0'); if (stealthMinBlur && stealthDisappear) { stealthDisappear = false; toggleDisappear.classList.remove('on'); saveSetting(S_KEYS.disappear, '0'); } };
  let answerWhileMin = loadBool(S_KEYS.answermin, true);
  const toggleAnswerMin = root.querySelector('#_am_toggle_answermin');
  toggleAnswerMin.classList.toggle('on', answerWhileMin);
  toggleAnswerMin.onclick = () => { answerWhileMin = !answerWhileMin; toggleAnswerMin.classList.toggle('on', answerWhileMin); saveSetting(S_KEYS.answermin, answerWhileMin ? '1' : '0'); };
  const clicksSlider = root.querySelector('#_am_clicks_slider');
  const clicksValEl = root.querySelector('#_am_clicks_val');
  clicksSlider.oninput = () => { const v = parseInt(clicksSlider.value); clicksValEl.textContent = v; saveSetting('_am_click_req', v); };

  let betaObserver = loadBool(S_KEYS.betaobs, true);
  const toggleBetaObs = root.querySelector('#_am_toggle_betaobs');
  toggleBetaObs.classList.toggle('on', betaObserver);
  toggleBetaObs.onclick = () => { betaObserver = !betaObserver; toggleBetaObs.classList.toggle('on', betaObserver); saveSetting(S_KEYS.betaobs, betaObserver ? '1' : '0'); };

  let persistEnabled = loadBool(S_KEYS.persist, false);
  const togglePersist = root.querySelector('#_am_toggle_persist');
  togglePersist.classList.toggle('on', persistEnabled);
  togglePersist.onclick = () => {
    persistEnabled = !persistEnabled;
    togglePersist.classList.toggle('on', persistEnabled);
    saveSetting(S_KEYS.persist, persistEnabled ? '1' : '0');
    if (persistEnabled) {
      try { localStorage.setItem('_am_persist_v2', '1'); } catch(e) {}
    } else {
      try { localStorage.removeItem('_am_persist_v2'); localStorage.removeItem('_am_solver_cache_v2'); } catch(e) {}
    }
  };

  let advancedMode = loadBool(S_KEYS.advanced, false);
  const toggleAdv = root.querySelector('#_am_toggle_adv');
  toggleAdv.classList.toggle('on', advancedMode);
  function applyAdvancedMode() {
    const statsEl = root.querySelector('#_am_stats');
    const histEl = root.querySelector('#_am_history');
    if (statsEl) statsEl.style.display = advancedMode ? 'grid' : 'none';
    if (histEl) histEl.style.display = advancedMode ? '' : 'none';
  }
  toggleAdv.onclick = () => { advancedMode = !advancedMode; toggleAdv.classList.toggle('on', advancedMode); saveSetting(S_KEYS.advanced, advancedMode ? '1' : '0'); applyAdvancedMode(); };

  const ACCENTS = [
    { h: 220, name: 'Blue' }, { h: 270, name: 'Purple' }, { h: 320, name: 'Pink' },
    { h: 0, name: 'Red' }, { h: 28, name: 'Orange' }, { h: 175, name: 'Teal' }, { h: 145, name: 'Green' },
  ];

  let _rbInterval = null;
  let _rbActive = false;
  function _rbStop() { _rbActive = false; if (_rbInterval) { clearInterval(_rbInterval); _rbInterval = null; } }
  let _customColorActive = false;
  function setRainbow(silent) {
    if (!silent) _amToast('Rainbow mode', 'info');
    saveSetting('_am_s_color', 'rainbow');
    _customColorActive = false;
    let _rbHue = 0;
    _rbStop();
    _rbActive = true;
    setAccent(_rbHue, null);
    _rbInterval = setInterval(() => {
      _rbHue = (_rbHue + 1) % 360;
      setAccent(_rbHue, null);
    }, 50);
    _updateSwatchSVGs('rainbow');
    const sc = root.querySelector('#_am_color_swatches');
    if (sc) sc.querySelectorAll('._am_swatch').forEach(s => { s.style.boxShadow = ''; s.style.transform = ''; });
    const hs = root.querySelector('#_am_home_swatches');
    if (hs) hs.querySelectorAll('._am_hswatch').forEach(s => { s.style.boxShadow = ''; s.style.transform = ''; });
    setTimeout(() => {
      const el = root.querySelector('#_am_dyn_accent');
      if (el) el.textContent += '\n._am_swatch_rainbow,._am_hswatch_rainbow{box-shadow:0 0 0 2px #1a1a2e,0 0 0 4px #a855f7!important;transform:scale(1.2)!important}';
    }, 60);
  }

  function setAccent(h, themeName) {

    if (themeName) { _rbStop(); _customColorActive = false; _updateSwatchSVGs('default'); saveSetting('_am_s_color', h); }
    else if (!_rbActive && !_customColorActive) { _rbStop(); saveSetting('_am_s_color', h); }
    root.querySelectorAll('#_am_logo,#_am_m_logo,#_am_auth_hero_logo').forEach(l => l.style.removeProperty('filter'));
    if (themeName) _amToast('Selected ' + themeName, 'info');
    let el = root.querySelector('#_am_dyn_accent');
    if (!el) { el = document.createElement('style'); el.id = '_am_dyn_accent'; root.appendChild(el); }

    const aS  = `hsl(${h},68%,60%)`;
    const a2S = `hsl(${h},80%,70%)`;
    const a3S = `hsl(${h},72%,50%)`;

    const A  = (al) => `hsla(${h},68%,60%,${al})`;
    const A2 = (al) => `hsla(${h},80%,70%,${al})`;
    const A3 = (al) => `hsla(${h},72%,50%,${al})`;

    const _amFlood = root.querySelector('#_am_logo_flood');
    if (_amFlood) _amFlood.setAttribute('flood-color', `hsl(${h},68%,60%)`);
    el.textContent = [
      `@keyframes _amPulse{0%,100%{box-shadow:0 0 0 1px ${A(.3)},inset 0 0 40px ${A(.04)},0 0 35px ${A(.45)},0 0 90px ${A(.2)},0 30px 60px rgba(0,0,0,.75)}50%{box-shadow:0 0 0 1px ${A2(.55)},inset 0 0 50px ${A(.07)},0 0 60px ${A(.7)},0 0 140px ${A(.32)},0 30px 60px rgba(0,0,0,.75)}}`,
      `@keyframes _amBorder{0%,100%{border-color:${A(.2)}}50%{border-color:${A(.45)}}}`,
      `#_am_logo,#_am_m_logo{filter:${h === 220 ? '' : 'url(#_am_logo_tint) '}drop-shadow(0 0 22px ${A(.85)}) drop-shadow(0 0 44px ${A(.5)}) drop-shadow(0 0 70px ${A(.2)})!important}`,
      `#_am_auth_hero_logo{filter:${h === 220 ? '' : 'url(#_am_logo_tint) '}drop-shadow(0 0 30px ${A(.8)}) drop-shadow(0 0 55px ${A(.35)})!important}`,
      `#_am_panel{border-color:${A(.35)}!important}`,
      `#_am_header{background:linear-gradient(180deg,${A(.1)} 0%,${A(.03)} 60%,transparent 100%)!important;border-bottom-color:${A(.12)}!important}`,
      `#_am_header::before{background:linear-gradient(90deg,transparent,${A2(.6)},transparent)!important}`,
      `#_am_header::after{background:linear-gradient(90deg,transparent,${A(.06)},transparent)!important}`,
      `#_am_title,#_am_auth_title{background:linear-gradient(90deg,${a2S},hsl(${h},85%,75%),${a3S},${a2S})!important;background-size:300%!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important}`,
      `._am_toggle.on{background:${A(.45)}!important}`,
      `._am_hbtn{border-color:${A(.2)}!important;background:${A(.06)}!important}._am_hbtn:hover{background:${A(.15)}!important;color:${aS}!important}`,
      `._am_hbtn.danger{border-color:rgba(239,68,68,.25)!important;color:#ef4444!important}._am_hbtn.danger:hover{background:rgba(239,68,68,.15)!important;color:#f87171!important}`,
      `._am_stat_value.purple,._am_stat_value.blue,._am_stat_value.green,._am_stat_value.amber{color:${aS}!important}`,
      `._am_stat_icon{color:${A(.6)}!important}`,
      `#_am_cur_label{color:${A(.7)}!important}`,
      `#_am_hist_label{color:${A(.6)}!important}`,
      `._am_hist_num.ok{background:${A(.1)}!important;color:${a2S}!important}._am_hist_num.fail{background:${A(.1)}!important;color:${a2S}!important}`,
      `._am_hc_row{border-color:${A(.08)}!important}._am_hc_icon{color:${A(.6)}!important}`,
      `._am_hswatch{border-color:transparent!important}`,
      `#_am_complete_title{color:${aS}!important}`,
      `#_am_m_count{color:${aS}!important}`,
      `._am_lb_score{color:${aS}!important}`,
      `._am_hist_type{background:${A(.06)}!important;color:${A(.7)}!important}._am_hist_item{border-bottom-color:${A(.04)}!important}`,
      `#_am_history{border-color:${A(.06)}!important}#_am_history::-webkit-scrollbar-thumb{background:${A(.25)}!important}`,
      `#_am_current{border-color:${A(.12)}!important}`,
      `._am_slider_row input[type=range]{background:${A(.15)}!important}._am_slider_row input[type=range]::-webkit-slider-thumb{background:${aS}!important}`,
      `._am_slider_val{color:${aS}!important}`,
      `._am_seg.active{background:${A(.15)}!important;border-color:${A(.35)}!important;color:${aS}!important}`,
      `._am_spinner{border-top-color:${aS}!important}._am_dots span{background:${aS}!important}`,
      `#_am_settings{border-color:${A(.08)}!important}#_am_settings_title{color:${A(.7)}!important}`,
      `#_am_perf_warn{background:${A(.06)}!important;border-color:${A(.18)}!important;color:${a2S}!important}`,
      `#_am_footer{border-top-color:${A(.08)}!important}`,
      `#_am_pause_btn{background:${A(.08)}!important;border-color:${A(.15)}!important;color:${a2S}!important}#_am_pause_btn:hover{background:${A(.18)}!important}`,
      `#_am_next_btn{background:${A(.08)}!important;border-color:${A(.3)}!important;color:${a2S}!important}#_am_next_btn:hover{background:${A(.2)}!important;border-color:${A(.55)}!important}`,
      `#_am_stop_btn{background:${A(.08)}!important;border-color:${A(.15)}!important;color:${a2S}!important}#_am_stop_btn:hover{background:${A(.18)}!important}`,
      `#_am_mini{border-color:${A(.25)}!important;box-shadow:0 8px 32px rgba(0,0,0,.5),0 0 0 1px ${A(.08)}!important}`,
      `._am_auth_tab.active{background:${A(.15)}!important;color:${aS}!important}._am_auth_tabs{border-color:${A(.15)}!important}`,
      `._am_auth_input{border-color:${A(.15)}!important}._am_auth_input:focus{border-color:${A(.4)}!important}`,
      `#_am_auth_submit{background:linear-gradient(135deg,${A(.35)},${A3(.3)})!important}#_am_auth_submit:hover{background:linear-gradient(135deg,${A(.5)},${A3(.45)})!important}`,
      `#_am_auth_skip:hover{border-color:${A(.2)}!important;background:${A(.04)}!important}`,
      `#_am_profile_btn{border-color:${A(.25)}!important;background:${A(.08)}!important;color:${aS}!important}#_am_profile_btn:hover{background:${A(.22)}!important}`,
      `#_am_profile_drop{border-color:${A(.2)}!important}`,
      `._am_profile_drop_btn{border-color:${A(.25)}!important;background:${A(.08)}!important;color:${a2S}!important}._am_profile_drop_btn:hover{background:${A(.22)}!important}`,
      `#_am_quit_box{border-color:${A(.2)}!important}#_am_quit_icon{background:${A(.08)}!important;border-color:${A(.15)}!important;color:${a2S}!important}`,
      `#_am_quit_yes{border-color:${A2(.2)}!important;background:${A2(.08)}!important;color:${a2S}!important}#_am_quit_yes:hover{background:${A2(.2)}!important}`,
      `#_am_chat_back,#_am_lb_back{border-color:${A(.2)}!important;background:${A(.06)}!important}#_am_chat_back:hover,#_am_lb_back:hover{background:${A(.15)}!important;color:${aS}!important}`,
      `#_am_chat_input{border-color:${A(.12)}!important}#_am_chat_input:focus{border-color:${A(.35)}!important}`,
      `#_am_chat_send{border-color:${A(.2)}!important;background:${A(.12)}!important;color:${aS}!important}#_am_chat_send:hover{background:${A(.25)}!important}`,
      `#_am_chat_img_btn{border-color:${A(.15)}!important;background:${A(.06)}!important}#_am_chat_img_btn:hover{background:${A(.15)}!important;color:${aS}!important}`,
      `#_am_chat_msgs::-webkit-scrollbar-thumb{background:${A(.2)}!important}._am_cmsg.user{background:${A(.15)}!important}`,
      `#_am_chat_btn{background:${A(.08)}!important;border-color:${A(.15)}!important;color:${aS}!important}#_am_chat_btn:hover{background:${A(.18)}!important}`,
      `#_am_guest_banner{background:${A(.05)}!important;border-color:${A(.1)}!important}`,
      `#_am_guest_signin{border-color:${A(.25)}!important;background:${A(.1)}!important;color:${a2S}!important}#_am_guest_signin:hover{background:${A(.2)}!important}`,
      `._am_lb_rank{color:${aS}!important}._am_lb_row{border-color:${A(.05)}!important}#_am_lb_list::-webkit-scrollbar-thumb{background:${A(.2)}!important}`,
      `#_am_not_lesson_title{color:${aS}!important}#_am_not_lesson_check{color:${A(.7)}!important}`,
      `#_am_rc_nw{background:${A(.12)}!important}#_am_rc_nw:hover{background:${A(.3)}!important}`,
      `#_am_user_badge span{color:${aS}!important}`,
      `._am_wave span{background:${aS}!important}._am_loader_text{color:${a2S}!important}`,
      `._am_toast{border-color:${A(.2)}!important}`,
      `._am_toast_icon.info{background:${A(.12)}!important;color:${aS}!important}`,
      `._am_answer_box{background:${A(.06)}!important;border-color:${A(.15)}!important;color:${a2S}!important}`,
      `._am_answer_box:hover{border-color:${A(.35)}!important;box-shadow:0 0 16px ${A(.12)}!important}`,
      `._am_answer_box .katex{color:${a2S}!important}`,
      `._am_stat{border-color:${A(.08)}!important}._am_stat:hover{border-color:${A(.2)}!important}`,
      `#_am_body::-webkit-scrollbar-thumb{background:${A(.2)}!important}`,
      `a._am_hbtn.globe{color:${aS}!important}a._am_hbtn.globe:hover{color:${a2S}!important;background:${A(.15)}!important}`,
      `#_am_sv_head{border-bottom-color:${A(.08)}!important}`,
      `#_am_sv_back{border-color:${A(.2)}!important;background:${A(.06)}!important}#_am_sv_back:hover{background:${A(.15)}!important;color:${aS}!important}`,
      `#_am_sv_body::-webkit-scrollbar-thumb{background:${A(.2)}!important}`,
      `._am_acct_btn{border-color:${A(.25)}!important;background:${A(.1)}!important;color:${a2S}!important}._am_acct_btn:hover{background:${A(.2)}!important}`,
      `#_am_acct_signout{background:rgba(239,68,68,.1)!important;border-color:rgba(239,68,68,.25)!important;color:#ef4444!important}#_am_acct_signout:hover{background:rgba(239,68,68,.2)!important}`,
      `#_am_acct_welcome{color:${a2S}!important}`,
    ].join('\n');

    const sc = root.querySelector('#_am_color_swatches');
    if (sc) sc.querySelectorAll('._am_swatch').forEach(s => {
      const isActive = parseInt(s.dataset.h) === h;
      s.style.boxShadow = isActive ? `0 0 0 2px #1a1a2e, 0 0 0 4px ${aS}` : 'none';
      s.style.transform = isActive ? 'scale(1.2)' : 'scale(1)';
    });
    const hs = root.querySelector('#_am_home_swatches');
    if (hs) hs.querySelectorAll('._am_hswatch').forEach(s => {
      const isActive = parseInt(s.dataset.h) === h;
      s.style.boxShadow = isActive ? `0 0 0 2px #1a1a2e, 0 0 0 3px ${aS}` : 'none';
      s.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
    });
  }

  const _SWATCH_RB_STATIC = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="_amRbRG${sz}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="10%" stop-color="#ff0000"/><stop offset="25%" stop-color="#ff8000"/><stop offset="40%" stop-color="#ffff00"/><stop offset="55%" stop-color="#00ff00"/><stop offset="70%" stop-color="#00ffff"/><stop offset="85%" stop-color="#0000ff"/><stop offset="100%" stop-color="#ff00ff"/></radialGradient><filter id="_amRbGl${sz}"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="85" fill="url(#_amRbRG${sz})" filter="url(#_amRbGl${sz})"/></svg>`;
  const _SWATCH_RB_ACTIVE = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="_amRbAG${sz}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff0000"><animate attributeName="stop-color" values="#ff0000;#ff00ff;#ff0000" dur="4s" repeatCount="indefinite"/></stop><stop offset="16%" stop-color="#ff8000"><animate attributeName="stop-color" values="#ff8000;#ff0000;#ff8000" dur="4s" repeatCount="indefinite"/></stop><stop offset="33%" stop-color="#ffff00"><animate attributeName="stop-color" values="#ffff00;#ff8000;#ffff00" dur="4s" repeatCount="indefinite"/></stop><stop offset="50%" stop-color="#00ff00"><animate attributeName="stop-color" values="#00ff00;#ffff00;#00ff00" dur="4s" repeatCount="indefinite"/></stop><stop offset="66%" stop-color="#00ffff"><animate attributeName="stop-color" values="#00ffff;#00ff00;#00ffff" dur="4s" repeatCount="indefinite"/></stop><stop offset="83%" stop-color="#0000ff"><animate attributeName="stop-color" values="#0000ff;#00ffff;#0000ff" dur="4s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="#ff00ff"><animate attributeName="stop-color" values="#ff00ff;#0000ff;#ff00ff" dur="4s" repeatCount="indefinite"/></stop></linearGradient><filter id="_amRbAGl${sz}"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="85" fill="url(#_amRbAG${sz})" filter="url(#_amRbAGl${sz})"/></svg>`;
  const _SWATCH_CU_STATIC = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="_amCuSG${sz}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff0000"/><stop offset="16%" stop-color="#ff8000"/><stop offset="33%" stop-color="#ffff00"/><stop offset="50%" stop-color="#00ff00"/><stop offset="66%" stop-color="#00ffff"/><stop offset="83%" stop-color="#0000ff"/><stop offset="100%" stop-color="#ff00ff"/></linearGradient><filter id="_amCuSGl${sz}"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="75" fill="none" stroke="url(#_amCuSG${sz})" stroke-width="20" stroke-linecap="round" filter="url(#_amCuSGl${sz})"/></svg>`;
  const _SWATCH_CU_ACTIVE = (sz) => `<svg width="${sz}" height="${sz}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="_amCuAG${sz}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff0000"/><stop offset="16%" stop-color="#ff8000"/><stop offset="33%" stop-color="#ffff00"/><stop offset="50%" stop-color="#00ff00"/><stop offset="66%" stop-color="#00ffff"/><stop offset="83%" stop-color="#0000ff"/><stop offset="100%" stop-color="#ff00ff"/><animateTransform attributeName="gradientTransform" type="rotate" from="0 0.5 0.5" to="360 0.5 0.5" dur="4s" repeatCount="indefinite"/></linearGradient><filter id="_amCuAGl${sz}"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="75" fill="none" stroke="url(#_amCuAG${sz})" stroke-width="20" stroke-linecap="round" filter="url(#_amCuAGl${sz})"/></svg>`;

  function _updateSwatchSVGs(mode) {
    root.querySelectorAll('._am_swatch_rainbow,._am_hswatch_rainbow').forEach(el => {
      const sz = el.classList.contains('_am_hswatch_rainbow') ? 18 : 22;
      el.innerHTML = mode === 'rainbow' ? _SWATCH_RB_ACTIVE(sz) : _SWATCH_RB_STATIC(sz);
    });
    root.querySelectorAll('._am_swatch_custom,._am_hswatch_custom').forEach(el => {
      const sz = el.classList.contains('_am_hswatch_custom') ? 18 : 22;
      const inp = el.querySelector('input[type="color"]');

      Array.from(el.children).forEach(ch => { if (ch !== inp) ch.remove(); });
      const svgHTML = mode === 'custom' ? _SWATCH_CU_ACTIVE(sz) : _SWATCH_CU_STATIC(sz);
      el.insertAdjacentHTML('afterbegin', svgHTML);
    });
  }

  function _buildSwatches(container, isHome) {
    const cls = isHome ? '_am_hswatch' : '_am_swatch';
    const sz = isHome ? 18 : 22;
    const icSz = isHome ? 10 : 13;
    ACCENTS.forEach(({ h, name }) => {
      const sw = document.createElement('button');
      sw.title = name; sw.dataset.h = h; sw.className = cls;
      sw.style.cssText = `background:hsl(${h},68%,60%);width:${sz}px;height:${sz}px;border-radius:50%;`;
      sw.onclick = () => setAccent(h, name);
      container.appendChild(sw);
    });

    const rwSw = document.createElement('button');
    rwSw.title = 'Rainbow'; rwSw.dataset.special = 'rainbow'; rwSw.className = cls + ' ' + cls + '_rainbow';
    rwSw.style.cssText = `width:${sz}px;height:${sz}px;border-radius:50%;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0;border:none;background:transparent;cursor:pointer;transition:transform .15s,box-shadow .15s;`;
    rwSw.innerHTML = _SWATCH_RB_STATIC(sz);
    rwSw.onclick = () => setRainbow();
    container.appendChild(rwSw);

    const customSw = document.createElement('button');
    customSw.title = 'Custom color'; customSw.className = cls + ' ' + cls + '_custom';
    customSw.style.cssText = `width:${sz}px;height:${sz}px;border-radius:50%;position:relative;overflow:hidden;padding:0;border:none;background:transparent;cursor:pointer;transition:transform .15s,box-shadow .15s;display:flex;align-items:center;justify-content:center;`;
    const savedHex = ('_am_s_custom_hex' in _settingsCache) ? _settingsCache['_am_s_custom_hex'] : localStorage.getItem('_am_s_custom_hex');
    customSw.innerHTML = _SWATCH_CU_STATIC(sz);
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = savedHex || '#7c3aed';
    colorInput.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0;z-index:1;';
    colorInput.oninput = () => {
      const hex = colorInput.value;
      const rr = parseInt(hex.slice(1,3),16), gg = parseInt(hex.slice(3,5),16), bb = parseInt(hex.slice(5,7),16);
      const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
      let hh = 0; if (mx !== mn) { if (mx === rr) hh = ((gg - bb) / (mx - mn)) % 6; else if (mx === gg) hh = (bb - rr) / (mx - mn) + 2; else hh = (rr - gg) / (mx - mn) + 4; }
      hh = Math.round(hh * 60 + 360) % 360;
      _rbStop();
      _customColorActive = true;
      _updateSwatchSVGs('custom');
      setAccent(hh, null);
    };
    colorInput.onchange = () => {
      saveSetting('_am_s_custom_hex', colorInput.value);
      saveSetting('_am_s_color', 'custom:' + colorInput.value);
      _amToast('Custom color applied', 'info');
    };
    customSw.appendChild(colorInput);
    container.appendChild(customSw);
  }

  const swatchContainer = root.querySelector('#_am_color_swatches');
  _buildSwatches(swatchContainer, false);
  const homeSwatchContainer = root.querySelector('#_am_home_swatches');
  _buildSwatches(homeSwatchContainer, true);

  const homeAutoToggle = root.querySelector('#_am_home_auto');
  homeAutoToggle.classList.toggle('on', autoAnswer);
  homeAutoToggle.onclick = () => { autoAnswer = !autoAnswer; homeAutoToggle.classList.toggle('on', autoAnswer); toggleAuto.classList.toggle('on', autoAnswer); saveSetting(S_KEYS.auto, autoAnswer ? '1' : '0'); };

  const origAutoClick = toggleAuto.onclick;
  toggleAuto.onclick = () => { autoAnswer = !autoAnswer; toggleAuto.classList.toggle('on', autoAnswer); homeAutoToggle.classList.toggle('on', autoAnswer); saveSetting(S_KEYS.auto, autoAnswer ? '1' : '0'); };
  const _savedColor = ('_am_s_color' in _settingsCache) ? _settingsCache['_am_s_color'] : (localStorage.getItem('_am_s_color') || '220');
  if (_savedColor === 'rainbow') { setRainbow(true); }
  else if (_savedColor.startsWith && _savedColor.startsWith('custom:')) {
    const hex = _savedColor.slice(7);
    const rr = parseInt(hex.slice(1,3),16), gg = parseInt(hex.slice(3,5),16), bb = parseInt(hex.slice(5,7),16);
    const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
    let hh = 0; if (mx !== mn) { if (mx === rr) hh = ((gg - bb) / (mx - mn)) % 6; else if (mx === gg) hh = (bb - rr) / (mx - mn) + 2; else hh = (rr - gg) / (mx - mn) + 4; }
    hh = Math.round(hh * 60 + 360) % 360;
    _customColorActive = true; _updateSwatchSVGs('custom'); setAccent(hh, null); _customColorActive = true;
  }
  else if (_savedColor === 'glass') { setAccent(220, null); }
  else { setAccent(parseInt(_savedColor) || 220); }

  const settingsView = root.querySelector('#_am_settings_view');
  root.querySelector('#_am_settings_btn').onclick = (e) => { e.stopPropagation(); if (overlay.classList.contains('compact')) { overlay.classList.remove('compact'); panel.style.bottom = ''; panel.style.right = ''; panel.style.left = ''; panel.style.top = ''; panel.style.width = ''; panel.style.maxHeight = ''; paused = true; pauseBtn.innerHTML = IC.play+' Resume'; } settingsView.classList.toggle('open'); };
  root.querySelector('#_am_sv_back').onclick = () => settingsView.classList.remove('open');

  window._amWasHiddenByBlur = false;
  document.addEventListener('visibilitychange', () => {
    if (!window._amouraRunning) return;
    if (document.hidden) {
      if (stealthDisappear) { root.style.display = 'none'; window._amWasHiddenByBlur = true; }
      else if (stealthMinBlur) { doMinimize(); }
    } else {
      if (window._amWasHiddenByBlur && stealthDisappear) {

      } else {
        root.style.display = '';
      }
    }
  });
  window.addEventListener('focus', () => {
    if (window._amWasHiddenByBlur && stealthDisappear && window._amouraRunning) {

    }
  });

  function doMinimize() {
    const pRect = panel.getBoundingClientRect();
    const mCX = window.innerWidth - 20 - 24;
    const mCY = window.innerHeight - 20 - 24;
    const pCX = pRect.left + pRect.width / 2;
    const pCY = pRect.top + pRect.height / 2;
    const dx = mCX - pCX;
    const dy = mCY - pCY;
    const s = 48 / Math.max(pRect.width, pRect.height);
    Array.from(panel.children).forEach(el => { el.style.transition = 'opacity .18s'; el.style.opacity = '0'; });
    panel.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), border-radius .4s cubic-bezier(.16,1,.3,1)';
    panel.style.transformOrigin = 'center center';
    requestAnimationFrame(() => {
      panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
      panel.style.borderRadius = '50%';
    });
    setTimeout(() => {
      overlay.style.display = 'none';
      mini.style.display = 'flex';
      mini.style.opacity = '1'; mini.style.transform = 'scale(1)';
      panel.style.transform = ''; panel.style.borderRadius = ''; panel.style.transition = ''; panel.style.transformOrigin = '';
      Array.from(panel.children).forEach(el => { el.style.transition = ''; el.style.opacity = ''; });
    }, 420);
  }
  function doMaximize() {
    overlay.style.display = 'flex';
    overlay.style.visibility = 'hidden';
    panel.style.transition = 'none';
    requestAnimationFrame(() => {
      const pRect = panel.getBoundingClientRect();
      const mCX = window.innerWidth - 20 - 24;
      const mCY = window.innerHeight - 20 - 24;
      const pCX = pRect.left + pRect.width / 2;
      const pCY = pRect.top + pRect.height / 2;
      const dx = mCX - pCX;
      const dy = mCY - pCY;
      const s = 48 / Math.max(pRect.width, pRect.height);
      panel.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
      panel.style.borderRadius = '50%';
      panel.style.transformOrigin = 'center center';
      Array.from(panel.children).forEach(el => { el.style.opacity = '0'; });
      overlay.style.visibility = '';
      mini.style.display = 'none';
      requestAnimationFrame(() => {
        panel.style.transition = 'transform .4s cubic-bezier(.16,1,.3,1), border-radius .4s cubic-bezier(.16,1,.3,1)';
        panel.style.transform = 'translate(0,0) scale(1)';
        panel.style.borderRadius = '';
        setTimeout(() => {
          Array.from(panel.children).forEach(el => { el.style.transition = 'opacity .2s'; el.style.opacity = ''; });
        }, 150);
      });
      setTimeout(() => {
        panel.style.transition = ''; panel.style.transform = ''; panel.style.borderRadius = ''; panel.style.transformOrigin = '';
        Array.from(panel.children).forEach(el => { el.style.transition = ''; el.style.opacity = ''; });
      }, 450);
    });
  }
  function stopAll() {
    window._amouraRunning = false;
    clearInterval(_reattach);
    _reattachObs.disconnect();
    try { localStorage.removeItem('_am_persist_v2'); localStorage.removeItem('_am_solver_cache_v2'); } catch(e) {}
    _secFetch(PROXY_URL + '/session/end', { method: 'POST', headers: _authHeaders(), body: JSON.stringify({}) }).catch(() => {});
    root.remove();
  }
  window.addEventListener('beforeunload', () => {
    try { if (localStorage.getItem('_am_persist_v2') === '1') return; } catch(e) {}
    _secFetch(PROXY_URL + '/session/end', { method: 'POST', headers: _authHeaders(), body: JSON.stringify({}), keepalive: true }).catch(() => {});
  }, { once: true });
  const quitModal = root.querySelector('#_am_quit_modal');
  let quitConfirm = loadBool(S_KEYS.quitconfirm, true);
  const toggleQuitConfirm = root.querySelector('#_am_toggle_quitconfirm');
  toggleQuitConfirm.classList.toggle('on', quitConfirm);
  toggleQuitConfirm.onclick = () => { quitConfirm = !quitConfirm; toggleQuitConfirm.classList.toggle('on', quitConfirm); saveSetting(S_KEYS.quitconfirm, quitConfirm ? '1' : '0'); };
  function askQuit() { if (quitConfirm) { quitModal.style.display = 'flex'; } else { stopAll(); } }
  root.querySelector('#_am_close').onclick = askQuit;
  root.querySelector('#_am_stop_btn').onclick = askQuit;
  root.querySelector('#_am_quit_yes').onclick = stopAll;
  root.querySelector('#_am_quit_no').onclick = () => { quitModal.style.display = 'none'; };
  root.querySelector('#_am_min_btn').onclick = doMinimize;
  mini.onclick = doMaximize;

  const acctLoggedOut = root.querySelector('#_am_acct_loggedout');
  const acctLoggedIn = root.querySelector('#_am_acct_loggedin');
  const acctWelcome = root.querySelector('#_am_acct_welcome');
  const acctErr = root.querySelector('#_am_acct_err');
  const acctUserInput = root.querySelector('#_am_acct_user');
  const acctPassInput = root.querySelector('#_am_acct_pass');

  function showAccountLoggedIn(name) {
    acctLoggedOut.style.display = 'none';
    acctLoggedIn.style.display = 'flex';
    acctWelcome.textContent = 'Welcome, ' + name + '!';
    p.userBadge.innerHTML = '<span style="font-size:11px">' + IC.user + ' ' + _esc(name) + '</span>';
    const guestBanner = root.querySelector('#_am_guest_banner');
    if (guestBanner) guestBanner.style.display = 'none';
  }
  function showAccountLoggedOut() {
    acctLoggedOut.style.display = 'flex';
    acctLoggedIn.style.display = 'none';
    p.userBadge.innerHTML = '';
    const guestBanner = root.querySelector('#_am_guest_banner');
    if (guestBanner) { guestBanner.style.display = 'flex'; guestBanner.innerHTML = '<span>Sign in to sync settings</span><button id="_am_guest_signin">Sign In</button>'; }
    const guestBtn = root.querySelector('#_am_guest_signin');
    if (guestBtn) guestBtn.onclick = () => { settingsView.classList.add('open'); };
  }

  function refreshUIFromSettings() {
    autoAnswer = loadBool(S_KEYS.auto, true);
    toggleAuto.classList.toggle('on', autoAnswer);
    homeAutoToggle.classList.toggle('on', autoAnswer);
    autoNext = loadBool(S_KEYS.autonext, true);
    toggleAutoNext.classList.toggle('on', autoNext);
    autoGotIt = loadBool(S_KEYS.gotit, true);
    toggleGotIt.classList.toggle('on', autoGotIt);
    thinkingEnabled = loadBool(S_KEYS.thinking, true);
    thinkingBudget = loadInt(S_KEYS.budget, 4096);
    toggleThinking.classList.toggle('on', thinkingEnabled);
    thinkingSlider.value = thinkingBudget; thinkingValEl.textContent = thinkingEnabled ? thinkingBudget : 'OFF';
    thinkingSlider.disabled = !thinkingEnabled;
    const newDelay = loadInt(S_KEYS.delay, 800);
    DELAY_MIN = newDelay; DELAY_MAX = Math.max(newDelay, newDelay + 600);
    delaySlider.value = newDelay; delayValEl.textContent = (newDelay / 1000).toFixed(1) + 's';
    stealthDisappear = loadBool(S_KEYS.disappear, false);
    stealthMinBlur = loadBool(S_KEYS.minblur, false);
    toggleDisappear.classList.toggle('on', stealthDisappear);
    toggleMinBlur.classList.toggle('on', stealthMinBlur);
    advancedMode = loadBool(S_KEYS.advanced, false);
    toggleAdv.classList.toggle('on', advancedMode);
    applyAdvancedMode();
    quitConfirm = loadBool(S_KEYS.quitconfirm, true);
    toggleQuitConfirm.classList.toggle('on', quitConfirm);
    answerWhileMin = loadBool(S_KEYS.answermin, true);
    toggleAnswerMin.classList.toggle('on', answerWhileMin);
    betaObserver = loadBool(S_KEYS.betaobs, true);
    toggleBetaObs.classList.toggle('on', betaObserver);
    persistEnabled = loadBool(S_KEYS.persist, false);
    togglePersist.classList.toggle('on', persistEnabled);
    if (persistEnabled) { try { localStorage.setItem('_am_persist_v2', '1'); } catch(e) {} }
    else { try { localStorage.removeItem('_am_persist_v2'); localStorage.removeItem('_am_solver_cache_v2'); } catch(e) {} }
    autoStart = loadBool(S_KEYS.autostart, false);
    toggleAutoStart.classList.toggle('on', autoStart);
    screenshotEnabled = loadBool(S_KEYS.screenshot, true);
    toggleScreenshot.classList.toggle('on', screenshotEnabled);
    stopAt100 = loadBool(S_KEYS.stopat100, true);
    toggleStopAt100.classList.toggle('on', stopAt100);
    const _ncRaw = ('_am_s_color' in _settingsCache) ? _settingsCache['_am_s_color'] : (localStorage.getItem('_am_s_color') || '220');
    if (_ncRaw === 'rainbow') { if (!_rbActive) setRainbow(true); }
    else if (_ncRaw.startsWith && _ncRaw.startsWith('custom:')) {
      const hex = _ncRaw.slice(7);
      const rr = parseInt(hex.slice(1,3),16), gg = parseInt(hex.slice(3,5),16), bb = parseInt(hex.slice(5,7),16);
      const mx = Math.max(rr,gg,bb), mn = Math.min(rr,gg,bb);
      let hh = 0; if (mx !== mn) { if (mx === rr) hh = ((gg - bb) / (mx - mn)) % 6; else if (mx === gg) hh = (bb - rr) / (mx - mn) + 2; else hh = (rr - gg) / (mx - mn) + 4; }
      hh = Math.round(hh * 60 + 360) % 360;
      _customColorActive = true; _updateSwatchSVGs('custom'); setAccent(hh, null); _customColorActive = true;
    }
    else { setAccent(parseInt(_ncRaw) || 220); }
    modelMode = _settingsCache[S_KEYS.modelMode] || localStorage.getItem(S_KEYS.modelMode) || 'auto';
    updateModelSeg();
    updatePerfWarn();
  }

  async function doAccountAction(isSignUp) {
    const user = acctUserInput.value.trim();
    const pass = acctPassInput.value;
    acctErr.textContent = '';
    if (!user || !pass) { acctErr.textContent = 'Enter username and password'; return; }
    if (pass.length < 6) { acctErr.textContent = 'Password must be at least 6 characters'; return; }
    const btns = root.querySelectorAll('._am_acct_btn');
    btns.forEach(b => b.disabled = true);
    try {
      if (isSignUp) {
        await _authSignUp(user, pass);
        await _syncSettingsToCloud();
      } else {
        await _authSignIn(user, pass);
        const loaded = await _loadSettingsFromCloud();
        if (loaded) refreshUIFromSettings();
      }
      showAccountLoggedIn(_authUser);
    } catch(e) {
      acctErr.textContent = e.message || 'Something went wrong';
    }
    btns.forEach(b => b.disabled = false);
  }

  root.querySelector('#_am_acct_signin').onclick = () => doAccountAction(false);
  root.querySelector('#_am_acct_signup').onclick = () => doAccountAction(true);
  root.querySelector('#_am_acct_signout').onclick = async () => {
    _authToken = null; _authRefresh = null; _authUid = null; _authUser = null; _authExpiry = 0;
    try { localStorage.removeItem('_amoura_rt'); localStorage.removeItem('_amoura_user'); localStorage.removeItem('_amoura_uid'); } catch(e) {}
    showAccountLoggedOut();

    await _authAnonymousLogin();
    await _initServerSession();
  };

  _tryAutoLogin().then(ok => {
    if (ok && _authUser && !_authAnonymous) {
      _loadSettingsFromCloud().then(loaded => { if (loaded) refreshUIFromSettings(); });
      showAccountLoggedIn(_authUser);
    } else {
      showAccountLoggedOut();
    }
  });

  function makeDraggable(handle, target) {
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    function gp(e) { return e.touches && e.touches.length ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }
    function onStart(e) {
      if (!overlay.classList.contains('compact')) return;
      const src = e.target;
      if (src.closest('button,input,select,textarea,a,#_am_rc_nw,._am_toggle,[type="range"]')) return;
      e.preventDefault();
      dragging = true;
      const p = gp(e), r = target.getBoundingClientRect();
      sx = p.x; sy = p.y; ox = r.left; oy = r.top;
      handle.style.cursor = 'grabbing';
      target.style.transition = 'none';
      document.addEventListener('mousemove', onMove, { passive: false });
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
      document.addEventListener('touchcancel', onEnd);
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      const p = gp(e), vw = window.innerWidth, vh = window.innerHeight;
      const w = target.offsetWidth, h = target.offsetHeight;
      const nl = Math.max(0, Math.min(vw - w, ox + p.x - sx));
      const nt = Math.max(0, Math.min(vh - h, oy + p.y - sy));
      target.style.bottom = (vh - nt - h) + 'px';
      target.style.right = (vw - nl - w) + 'px';
      target.style.left = 'auto'; target.style.top = 'auto';
    }
    function onEnd() {
      dragging = false;
      handle.style.cursor = '';
      target.style.transition = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('touchcancel', onEnd);
    }
    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
  }
  makeDraggable(root.querySelector('#_am_header'), panel);

  (function() {
    const el = root.querySelector('#_am_rc_nw');
    let active = false, sx = 0, sy = 0, sw = 0, sh = 0, sr = 0, sb = 0;
    function gp(e) { return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }
    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start, { passive: false });
    function start(e) {
      e.preventDefault(); e.stopPropagation();
      active = true;
      const p = gp(e), r = panel.getBoundingClientRect();
      sx = p.x; sy = p.y; sw = r.width; sh = r.height;
      sr = window.innerWidth - r.right; sb = window.innerHeight - r.bottom;
      panel.style.transition = 'none';
      document.addEventListener('mousemove', move, { passive: false });
      document.addEventListener('mouseup', end);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end);
    }
    function move(e) {
      if (!active) return;
      e.preventDefault();
      const p = gp(e), dx = p.x - sx, dy = p.y - sy;
      const vw = window.innerWidth, vh = window.innerHeight;
      let w = sw - dx, h = sh - dy;
      w = Math.max(240, Math.min(vw * 0.8, w));
      h = Math.max(200, Math.min(vh * 0.95, h));
      panel.style.width = w + 'px'; panel.style.maxHeight = h + 'px';
      panel.style.right = sr + 'px'; panel.style.bottom = sb + 'px';
      panel.style.left = 'auto'; panel.style.top = 'auto';
    }
    function end() {
      active = false;
      panel.style.transition = '';
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    }
  })();
  root.querySelector('#_am_expand_btn').onclick = () => { overlay.classList.remove('compact'); panel.style.bottom = ''; panel.style.right = ''; panel.style.left = ''; panel.style.top = ''; panel.style.width = ''; panel.style.maxHeight = ''; paused = true; pauseBtn.innerHTML = IC.play+' Resume'; };

  let paused = true;
  let _solveAbort = null;
  const pauseBtn = root.querySelector('#_am_pause_btn');

  pauseBtn.innerHTML = IC.play+' Start';
  function togglePause() {
    paused = !paused;
    if (!paused) {
      overlay.classList.add('compact');
      overlay.style.display = 'flex';
    } else {
      overlay.classList.remove('compact');
      panel.style.bottom = ''; panel.style.right = ''; panel.style.left = ''; panel.style.top = ''; panel.style.width = ''; panel.style.maxHeight = '';
      if (_solveAbort) { try { _solveAbort.abort(); } catch(e) {} _solveAbort = null; }
      try { p.status.innerHTML = '<span style="color:#60a5fa">'+IC.pause+' Paused</span>'; } catch(e) {}
    }
    pauseBtn.innerHTML = paused ? IC.play+' Resume' : IC.pause+' Pause';
  }
  pauseBtn.onclick = togglePause;

  const authSection = root.querySelector('#_am_auth');
  const footerEl = root.querySelector('#_am_footer');
  const mainEls = [root.querySelector('#_am_stats'), root.querySelector('#_am_current'), root.querySelector('#_am_home_controls'), root.querySelector('#_am_complete'), root.querySelector('#_am_history')];

  function showAuthUI() { showMainUI(); }
  function showMainUI() {
    if (authSection) authSection.style.display = 'none';
    mainEls.forEach(el => { if (el) el.style.display = ''; });
    applyAdvancedMode();
    footerEl.style.display = '';
    panel.classList.remove('auth-mode');
    overlay.style.display = 'flex';
    mini.style.display = 'none';
  }

  return { panel: p, isPaused: () => paused, isAutoAnswer: () => autoAnswer, isAutoNext: () => autoNext, isAutoGotIt: () => autoGotIt, isAutoSkip: () => autoSkip, minimize: doMinimize, maximize: doMaximize, showAuthUI, showMainUI, getThinkingEnabled: () => thinkingEnabled, getThinkingBudget: () => thinkingBudget, isAnswerWhileMin: () => answerWhileMin, isMinimized: () => mini.style.display === 'flex', getModelMode: () => modelMode, isBetaObs: () => betaObserver, isPersist: () => persistEnabled, isAutoStart: () => autoStart, isScreenshot: () => screenshotEnabled, isStopAt100: () => stopAt100, triggerStart: togglePause, newSolveAbort: () => { _solveAbort = new AbortController(); return _solveAbort.signal; } };
}

const { panel, isPaused, isAutoAnswer, isAutoNext, isAutoGotIt, isAutoSkip, minimize, showAuthUI, showMainUI, getThinkingEnabled, getThinkingBudget, isAnswerWhileMin, isMinimized, getModelMode, isBetaObs, isPersist, isAutoStart, isScreenshot, isStopAt100, triggerStart, newSolveAbort } = buildUI();

(function _setupPersistence() {
  function _injectOnNewPage() {
    if (!isPersist()) return;
    try {
      if (window._amouraRunning || window._amouraInjecting) return;
      window._amouraInjecting = true;
      var _srv = window._solverServer || 'https://ixll-2bc78.web.app';
      var fr = document.createElement('iframe');
      fr.src = '/dv3/' + Math.random().toString(36).slice(2);
      fr.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none';
      fr.onerror = function() { window._amouraInjecting = false; console.log('[amoura] persist iframe error'); };
      fr.onload = async function() {
        try {
          var _iframeFetch = fr.contentWindow.fetch.bind(fr.contentWindow);
          window.fetch = _iframeFetch;
          window._bypassFetch = _iframeFetch;
          try { _cloak(_iframeFetch, 'fetch'); } catch(e) {}
          window._amouraAutoStart = true;
          var code = await (await _iframeFetch(_srv + '/solver.js?' + Date.now())).text();
          (0, eval)(code);
        } catch(e) {
          console.log('[amoura] persist re-inject error:', e);
          window._amouraInjecting = false;
        }
      };
      document.documentElement.appendChild(fr);
    } catch(e) { console.log('[amoura] _injectOnNewPage error:', e); window._amouraInjecting = false; }
  }

  var _lastUrl = window.location.href;
  function _onUrlChange() {
    try {
      var newUrl = window.location.href;
      if (newUrl === _lastUrl) return;
      _lastUrl = newUrl;
      if (!window._amouraRunning) {
        if (isPersist()) setTimeout(_injectOnNewPage, 400);
        return;
      }
      try { updatePageInfo(); } catch(e) {}
      window._amResetFP = true;
    } catch(e) { console.log('[amoura] _onUrlChange error:', e); }
  }

  try {
    var _origPush = history.pushState;
    var _origReplace = history.replaceState;
    history.pushState = function() { _origPush.apply(this, arguments); setTimeout(_onUrlChange, 100); };
    history.replaceState = function() { _origReplace.apply(this, arguments); setTimeout(_onUrlChange, 100); };
    window.addEventListener('popstate', _onUrlChange);
    setInterval(_onUrlChange, 800);

    if (typeof navigation !== 'undefined' && navigation.addEventListener) {
      navigation.addEventListener('navigate', function(event) {
        if (event.hashChange || event.downloadRequest) return;
        setTimeout(_onUrlChange, 300);
      });
      console.log('[amoura] persistence: Navigation API + SPA monitoring active (persist=' + isPersist() + ')');
    } else {
      console.log('[amoura] persistence: SPA monitoring active (persist=' + isPersist() + ')');
    }
  } catch(e) { console.log('[amoura] persistence setup error:', e); }
})();

function setStatus(html) { panel.status.innerHTML = html; }
function _toLatex(raw) {
  let s = raw.trim();

  
  if (/^-?\d+(\.\d+)?$/.test(s) || /^[a-zA-Z]{1,20}$/.test(s)) return s;

  
  s = s.replace(/(sin|cos|tan|sec|csc|cot)\^?\(?-1\)?\s*\(/gi, function(m, fn) {
    return '\\' + fn.toLowerCase() + '^{-1}(';
  });
  s = s.replace(/\barc(sin|cos|tan|sec|csc|cot)\s*\(/gi, function(m, fn) {
    return '\\' + fn.toLowerCase() + '^{-1}(';
  });

  
  s = s.replace(/\b(sin|cos|tan|sec|csc|cot|ln|log)\s*(?=[\({])/gi, function(m, fn) {
    return '\\' + fn.toLowerCase();
  });
  
  s = s.replace(/\b(ln|log)\s+(\d+)/gi, function(m, fn, num) {
    return '\\' + fn.toLowerCase() + ' ' + num;
  });

  
  s = s.replace(/sqrt\(([^)]+)\)/gi, '\\sqrt{$1}');
  s = s.replace(/cbrt\(([^)]+)\)/gi, '\\sqrt[3]{$1}');

  
  function matchParen(str, start) {
    if (str[start] !== '(') return null;
    let depth = 0;
    for (let i = start; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') { depth--; if (depth === 0) return str.slice(start + 1, i); }
    }
    return null;
  }
  let _maxFrac = 10;
  while (_maxFrac-- > 0) {
    const fm = s.match(/\(([^()]+)\)\/\(/);
    if (!fm) break;
    const idx = s.indexOf(fm[0]);
    const num = fm[1];
    const denomStart = idx + fm[0].length - 1;
    const den = matchParen(s, denomStart);
    if (den === null) break;
    s = s.slice(0, idx) + '\\frac{' + num + '}{' + den + '}' + s.slice(denomStart + den.length + 2);
  }

  
  s = s.replace(/(?<![\\{])(\d+)\/(\d+)(?![}])/g, '\\frac{$1}{$2}');

  
  s = s.replace(/\^\(([^)]+)\)/g, '^{$1}');
  s = s.replace(/\^(-?\d+)/g, '^{$1}');
  
  s = s.replace(/\^([a-zA-Z])(?!\w)/g, '^{$1}');

  
  s = s.replace(/abs\(([^)]*(?:\([^)]*\))*[^)]*)\)/gi, function(m, inner) {
    return '\\left|' + inner + '\\right|';
  });
  
  s = s.replace(/\|([^|]+)\|/g, '\\left|$1\\right|');

  
  s = s.replace(/\bpi\b/gi, '\\pi');
  s = s.replace(/\binfinity\b/gi, '\\infty');

  
  s = s.replace(/\be\^/g, 'e^');

  
  s = s.replace(/\+\s*C\s*$/g, '+ C');

  
  s = s.replace(/\*/g, '\\cdot ');

  
  let _parenOut = '', _parenDepth = 0, _parenStarts = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(' && s.slice(Math.max(0,i-5),i).indexOf('\\left') === -1) { _parenDepth++; _parenStarts.push(_parenOut.length); _parenOut += '\\left('; }
    else if (s[i] === ')' && _parenDepth > 0 && s.slice(Math.max(0,i-6),i).indexOf('\\right') === -1) { _parenDepth--; _parenStarts.pop(); _parenOut += '\\right)'; }
    else _parenOut += s[i];
  }
  s = _parenOut;

  return s;
}
function _fmtMath(raw, display) {
  var _isPlainText = !/[\\^_{}]/.test(raw) && !/\d\s*[\/\*]\s*\d/.test(raw) && !/sqrt|frac|pi\b|infty/i.test(raw) && /[a-zA-Z]{2,}.*\s+[a-zA-Z]{2,}/.test(raw);
  if (_isPlainText) return _esc(raw).replace(/\n/g, '<br>');
  if (typeof katex !== 'undefined') {
    try {
      var tex = /\\frac|\\sqrt|\\left|\\right|\\pi|\\cdot|\\infty|\^{/.test(raw) ? raw : _toLatex(raw);
      return katex.renderToString(tex, { throwOnError: false, displayMode: !!display, output: 'html' });
    } catch(e) {  }
  }
  return _esc(raw).replace(/\n/g, '<br>');
}
function setAnswer(text) { _am_last_answer_raw = text || null; panel.curAnswer.innerHTML = text ? '<div class="_am_answer_box">'+_fmtMath(text, true)+'</div>' : ''; }
function showLoading(msg) { setStatus('<span class="_am_wave"><span></span><span></span><span></span><span></span><span></span></span><span class="_am_loader_text">'+_esc(msg)+'</span>'); }

function _amToast(message, type, fmtAnswer) {
  type = type || 'info';
  const _r = document.getElementById('_amoura_root');
  if (!_r) return;
  let c = _r.querySelector('#_am_toasts');
  if (!c) { c = document.createElement('div'); c.id = '_am_toasts'; _r.appendChild(c); }

  const existing = c.querySelectorAll('._am_toast_text');
  for (let i = 0; i < existing.length; i++) { if (existing[i].textContent === message) return; }

  const all = c.querySelectorAll('._am_toast');
  if (all.length >= 4) { all[0].remove(); }
  const icons = { success: '<svg width="1em" height="1em" viewBox="0 0 11 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4.5 4 7.5 10 1"/></svg>', info: '<svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="6" cy="6" r="5"/><line x1="6" y1="5.5" x2="6" y2="8.5"/><circle cx="6" cy="3.8" r="0.6" fill="currentColor" stroke="none"/></svg>', warn: '<svg width="1em" height="1em" viewBox="0 0 13 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1L12 11H1z"/><line x1="6.5" y1="5" x2="6.5" y2="7.5"/><circle cx="6.5" cy="9.5" r="0.6" fill="currentColor" stroke="none"/></svg>', error: '<svg width="1em" height="1em" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></svg>' };
  const t = document.createElement('div');
  t.className = '_am_toast';

  let displayMsg;
  if (fmtAnswer && message.startsWith('Solved #')) {
    const colonIdx = message.indexOf(': ');
    if (colonIdx !== -1) {
      const prefix = _esc(message.substring(0, colonIdx + 2));
      const answerPart = message.substring(colonIdx + 2);
      displayMsg = prefix + _fmtMath(answerPart);
    } else { displayMsg = _esc(message); }
  } else { displayMsg = _esc(message); }
  t.innerHTML = '<div class="_am_toast_icon '+type+'">'+(icons[type]||icons.info)+'</div><div class="_am_toast_text">'+displayMsg+'</div>';
  c.appendChild(t);
  setTimeout(function() { t.classList.add('out'); setTimeout(function() { t.remove(); }, 350); }, 3500);
}

function _amSpawnParticles() {
  const _r = document.getElementById('_amoura_root');
  const container = _r && _r.querySelector('#_am_particles');
  if (!container) return;
  let hue = 220;
  try { const v = localStorage.getItem('_am_s_color'); if (v) hue = parseInt(v) || 220; } catch(e) {}
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = '_am_particle';
    const size = 3 + Math.random() * 4;
    p.style.cssText = 'left:' + (5 + Math.random() * 90) + '%;width:' + size + 'px;height:' + size + 'px;background:hsla(' + hue + ',70%,65%,.45);animation-duration:' + (2 + Math.random() * 2) + 's;animation-delay:' + (Math.random() * 1.2) + 's';
    container.appendChild(p);
    setTimeout(function() { p.remove(); }, 5000);
  }
}
setInterval(_amSpawnParticles, 3500);
setTimeout(_amSpawnParticles, 600);

function addHistory(num, answer, type, ok) {
  const item = document.createElement('div');
  item.className = '_am_hist_item';
  item.innerHTML = '<div class="_am_hist_num '+(ok?'ok':'fail')+'">'+num+'</div><div class="_am_hist_text">'+_fmtMath(answer)+'</div><div class="_am_hist_type">'+_esc(type)+'</div>';
  panel.histList.insertBefore(item, panel.histList.firstChild);
}

function updatePageInfo() {
  const lesson = getLessonName();
  panel.subtitle.innerHTML = '<span style="color:#999">'+_esc(lesson)+'</span>';
  panel.score.textContent = getSmartScore();
  const ixlQ = getQuestionsAnswered();
  panel.ixlq.textContent = ixlQ;
  panel.count.textContent = ixlQ;
}

const startTime = Date.now();
const timerInterval = setInterval(() => {
  if (!window._amouraRunning) { clearInterval(timerInterval); return; }
  const s = Math.floor((Date.now()-startTime)/1000);
  panel.timer.textContent = Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
}, 1000);

setTimeout(function() {
  const lesson = getLessonName();
  if (lesson && lesson !== 'Unknown Lesson') {
    _amToast('Loaded: ' + lesson.substring(0,50), 'success');
  } else {
    _amToast('AMOURA ready — navigate to a lesson', 'info');
  }
}, 800);

async function loadHtml2Canvas() {
  if (window.html2canvas) return;
  try {
    const res = await _fetch('https://html2canvas.hertzen.com/dist/html2canvas.min.js');
    if (!res.ok) throw new Error('Failed to load html2canvas: ' + res.status);
    const code = await res.text();
    (0, eval)(code);
  } catch(e) { console.warn('[amoura] html2canvas load error:', e.message); }
}

async function elementToBase64(el, labelScope) {
  const isSvg = el.tagName && /^svg(:svg)?$/i.test(el.tagName);
  const svg = isSvg ? el : (el.querySelector('svg') || [...el.querySelectorAll('*')].find(e => /^svg(:svg)?$/i.test(e.tagName)));
  if (svg) {
    try {
      const bb = svg.getBoundingClientRect();
      const w = Math.ceil(bb.width) || parseInt(svg.getAttribute('width')) || 300;
      const h = Math.ceil(bb.height) || parseInt(svg.getAttribute('height')) || 300;

      const vb = svg.getAttribute('viewBox') || ('0 0 ' + w + ' ' + h);
      let shapes = '';
      const _xmlEsc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const shapeEls = [...svg.querySelectorAll('*')].filter(e => /^(svg:)?(path|line|circle|ellipse|polygon|polyline|rect|text|tspan|use|g|image)$/i.test(e.tagName));
      for (const p of shapeEls) {
        const tag = p.tagName.replace(/^svg:/i, '').toLowerCase();
        const cs = getComputedStyle(p);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const stroke = p.getAttribute('stroke') || cs.stroke || 'none';
        const fill = p.getAttribute('fill') || cs.fill || 'none';
        const sw = p.getAttribute('stroke-width') || cs.strokeWidth || '2';
        if (tag === 'path') {
          const d = p.getAttribute('d');
          if (!d || d.trim().length < 5) continue;
          const sd = p.getAttribute('stroke-dasharray') || 'none';
          shapes += '<path d="' + d + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"' + (sd !== 'none' ? ' stroke-dasharray="' + sd + '"' : '') + ' stroke-linejoin="round" stroke-linecap="butt"/>';
        } else if (tag === 'line') {
          shapes += '<line x1="' + (p.getAttribute('x1')||0) + '" y1="' + (p.getAttribute('y1')||0) + '" x2="' + (p.getAttribute('x2')||0) + '" y2="' + (p.getAttribute('y2')||0) + '" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'circle') {
          shapes += '<circle cx="' + (p.getAttribute('cx')||0) + '" cy="' + (p.getAttribute('cy')||0) + '" r="' + (p.getAttribute('r')||0) + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'ellipse') {
          shapes += '<ellipse cx="' + (p.getAttribute('cx')||0) + '" cy="' + (p.getAttribute('cy')||0) + '" rx="' + (p.getAttribute('rx')||0) + '" ry="' + (p.getAttribute('ry')||0) + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'polygon') {
          const pts = p.getAttribute('points') || '';
          if (pts) shapes += '<polygon points="' + pts + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'polyline') {
          const pts = p.getAttribute('points') || '';
          if (pts) shapes += '<polyline points="' + pts + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'rect') {
          shapes += '<rect x="' + (p.getAttribute('x')||0) + '" y="' + (p.getAttribute('y')||0) + '" width="' + (p.getAttribute('width')||0) + '" height="' + (p.getAttribute('height')||0) + '" stroke="' + stroke + '" fill="' + fill + '" stroke-width="' + sw + '"/>';
        } else if (tag === 'text') {
          const x = p.getAttribute('x') || 0, y = p.getAttribute('y') || 0;
          const fs = p.getAttribute('font-size') || cs.fontSize || '14';
          const anchor = p.getAttribute('text-anchor') || '';
          shapes += '<text x="' + x + '" y="' + y + '" font-size="' + fs + '" fill="' + fill + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + _xmlEsc(p.textContent) + '</text>';
        } else if (tag === 'tspan') {

        } else if (tag === 'use') {
          const href = p.getAttribute('href') || p.getAttribute('xlink:href') || '';
          const ux = p.getAttribute('x') || 0, uy = p.getAttribute('y') || 0;
          if (href) shapes += '<use href="' + _xmlEsc(href) + '" x="' + ux + '" y="' + uy + '" fill="' + fill + '" stroke="' + stroke + '"/>';
        } else if (tag === 'image') {
          const href = p.getAttribute('href') || p.getAttribute('xlink:href') || '';
          const ix = p.getAttribute('x') || 0, iy = p.getAttribute('y') || 0;
          const iw = p.getAttribute('width') || 0, ih = p.getAttribute('height') || 0;
          if (href && !href.startsWith('data:')) shapes += '<image href="' + _xmlEsc(href) + '" x="' + ix + '" y="' + iy + '" width="' + iw + '" height="' + ih + '"/>';
        }
      }

      const svgRect = svg.getBoundingClientRect();

      const vbParts = vb.split(/[\s,]+/).map(Number);
      const vbX = vbParts[0] || 0, vbY = vbParts[1] || 0, vbW = vbParts[2] || w, vbH = vbParts[3] || h;
      const scaleX = vbW / svgRect.width, scaleY = vbH / svgRect.height;
      let labelsSvg = '';
      const searchRoot = labelScope || document;
      const labelEls = [...searchRoot.querySelectorAll('span.txt, .diagram-label, span')].filter(lbl => {
        const t = lbl.textContent.trim();
        if (!/^[A-Z]$/.test(t) || lbl.children.length > 0) return false;
        if (svg.contains(lbl)) return false;
        const lr = lbl.getBoundingClientRect();
        if (lr.width > 50 || lr.height > 50) return false;

        return lr.top < svgRect.bottom + 15 && lr.bottom > svgRect.top - 15 &&
               lr.left < svgRect.right + 15 && lr.right > svgRect.left - 15;
      });

      const seen = new Set();
      for (const lbl of labelEls) {
        const t = lbl.textContent.trim();
        const lr = lbl.getBoundingClientRect();
        const key = t + '_' + Math.round(lr.left/10) + '_' + Math.round(lr.top/10);
        if (seen.has(key)) continue;
        seen.add(key);

        const sx = vbX + (lr.left + lr.width/2 - svgRect.left) * scaleX;
        const sy = vbY + (lr.top + lr.height/2 - svgRect.top) * scaleY;
        labelsSvg += '<text x="' + sx.toFixed(1) + '" y="' + sy.toFixed(1) + '" font-size="' + Math.round(16 * scaleX) + '" font-weight="bold" fill="#000" text-anchor="middle" dominant-baseline="central">' + t.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</text>';
      }
      if (labelsSvg) console.log('[amoura] injected', seen.size, 'vertex labels into SVG');
      const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="' + vb + '"><rect width="100%" height="100%" fill="white"/>' + shapes + labelsSvg + '</svg>';
      const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(cleanSvg)));
      const b64 = await new Promise(res => {
        const img = new Image();
        img.onload = () => { const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/png').split(',')[1]); };
        img.onerror = () => { console.log('[amoura] SVG img.onerror'); res(null); };
        img.src = dataUrl;
      });
      if (b64 && b64.length > 200) { console.log('[amoura] SVG captured OK, shapes:', shapeEls.length); return b64; }
    } catch(e) { console.log('[amoura] SVG convert error:', e.message); }
  }
  const canvasEl = el.tagName?.toLowerCase() === 'canvas' ? el : el.querySelector('canvas');
  if (canvasEl && canvasEl.width > 10 && canvasEl.height > 10) {
    try { const b64 = canvasEl.toDataURL('image/png').split(',')[1]; if (b64 && b64.length > 100) return b64; } catch(e) {}
  }
  if (window.html2canvas) {
    try { const _sc = Math.min(window.devicePixelRatio || 1, 2); const c = await window.html2canvas(el, { scale: _sc, logging: false, backgroundColor: '#ffffff', useCORS: true }); return c.toDataURL('image/png').split(',')[1]; } catch(e) {}
  }
  return null;
}

function ddUnitText(el) {
  const up = el.querySelector('[data-testid="unitPart"]');
  if (!up) return '';

  const rt = up.querySelector('.rich-text, [data-paragraph-plaintext]');
  const t = rt?.textContent?.replace(/\s+/g,' ').trim() || up.textContent?.replace(/\s+/g,' ').trim() || '';
  return (t === 'unit' || t.length > 30) ? '' : t;
}
function ddChoiceText(el) {

  const mixNum = el.querySelector('[data-testid="mixed_number"], .expression.vMixedNum[aria-label]');
  const mixLabel = mixNum?.getAttribute('aria-label');
  if (mixLabel) {
    const unit = ddUnitText(el);
    return (mixLabel + (unit ? ' ' + unit : '')).trim();
  }

  const vfrac = el.querySelector('[data-testid="QMVerticalFraction"]');
  if (vfrac) {
    const num = vfrac.querySelector('.numerator')?.getAttribute('aria-label');
    const den = vfrac.querySelector('.denominator')?.getAttribute('aria-label');
    if (num && den) {
      const unit = ddUnitText(el);
      return (num + '/' + den + (unit ? ' ' + unit : '')).trim();
    }
  }

  const ds = el.querySelector('[data-testid="decimal-scalar"]');
  if (ds && !vfrac) {
    const numTxt = ds.textContent?.trim();
    const ptParts = [...el.querySelectorAll('[data-paragraph-plaintext]')].map(s => s.textContent?.trim()).filter(Boolean).join(' ');
    if (numTxt) return (numTxt + (ptParts ? ' ' + ptParts : '')).trim();
  }

  const tc = el.textContent?.replace(/\s+/g,' ').trim();
  if (tc && tc.length > 0 && tc.length < 40) return tc;

  const labels = [];
  el.querySelectorAll('[aria-label]').forEach(ae => {
    const lbl = ae.getAttribute('aria-label')?.trim();
    if (lbl && !['unit','divided by','operator'].includes(lbl) && !labels.includes(lbl)) labels.push(lbl);
  });
  return labels.join(' ');
}
function normDDText(s) {
  let t = s.toLowerCase();

  t = t.replace(/\bone[\s-]half\b/g, '1/2').replace(/\bone[\s-]third\b/g, '1/3')
       .replace(/\bone[\s-]fourth\b|\bone[\s-]quarter\b/g, '1/4').replace(/\bone[\s-]fifth\b/g, '1/5')
       .replace(/\bone[\s-]sixth\b/g, '1/6').replace(/\bone[\s-]seventh\b/g, '1/7')
       .replace(/\bone[\s-]eighth\b/g, '1/8').replace(/\bone[\s-]tenth\b/g, '1/10');

  t = t.replace(/(\d+)[\s-]halves?\b/g, '$1/2').replace(/(\d+)[\s-]thirds?\b/g, '$1/3')
       .replace(/(\d+)[\s-]fourths?\b|(\d+)[\s-]quarters?\b/g, (_, a, b) => (a||b)+'/4')
       .replace(/(\d+)[\s-]fifths?\b/g, '$1/5').replace(/(\d+)[\s-]sixths?\b/g, '$1/6')
       .replace(/(\d+)[\s-]sevenths?\b/g, '$1/7').replace(/(\d+)[\s-]eighths?\b/g, '$1/8')
       .replace(/(\d+)[\s-]ninths?\b/g, '$1/9').replace(/(\d+)[\s-]tenths?\b/g, '$1/10')
       .replace(/(\d+)[\s-]elevenths?\b/g, '$1/11');

  t = t.replace(/\band\b/g, '').replace(/\s+/g,' ').trim();
  return t;
}
function detectSubject() {
  const url = window.location.pathname;

  if (/^\/(benchmark|diagnostic)\b/.test(url)) {
    const sub = new URLSearchParams(window.location.search).get('subject');
    if (sub === 'e') return 'ela';
    if (sub === 's') return 'science';
    if (sub === 'ss') return 'social';
    return 'math';
  }
  if (url.includes('/ela/') || url.includes('/language-arts/')) return 'ela';
  if (url.includes('/math/') || url.includes('/algebra/') || url.includes('/geometry/') || url.includes('/calculus/') || url.includes('/precalculus/') || url.includes('/trigonometry/') || url.includes('/statistics/')) return 'math';
  if (url.includes('/science/')) return 'science';
  if (url.includes('/social-studies/')) return 'social';
  const title = document.title.toLowerCase();
  if (title.includes('ela') || title.includes('english') || title.includes('reading') || title.includes('writing') || title.includes('grammar') || title.includes('vocabulary')) return 'ela';
  return 'math';
}

function extractGraphMeta() {
  const xLabelsRaw = [...document.querySelectorAll('.xAxisScaleLabel')];
  const yLabelsRaw = [...document.querySelectorAll('.yAxisScaleLabel')];
  const wrapperCount = document.querySelectorAll('.diagramWrapper').length || 1;
  const perWrapper = Math.ceil(xLabelsRaw.length / wrapperCount) || xLabelsRaw.length;
  const xLabels = xLabelsRaw.slice(0, perWrapper).map(el => ({
    val: parseFloat(el.textContent.trim()),
    px: parseFloat(el.closest('.diagramLabel')?.style.left || 0)
  })).filter(l => !isNaN(l.val) && !isNaN(l.px));
  const yLabels = yLabelsRaw.slice(0, perWrapper).map(el => ({
    val: parseFloat(el.textContent.trim()),
    px: parseFloat(el.closest('.diagramLabel')?.style.top || 0)
  })).filter(l => !isNaN(l.val) && !isNaN(l.px));
  if (xLabels.length < 2 || yLabels.length < 2) return null;
  const xDenom = xLabels[1].val - xLabels[0].val;
  const yDenom = yLabels[1].val - yLabels[0].val;
  if (xDenom === 0 || yDenom === 0) return null;
  const xPxPerUnit = (xLabels[1].px - xLabels[0].px) / xDenom;
  const yPxPerUnit = (yLabels[1].px - yLabels[0].px) / yDenom;
  const originX = xLabels[0].px - xLabels[0].val * xPxPerUnit;
  const originY = yLabels[0].px - yLabels[0].val * yPxPerUnit;
  const xTitle = document.querySelector('.axisTitleLabel.xAxis')?.textContent?.trim() || '';
  const yTitle = document.querySelector('.axisTitleLabel.yAxis')?.textContent?.trim() || '';
  const xRange = [Math.min(...xLabels.map(l => l.val)), Math.max(...xLabels.map(l => l.val))];
  const yRange = [Math.min(...yLabels.map(l => l.val)), Math.max(...yLabels.map(l => l.val))];
  return { xPxPerUnit, yPxPerUnit, originX, originY, xTitle, yTitle, xRange, yRange };
}

async function plotGraphPoints(overlay, graphMeta, coords) {

  const allXL = [...document.querySelectorAll('.xAxisScaleLabel')];
  const allYL = [...document.querySelectorAll('.yAxisScaleLabel')];
  const wrapperCount = document.querySelectorAll('.diagramWrapper').length || 1;
  const perWrapper = Math.ceil(allXL.length / wrapperCount) || allXL.length;

  const xLabels = allXL.slice(0, perWrapper).map(el => {
    const p = el.closest('.diagramLabel') || el;
    const r = p.getBoundingClientRect();
    return { val: parseFloat(el.textContent.trim()), sx: r.left + r.width / 2 };
  }).filter(l => !isNaN(l.val)).sort((a,b) => a.val - b.val);

  const yLabels = allYL.slice(0, perWrapper).map(el => {
    const p = el.closest('.diagramLabel') || el;
    const r = p.getBoundingClientRect();
    return { val: parseFloat(el.textContent.trim()), sy: r.top + r.height / 2 };
  }).filter(l => !isNaN(l.val)).sort((a,b) => a.val - b.val);

  if (xLabels.length < 2 || yLabels.length < 2) { console.warn('[amoura] graph: not enough labels'); return; }

  const xFirst = xLabels[0], xLast = xLabels[xLabels.length - 1];
  const yFirst = yLabels[0], yLast = yLabels[yLabels.length - 1];
  const xValDiff = xLast.val - xFirst.val;
  const yValDiff = yLast.val - yFirst.val;
  if (xValDiff === 0 || yValDiff === 0) { console.warn('[amoura] graph: duplicate label values'); return; }
  const xPx = (xLast.sx - xFirst.sx) / xValDiff;
  const yPx = (yLast.sy - yFirst.sy) / yValDiff;
  const oSX = xFirst.sx - xFirst.val * xPx;
  const oSY = yFirst.sy - yFirst.val * yPx;

  console.log('[amoura] graph cal: xPx/u=' + xPx.toFixed(2) + ' yPx/u=' + yPx.toFixed(2) + ' origin=(' + Math.round(oSX) + ',' + Math.round(oSY) + ')');

  overlay.dispatchEvent(new MouseEvent('mouseover', { bubbles:true, clientX:oSX, clientY:oSY, view:window }));
  await sleep(150);
  for (const pt of coords) {
    if (isPaused()) { console.log('[amoura] graph plot aborted — paused'); return; }
    const clientX = oSX + pt.x * xPx;
    const clientY = oSY + pt.y * yPx;
    const o = { bubbles:true, cancelable:true, clientX, clientY, view:window };
    overlay.dispatchEvent(new MouseEvent('mousemove', o));
    await sleep(120);
    overlay.dispatchEvent(new MouseEvent('mousemove', o));
    await sleep(60);
    overlay.dispatchEvent(new MouseEvent('mousedown', { ...o, button:0, buttons:1 }));
    await sleep(60);
    overlay.dispatchEvent(new MouseEvent('mouseup', { ...o, button:0, buttons:0 }));
    await sleep(30);
    overlay.dispatchEvent(new MouseEvent('click', o));
    console.log('[amoura] plotted ('+pt.x+','+pt.y+') at pixel ('+Math.round(clientX)+','+Math.round(clientY)+')');
    await sleep(600);
  }
}

let _lastAudioUrl = '';
function _getAudioUrl() {
  let url = '';
  const audioEl = document.querySelector('audio');
  if (audioEl) {
    url = audioEl.currentSrc || audioEl.src || '';
    if (!url || !url.includes('/practice/audio/')) {
      const srcEl = audioEl.querySelector('source');
      if (srcEl && srcEl.src.includes('/practice/audio/')) url = srcEl.src;
    }
  }
  if (!url || !url.includes('/practice/audio/')) {
    const entries = performance.getEntriesByType('resource');
    for (let i = entries.length - 1; i >= 0; i--) {
      const e = entries[i];
      if (e.name.includes('/practice/audio/') && e.name !== _lastAudioUrl) {
        url = e.name; break;
      }
    }
  }
  return url && url.includes('/practice/audio/') ? url : null;
}
function _getAudioSpellWord() {
  const url = _getAudioUrl();
  if (!url || !url.includes('rawText')) return null;
  try {
    const match = url.match(/[?&]rawText=([^&]+)/);
    if (!match) return null;
    const rawText = decodeURIComponent(match[1]);
    const firstDot = rawText.indexOf('.');
    const word = firstDot > 0 ? rawText.slice(0, firstDot).trim() : rawText.trim();
    if (word) _lastAudioUrl = url;
    return word || null;
  } catch(e) { return null; }
}
function _getAudioFileName() {
  const url = _getAudioUrl();
  if (!url) return null;
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname) + (u.search || '');
  } catch(e) { return url; }
}
function _getAudioSpellFromDOM() {
  const el = document.querySelector('.practice-audio-button[data-practice-audio-text]');
  if (!el) return null;
  const raw = el.getAttribute('data-practice-audio-text') || '';
  if (!raw) return null;
  const firstDot = raw.indexOf('.');
  const word = firstDot > 0 ? raw.slice(0, firstDot).trim() : raw.trim();
  return word || null;
}
function _findAudioPlayBtn() {
  const earBtn = document.querySelector('[class*="AudioPrompt"] button, [class*="audioPrompt"] button, [class*="audio-prompt"] button, .audioBar button, [class*="audio-button"]');
  if (earBtn && earBtn.offsetParent) return earBtn;
  const iconBtn = document.querySelector('.iconDefault');
  if (iconBtn && iconBtn.offsetParent) {
    const parent = iconBtn.closest('[class*="audio"], [class*="Audio"]');
    if (parent) return iconBtn;
  }
  const audioEl = document.querySelector('audio');
  if (audioEl) {
    const wrapper = audioEl.closest('button, [role="button"], [class*="audio"]');
    if (wrapper && wrapper.offsetParent) return wrapper;
  }
  const allBtns = [...document.querySelectorAll('button, [role="button"]')].filter(b => b.offsetParent);
  for (const b of allBtns) {
    const svg = b.querySelector('svg');
    const cls = (b.className || '') + ' ' + (b.closest('[class*="audio"], [class*="Audio"], [class*="ear"], [class*="listen"]')?.className || '');
    if (svg && /audio|ear|listen|sound|speaker|play/i.test(cls)) return b;
  }
  return null;
}
async function _clickAudioPlay() {
  const btn = _findAudioPlayBtn();
  if (!btn) { console.log('[amoura] audio play button not found'); return false; }
  console.log('[amoura] clicking audio play button:', btn.tagName, btn.className?.slice(0, 60));
  btn.click();
  btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  await sleep(300);
  return true;
}

function detectQuestionType() {
  const subject = detectSubject();
  const qArea = document.querySelector('.ixl-practice-crate, [class*="question"], .qreactbridge, main') || document.body;
  const fills = [...document.querySelectorAll('input.fillIn:not([disabled]), textarea.fill-in:not([disabled])')].filter(i => i.offsetParent);

  const _audioDomWord = _getAudioSpellFromDOM();
  const _audioPlayBtn = _findAudioPlayBtn();
  const _audioUrlCheck = _getAudioUrl();
  const _hasRawText = _audioUrlCheck && _audioUrlCheck.includes('rawText');

  const _visibleText = qArea.innerText || '';
  const _hasMathExpr = /\d\s*[\+\-\×\÷\*\/]\s*\d/.test(_visibleText) || /\d\s*=\s*$/.test(_visibleText.replace(/\s+/g, ' ').trim());
  if (!_hasMathExpr && (_audioDomWord || _audioPlayBtn || _hasRawText) && fills.length >= 1) {
    const spellWord = _audioDomWord || _getAudioSpellWord();
    const audioFile = _getAudioFileName();
    console.log('[amoura] audio-spell detected. domWord:', _audioDomWord, 'playBtn:', !!_audioPlayBtn, 'word:', spellWord || '(waiting...)');
    return { type: 'audio-spell', directAnswer: spellWord || null, audioFile: audioFile, blanks: fills, subject };
  }

  const _clozeOpts = [...document.querySelectorAll('.select-edit-text-clickable')].filter(e => e.offsetParent && e.innerText.trim().length > 0);
  if (_clozeOpts.length >= 2 && fills.length >= 1) {
    const _editContainers = [...document.querySelectorAll('.select-edit-text-container')].filter(c => c.offsetParent && c.querySelector('.fill-in-box'));
    if (_editContainers.length >= 5) {
      const passageWords = _editContainers.map(c => {
        const cl = c.querySelector('.select-edit-text-clickable');
        const ca = c.querySelector('[data-content-after]');
        return { word: cl?.innerText?.trim() || '', suffix: ca?.getAttribute('data-content-after') || '' };
      });
      const _readOnlyContainers = [...document.querySelectorAll('.select-edit-text-container')].filter(c => c.offsetParent && !c.querySelector('.fill-in-box'));
      const contextWords = _readOnlyContainers.map(c => {
        const cl = c.querySelector('.select-edit-text-clickable');
        const ca = c.querySelector('[data-content-after]');
        return (cl?.innerText?.trim() || '') + (ca?.getAttribute('data-content-after') || '');
      });
      const passage = passageWords.map(w => w.word + w.suffix).join(' ');
      const contextPassage = contextWords.join(' ');
      console.log('[amoura] proofread detected.', _editContainers.length, 'editable words,', _readOnlyContainers.length, 'context words');
      return { type: 'cloze', subType: 'proofread', passageWords, blanks: fills, options: _clozeOpts, optTexts: _clozeOpts.map(e => e.innerText.trim()), passage, contextPassage, subject };
    }
    const optTexts = _clozeOpts.map(e => e.innerText.trim());
    console.log('[amoura] cloze detected. options:', optTexts.length, optTexts, 'blanks:', fills.length);
    return { type: 'cloze', options: _clozeOpts, blanks: fills, optTexts, subject };
  }
  if (!fills.length) {
    const plainInputs = [...qArea.querySelectorAll('input[type="text"]:not([disabled]):not([class*="nav"]):not([class*="search"]):not([class*="header"]):not([role="combobox"]), input:not([type]):not([disabled])')].filter(i => i.offsetParent && !i.closest('[class*="nav"],[class*="header"],[class*="search"]'));
    if (plainInputs.length >= 1) {
      const mixedTiles = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile')].filter(e => e.offsetParent && (e.innerText.trim().length > 0 || e.querySelector('svg, canvas, img:not([class*="check"])') ));
      if (mixedTiles.length >= 2) {
        const hasImages = mixedTiles.some(e => e.querySelector('svg, canvas'));
        const isMultiTile = mixedTiles.some(e => e.classList.contains('MULTIPLE_SELECT') || e.getAttribute('role') === 'checkbox');
        return { type: 'mixed-fill-mc', inputs: plainInputs, options: mixedTiles, hasImages, multiSelect: isMultiTile, subject };
      }
      const spW2 = plainInputs[0].closest('.yui3-sympadfiwidget') || document.querySelector('.yui3-sympadwidget, .yui3-sympadfiwidget:not(.yui3-sympadfiwidget-disabled)');
      if (spW2 && spW2.offsetParent) {

        const allSpWidgets = [...document.querySelectorAll('.yui3-sympadfiwidget:not(.yui3-sympadfiwidget-disabled)')].filter(w => w.offsetParent);
        const allSpInputs = allSpWidgets.length > 1 ? [...new Set([...plainInputs, ...allSpWidgets.flatMap(w => [...w.querySelectorAll('input:not([disabled])')].filter(i => i.offsetParent))])] : plainInputs;
        if (allSpInputs.length > 1 || allSpWidgets.length > 1) return { type: 'multi-sympad', inputs: allSpInputs.length > 1 ? allSpInputs : plainInputs, el: spW2, widgets: allSpWidgets, inputCount: Math.max(allSpInputs.length, allSpWidgets.length), subject };
        return { type: 'sympad', el: spW2, subject };
      }

      const aitBtns = document.querySelectorAll('.symPadButton[aria-label]');
      const aitBox = plainInputs[0].closest('.bundle.symPad') || document.querySelector('.bundle.symPad, .symPadFIArea, .aitKeyboard');
      if (aitBtns.length > 0 || aitBox) {
        const spElFallback = aitBox || plainInputs[0].closest('.bundle.symPad, .symPadFIArea') || plainInputs[0].parentElement || plainInputs[0];
        console.log('[amoura] sympad detected via AIT fallback, aitBtns:', aitBtns.length);
        return { type: 'sympad', el: spElFallback, subject };
      }
      if (plainInputs.length > 1) return { type: 'multi-fill', inputs: plainInputs, subject };
      return { type: 'fill-in', inputs: plainInputs, subject };
    }
  }
  if (fills.length > 0) {
    const mixedTiles = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile')].filter(e => e.offsetParent && (e.innerText.trim().length > 0 || e.querySelector('svg, canvas, img:not([class*="check"])') ));
    if (mixedTiles.length >= 2) {
      const hasImages = mixedTiles.some(e => e.querySelector('svg, canvas'));
      const isMultiTile = mixedTiles.some(e => e.classList.contains('MULTIPLE_SELECT') || e.getAttribute('role') === 'checkbox');
      return { type: 'mixed-fill-mc', inputs: fills, options: mixedTiles, hasImages, multiSelect: isMultiTile, subject };
    }
    const spW = fills[0].closest('.yui3-sympadfiwidget') || document.querySelector('.yui3-sympadwidget, .yui3-sympadfiwidget:not(.yui3-sympadfiwidget-disabled)');
    if (spW && spW.offsetParent) {
      const allSpWidgets2 = [...document.querySelectorAll('.yui3-sympadfiwidget:not(.yui3-sympadfiwidget-disabled)')].filter(w => w.offsetParent);
      const allSpInputs2 = allSpWidgets2.length > 1 ? [...new Set([...fills, ...allSpWidgets2.flatMap(w => [...w.querySelectorAll('input.fillIn:not([disabled]), input[type="text"]:not([disabled])')].filter(i => i.offsetParent))])] : fills;
      if (allSpInputs2.length > 1 || allSpWidgets2.length > 1) return { type: 'multi-sympad', inputs: allSpInputs2.length > 1 ? allSpInputs2 : fills, el: spW, widgets: allSpWidgets2, inputCount: Math.max(allSpInputs2.length, allSpWidgets2.length), subject };
      return { type: 'sympad', el: spW, subject };
    }

    const aitBtns2 = document.querySelectorAll('.symPadButton[aria-label]');
    const aitBox2 = fills[0].closest('.bundle.symPad') || document.querySelector('.bundle.symPad, .symPadFIArea, .aitKeyboard');
    if (aitBtns2.length > 0 || aitBox2) {
      const spElFallback2 = aitBox2 || fills[0].closest('.bundle.symPad, .symPadFIArea') || fills[0].parentElement || fills[0];
      console.log('[amoura] sympad detected via AIT fallback (fills), aitBtns:', aitBtns2.length);
      return { type: 'sympad', el: spElFallback2, subject };
    }
    if (fills.length > 1) return { type: 'multi-fill', inputs: fills, subject };
    return { type: 'fill-in', inputs: fills, subject };
  }
  const allSymPadWidgets = [...document.querySelectorAll('.yui3-sympadfiwidget:not(.yui3-sympadfiwidget-disabled)')].filter(w => w.offsetParent);
  if (allSymPadWidgets.length > 1) {
    const spInputs = [...new Set(allSymPadWidgets.flatMap(w => [...w.querySelectorAll('input:not([disabled])')].filter(i => i.offsetParent)))];
    return { type: 'multi-sympad', inputs: spInputs.length ? spInputs : [allSymPadWidgets[0].querySelector('input')].filter(Boolean), el: allSymPadWidgets[0], widgets: allSymPadWidgets, inputCount: Math.max(spInputs.length, allSymPadWidgets.length), subject };
  }
  if (allSymPadWidgets.length === 1) return { type: 'sympad', el: allSymPadWidgets[0], subject };
  const mathEditor = document.querySelector('[class*="mathquill"], [class*="MathQuill"], [class*="math-editor"], [class*="mq-editable"], .mq-editable-field');
  if (mathEditor) return { type: 'math-editor', el: mathEditor, subject };
  const fracInputs = [...document.querySelectorAll('.frac input:not([disabled]), [class*="fraction"] input:not([disabled]), [class*="frac-"] input:not([disabled]), [class*="frac_"] input:not([disabled]), [class$="frac"] input:not([disabled]), [class*="Frac"] input:not([disabled]), [class*="Fraction"] input:not([disabled])')].filter(i => i.offsetParent);
  if (fracInputs.length > 0) return { type: 'frac-inputs', inputs: fracInputs, subject };
  const selectWords = [...document.querySelectorAll('.select-words-chunk-selectable')].filter(e => e.offsetParent);
  if (selectWords.length >= 2) return { type: 'select-words', options: selectWords, subject };

  const _lpCols = [...document.querySelectorAll('.gc-lineplot-column-container')];
  if (_lpCols.length >= 2) {
    const columns = _lpCols.map(col => {

      const mcs = [...col.querySelectorAll('.mark-container')].filter(mc => mc.querySelector('div.initial'));
      return { el: col, markContainers: mcs };
    });

    let labels = [];
    const _lpContainer = _lpCols[0].closest('.line-plot-container');
    const _dlContainer = _lpContainer?.querySelector('.number-line-graph .diagramLabelContainer');
    if (_dlContainer) {
      const _dls = [..._dlContainer.querySelectorAll('.diagramLabel')]
        .filter(dl => !dl.querySelector('.axisTitleLabel'));
      _dls.sort((a, b) => (parseFloat(a.style.left) || 0) - (parseFloat(b.style.left) || 0));
      const _allLabels = _dls.map(dl => dl.querySelector('div[aria-label]')?.getAttribute('aria-label') || '').filter(Boolean);
      if (_allLabels.length === _lpCols.length) {
        labels = _allLabels;
      } else if (_allLabels.length > 0) {

        labels = _lpCols.map(col => {
          const colLeft = parseFloat(col.closest('.line-plot-column')?.style.left) || 0;
          let best = _allLabels[0], bestDist = Infinity;
          _dls.forEach((dl, i) => {
            const d = Math.abs((parseFloat(dl.style.left) || 0) - colLeft);
            if (d < bestDist) { bestDist = d; best = _allLabels[i]; }
          });
          return best;
        });
      }
    }
    const maxMarks = columns[0]?.markContainers.length || 5;
    console.log('[amoura] lineplot detected. columns:', columns.length, 'max marks/col:', maxMarks, 'labels:', labels);
    return { type: 'lineplot', columns, labels, maxMarksPerCol: maxMarks, subject };
  }

  const graphOverlay = document.querySelector('.graphingPointerOverlay.interactive');
  if (graphOverlay && graphOverlay.offsetParent) {
    const graphMeta = extractGraphMeta();
    const mcBtns = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile, [class*="choice"]:not(.drop-down-choice)')].filter(e => e.offsetParent && e.innerText.trim().length > 0 && !e.closest('.drop-down-choice-list') && !e.closest('.hiding-box'));
    const compoundBtns = [...document.querySelectorAll('.compoundButton.interactive')].filter(e => e.offsetParent && e.querySelector('svg'));
    const allMcBtns = mcBtns.length >= 2 ? mcBtns : compoundBtns.length >= 2 ? compoundBtns : null;
    const hasCompoundBtns = compoundBtns.length >= 2;
    console.log('[amoura] graph detected, meta:', graphMeta, 'mc buttons:', (allMcBtns || []).length, 'compound:', compoundBtns.length);
    return { type: 'graph', graphMeta, overlay: graphOverlay, mcButtons: allMcBtns, hasCompoundBtns, subject };
  }
  const orderContainer = document.querySelector('[class*="order-items-container"]');
  if (orderContainer && orderContainer.offsetParent) {
    const orderItems = [...orderContainer.querySelectorAll('[class*="order-items-item"]')].filter(el => el.offsetParent);
    if (orderItems.length >= 2) return { type: 'order', container: orderContainer, items: orderItems, subject };
  }
  const correctables = [...document.querySelectorAll('.correctable')].filter(e => e.offsetParent && e.innerText.trim().length > 0);
  if (correctables.length >= 2) {
    const texts = correctables.map((e, i) => ({ text: e.innerText.trim(), choiceIndex: parseInt(e.getAttribute('choiceindex')) || (i + 1) }));
    console.log('[amoura] correctable detected.', correctables.length, 'words:', texts.map(t => t.text));
    return { type: 'correctable', options: correctables, correctableTexts: texts, subject };
  }
  const retypeArea = document.querySelector('textarea.retype-text-editable-text, .retype-text-editable-text');
  if (retypeArea && retypeArea.offsetParent) {
    console.log('[amoura] retype textarea detected');
    return { type: 'retype', textarea: retypeArea, subject };
  }
  const selectableTiles = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile')].filter(e => e.offsetParent && (e.innerText.trim().length > 0 || e.querySelector('svg, canvas, img:not([class*="check"])')));
  if (selectableTiles.length >= 2) {
    const isMultiTile = selectableTiles.some(e => e.classList.contains('MULTIPLE_SELECT') || e.getAttribute('role') === 'checkbox');
    const hasImages = selectableTiles.some(e => e.querySelector('svg, canvas'));
    return { type: isMultiTile ? 'mc-multi' : 'mc', options: selectableTiles, hasImages, subject };
  }

  const ddArrows = [...document.querySelectorAll('.drop-down-arrow-icon')].filter(e => {
    if (!e.offsetParent) return false;
    const w = e.closest('.drop-down-header')?.parentElement;
    return w && !w.classList.contains('non-interactive');
  });
  if (ddArrows.length > 0) {
    const ddData = ddArrows.map(arrow => {
      const header = arrow.closest('.drop-down-header');
      const wrapper = header?.parentElement;
      const hidingBox = wrapper?.querySelector('.hiding-box');
      const choiceList = hidingBox?.querySelector('.drop-down-choice-list') || wrapper?.querySelector('.drop-down-choice-list');
      const choices = choiceList ? [...choiceList.querySelectorAll('.drop-down-choice')] : [];
      const optTexts = choices.map(c => ddChoiceText(c)).filter(t => t.length > 0);
      return { arrow, header, wrapper, hidingBox, choiceList, choices, optTexts };
    });
    console.log('[amoura] IXL custom dropdowns:', ddData.length, ddData.map(d => d.optTexts));
    return { type: 'ixl-dropdown', dropdowns: ddData, subject };
  }
  const gridCheckboxes = [...document.querySelectorAll('td.choiceCell input[type="checkbox"], .questionRow input[type="checkbox"], table input[type="checkbox"]')].filter(c => {
    const cell = c.closest('td');
    return cell && cell.offsetParent && !c.checked && !c.disabled;
  });
  if (gridCheckboxes.length >= 2) {
    const table = gridCheckboxes[0].closest('table');
    const thead = table?.querySelector('thead');
    const headerRow = thead?.querySelector('tr') || table?.rows?.[0];
    const colHeaders = headerRow ? [...headerRow.querySelectorAll('td, th')].map(td => td.textContent.trim()).filter(Boolean) : [];
    const rows = [...(table?.querySelectorAll('tr.questionRow, tbody tr') || [])].filter(tr => tr.querySelector('input[type="checkbox"]'));
    const gridData = rows.map((tr, ri) => {
      const cells = [...tr.querySelectorAll('td')];
      const label = cells[0]?.textContent?.trim() || 'Row ' + (ri + 1);
      const cbs = [...tr.querySelectorAll('input[type="checkbox"]')];
      return { label, checkboxes: cbs };
    });
    console.log('[amoura] checkbox-grid detected. cols:', colHeaders, 'rows:', gridData.length, 'total checkboxes:', gridCheckboxes.length);
    return { type: 'checkbox-grid', colHeaders, gridData, checkboxes: gridCheckboxes, subject };
  }
  const radioLabels = [...document.querySelectorAll('label.radio-grn, label.label-kid-friendly')].filter(l => l.offsetParent);
  if (radioLabels.length >= 2) {
    const options = radioLabels.map(l => { const li = l.closest('li') || l.parentElement; return li && li.innerText.trim().length > 0 ? li : l; });
    console.log('[amoura] radio-label MC detected. options:', radioLabels.length, options.map(o => o.innerText.trim().slice(0,30)));
    return { type: 'radio', options, radioLabels, hasImages: false, subject };
  }
  const mcBtns = [...document.querySelectorAll('[class*="choice"],[class*="Choice"],[class*="CHOICE"]')].filter(e => e.offsetParent && e.innerText.trim().length > 0 && !e.classList.contains('drop-down-choice') && !e.closest('.drop-down-choice-list') && !e.closest('.header-content-container') && !e.closest('.hiding-box') && !e.classList.contains('choiceCell') && !e.closest('table') && !e.querySelector('table'));
  if (mcBtns.length >= 2) return { type: 'mc', options: mcBtns, hasImages: false, subject };
  const checkboxes = [...document.querySelectorAll('input[type="checkbox"]:not([id*="menu"]):not([id*="search"])')].filter(c => c.offsetParent || (c.closest('label') && c.closest('label').offsetParent));
  if (checkboxes.length >= 2) return { type: 'multi-select', checkboxes, subject };
  const selectableText = [...document.querySelectorAll('[class*="selectable"],[class*="Selectable"],[class*="clickable-text"],[class*="evidence"],[class*="Evidence"],[class*="highlight-option"]')].filter(e => e.offsetParent && e.innerText.trim().length > 5);
  if (selectableText.length >= 2) return { type: 'text-select', options: selectableText, subject };
  const selects = [...document.querySelectorAll('select:not([disabled])')].filter(s => s.offsetParent);
  if (selects.length > 0) return { type: 'dropdown', selects, subject };

  const classifyBins = [...document.querySelectorAll('.bin.dropArea')].filter(b => b.offsetParent);
  if (classifyBins.length >= 2) {
    const binNames = classifyBins.map(b => {
      const txt = b.querySelector('.binHeaderContent .txt, .binHeader .txt');
      return txt ? txt.textContent.trim() : 'Bin ' + (b.getAttribute('index') || '?');
    });

    const allDragEls = [...document.querySelectorAll('.itemBank .dragWrapper.draggableElement, .itemBank .draggableElement.dragWrapper, .ddItemBankDropSlot .dragWrapper')].filter(el => el.offsetParent);
    const seenIds = new Set();
    const uniqueItems = allDragEls.filter(el => {
      const id = el.id;
      if (id && seenIds.has(id)) return false;
      if (id) seenIds.add(id);
      return true;
    });
    if (uniqueItems.length >= 1) {
      console.log('[amoura] classify detected. bins:', binNames, 'items:', uniqueItems.length);
      return { type: 'classify', bins: classifyBins, binNames, items: uniqueItems, subject };
    }
  }
  const _orderCont = document.querySelector('[class*="order-items-container"]');
  const dragItems = [...document.querySelectorAll('[draggable="true"],[class*="draggable"],[class*="Draggable"]')].filter(e => e.offsetParent && !(_orderCont && _orderCont.contains(e)));
  if (dragItems.length > 0) {

    let dropZones = [...document.querySelectorAll('[class*="drop"],[class*="Drop"],[class*="target"],[class*="Target"],[class*="slot"],[class*="Slot"],[class*="placeholder"],[class*="Placeholder"]')].filter(e => e.offsetParent && !e.querySelector('[draggable="true"]') && e.offsetWidth > 20 && e.offsetHeight > 10);
    dropZones = dropZones.filter(z => !dropZones.some(other => other !== z && z.contains(other)));

    let zones = dropZones;
    if (!zones.length) {
      const tds = [...document.querySelectorAll('td, [class*="cell"], [class*="Cell"]')].filter(td => td.offsetParent && td.innerText.trim() === '' && td.offsetWidth > 40);
      if (tds.length) zones = tds;
    }

    if (!zones.length) {
      zones = [...document.querySelectorAll('[aria-dropeffect],[role="listbox"],[role="group"]')].filter(e => e.offsetParent && e.offsetWidth > 30);
    }
    console.log('[amoura] drag-drop detected. items:', dragItems.length, 'zones:', zones.length);
    return { type: 'drag-drop', items: dragItems, dropZones: zones, subject };
  }
  const fallbackInputs = [...document.querySelectorAll('input[type="text"]:not([disabled]):not([class*="nav"]):not([class*="search"]):not([class*="header"]):not([role="combobox"]),input[type="number"]:not([disabled]),input:not([type]):not([disabled]),textarea.fill-in:not([disabled])')].filter(i => i.offsetParent && !i.closest('[class*="nav"],[class*="header"],[class*="search"]'));
  if (fallbackInputs.length > 1) return { type: 'multi-fill', inputs: fallbackInputs, subject };
  if (fallbackInputs.length === 1) return { type: 'fill-in', inputs: fallbackInputs, subject };
  return { type: 'unknown', subject };
}

function findQuestionEl() {
  const practCrate = document.querySelector('.ixl-practice-crate, .practice-question-wrapper, [class*="practiceQuestion"]');
  if (practCrate && practCrate.offsetParent) return practCrate;
  const bridge = document.querySelector('.qreactbridge');
  if (bridge && bridge.offsetParent && bridge.offsetHeight > 50) return bridge;
  const allQ = [...document.querySelectorAll('[class*="question"]')].filter(el => el.offsetParent && el.offsetWidth > 100 && el.offsetHeight > 50);
  for (const el of allQ) {
    if (el.querySelector('input.fillIn, textarea.fill-in, input[type="text"], [class*="choice"], select, [class*="mathquill"], [class*="mq-editable"], .select-words-chunk-selectable, [data-testid="SelectableTile"], canvas, svg')) return el;
  }
  if (allQ.length > 0) return allQ.reduce((best, el) => el.innerText.length > best.innerText.length ? el : best);
  return document.querySelector('main') || document.body;
}

async function captureQuestion() {
  const qType = detectQuestionType();
  const qEl = findQuestionEl();
  const stripTiles = qType.type === 'mc' || qType.type === 'mc-multi';
  const text = extractCleanText(qEl, stripTiles).slice(0, 4000);
  const questionImages = [];
  const tileSet = new Set([...(qType.options || []), ...(qType.mcButtons || [])]);

  const allSvgsInQ = [...qEl.querySelectorAll('*')].filter(el => {
    const tag = el.tagName?.toLowerCase() || '';
    if (tag !== 'svg' && tag !== 'svg:svg' && tag !== 'canvas') return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 30 || rect.height < 30) return false;
    let p = el.parentElement;
    while (p && p !== qEl) { if (tileSet.has(p)) return false; p = p.parentElement; }
    return true;
  });

  const hasMeaningfulSvgs = allSvgsInQ.length <= 2 || allSvgsInQ.some(el => { const r = el.getBoundingClientRect(); return r.width > 120 || r.height > 120; });
  if (hasMeaningfulSvgs) {
    for (const visEl of allSvgsInQ.slice(0, 4)) { const b64 = await elementToBase64(visEl, qEl); if (b64) questionImages.push(b64); else console.log('[amoura] SVG capture failed, tag:', visEl.tagName, 'size:', visEl.getBoundingClientRect().width+'x'+visEl.getBoundingClientRect().height); }
  } else {
    console.log('[amoura] skipping', allSvgsInQ.length, 'small SVGs (decorative), screenshot will capture them');
  }
  console.log('[amoura] question images:', questionImages.length, 'svgs+canvas:', allSvgsInQ.length);

  const contentImgs = [...qEl.querySelectorAll('img')].filter(img => {
    if (!img.offsetParent || !img.complete || !img.naturalWidth) return false;
    const rect = img.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 50) return false;
    let p = img.parentElement;
    while (p && p !== qEl) { if (tileSet.has(p)) return false; p = p.parentElement; }
    return true;
  });
  for (const img of contentImgs.slice(0, 3)) {
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const b64 = c.toDataURL('image/png').split(',')[1];
      if (b64 && b64.length > 500) { questionImages.push(b64); console.log('[amoura] captured <img>', img.className, Math.round(b64.length/1024)+'KB'); }
    } catch(e) { console.log('[amoura] <img> capture failed (CORS?):', e.message, '- alt:', (img.alt || '').slice(0, 80)); }
  }

  const _hasMathEls = qEl.querySelector('.mq-math-mode, [class*="mq-root"], math, [class*="mathquill"], .frac, [class*="fraction"], sup, .expression, [class*="exponent"], [class*="sqrt"], [class*="integral"]');
  const _isMathSubj = /math|calcul|algebra|geometry|trig|stats|precalc/i.test(qType.subject || '');
  const needsScreenshot = allSvgsInQ.length > 0 || contentImgs.length > 0 || qType.hasImages || _hasMathEls || qType.type === 'graph' || qType.type === 'lineplot' || qType.type === 'checkbox-grid' || qType.type === 'drag-drop' || qType.type === 'order' || qType.type === 'classify' || qType.type === 'math-editor' || qType.type === 'sympad' || qType.type === 'multi-sympad' || qType.type === 'unknown';
  if (needsScreenshot && window.html2canvas) {
    try {
      qEl.scrollIntoView({ block: 'start', behavior: 'instant' });
      await new Promise(r => setTimeout(r, 180));
      const fullH = Math.min(qEl.scrollHeight, 3500);
      const fullW = Math.min(Math.max(qEl.scrollWidth, qEl.offsetWidth), 1400);
      const _sc = (_hasMathEls || allSvgsInQ.some(el => { const r = el.getBoundingClientRect(); return r.width > 80 || r.height > 80; })) ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const _initRect = qEl.getBoundingClientRect();
      const _initScrollY = window.scrollY;
      const _elDocTop = _initScrollY + _initRect.top;
      const _elLeft = Math.max(Math.round(_initRect.left + window.scrollX), 0);
      const _viewH = window.innerHeight;
      let _captureCanvas;
      if (fullH <= _viewH + 50) {

        _captureCanvas = await window.html2canvas(qEl, { scale: _sc, logging: false, backgroundColor: '#ffffff', useCORS: true, width: fullW, height: fullH, windowWidth: window.innerWidth, windowHeight: _viewH, scrollX: 0, scrollY: -_initRect.top });
      } else {

        const _stitched = document.createElement('canvas');
        _stitched.width = Math.round(fullW * _sc); _stitched.height = Math.round(fullH * _sc);
        const _sctx = _stitched.getContext('2d');
        let _cY = 0;
        while (_cY < fullH) {
          const _sH = Math.min(_viewH, fullH - _cY);
          window.scrollTo({ top: _elDocTop + _cY, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 130));
          const _slice = await window.html2canvas(document.documentElement, { scale: _sc, logging: false, backgroundColor: '#ffffff', useCORS: true, x: _elLeft, y: _elDocTop + _cY, width: fullW, height: _sH, windowWidth: window.innerWidth, windowHeight: _viewH });
          _sctx.drawImage(_slice, 0, Math.round(_cY * _sc));
          _cY += _sH;
        }
        window.scrollTo({ top: _initScrollY, behavior: 'instant' });
        _captureCanvas = _stitched;
        console.log('[amoura] stitched', Math.ceil(fullH / _viewH), 'slices, total height:', fullH);
      }
      const b64 = _captureCanvas.toDataURL('image/png').split(',')[1];
      if (b64 && b64.length > 500) { questionImages.push(b64); console.log('[amoura] captured, size:', Math.round(b64.length/1024)+'KB', 'dims:', fullW+'x'+fullH); }
      else console.log('[amoura] capture result too small');
    } catch(e) { console.log('[amoura] capture error:', e.message); }
  } else if (!needsScreenshot) { console.log('[amoura] text-only question, skipping screenshot'); }
  const tileImages = [];
  if (qType.hasImages && qType.options) {
    for (const tile of qType.options) tileImages.push(await elementToBase64(tile));
    console.log('[amoura] extracted', tileImages.filter(Boolean).length, '/', qType.options.length, 'tile images');
  }
  if (qType.type === 'graph' && qType.hasCompoundBtns && qType.mcButtons) {
    for (const btn of qType.mcButtons) tileImages.push(await elementToBase64(btn));
    console.log('[amoura] extracted', tileImages.filter(Boolean).length, 'compound button tile images');
  }
  return { questionImages, tileImages, text, qType };
}

function extractCleanText(root, stripTiles) {
  const clone = root.cloneNode(true);

  if (stripTiles) {
    clone.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile, [class*="MULTIPLE_SELECT"], [role="checkbox"][class*="Tile"], [role="radio"][class*="Tile"]').forEach(el => el.remove());
  }

  clone.querySelectorAll('img[alt]').forEach(img => {
    const alt = img.getAttribute('alt');
    if (alt && alt.length > 5) { const span = document.createElement('span'); span.textContent = ' [Image: ' + alt + '] '; img.parentElement?.insertBefore(span, img); }
  });

  clone.querySelectorAll('[class*="mq-math-mode"], [class*="mq-root-block"], span[mathquill-command-id]').forEach(el => {
    const aria = el.getAttribute('aria-label');
    if (aria) el.textContent = ' ' + aria + ' ';
  });

  clone.querySelectorAll('textarea.mq-textarea, .mq-textarea textarea').forEach(el => el.remove());
  clone.querySelectorAll('.frac,[class*="fraction"],[class*="frac-"],[class*="frac_"],[class$="frac"],[class*="Frac"],[class*="Fraction"]').forEach(frac => {
    const children = frac.querySelectorAll('*');
    const texts = [];
    children.forEach(c => { const t = c.textContent.trim(); if (t && !c.querySelector('*')) texts.push(t); });
    if (texts.length === 2 && texts.every(t => /^[\d.]+$/.test(t))) frac.textContent = texts[0] + '/' + texts[1];
  });
  clone.querySelectorAll('sup').forEach(sup => {
    const sub = sup.parentElement && sup.parentElement.querySelector('sub');
    if (sub) { const num = sup.textContent.trim(), den = sub.textContent.trim(); if (/^[\d.]+$/.test(num) && /^[\d.]+$/.test(den)) { sup.textContent = num + '/' + den; sub.remove(); } }
  });
  return clone.innerText.replace(/\s+/g, ' ').trim();
}

function serializeQType(qType) {
  const s = { type: qType.type, subject: qType.subject, hasImages: !!qType.hasImages };
  if (qType.options) s.options = qType.options.map((o, i) => qType.hasImages ? String.fromCharCode(65+i)+') (image)' : (qType.type === 'select-words' || qType.type === 'text-select' ? (i+1)+') "'+o.innerText.trim().slice(0,150)+'"' : String.fromCharCode(65+i)+') '+o.innerText.trim().slice(0,80)));
  if (qType.inputCount) s.inputCount = qType.inputCount;
  else if (qType.inputs) s.inputCount = qType.inputs.length;
  if (qType.checkboxes) s.checkboxes = qType.checkboxes.length;
  if (qType.colHeaders) s.colHeaders = qType.colHeaders;
  if (qType.gridData) s.gridRows = qType.gridData.map(r => r.label.slice(0, 150));
  if (qType.dropdowns) s.dropdowns = qType.dropdowns.map(dd => dd.optTexts);
  if (qType.selects) s.selects = qType.selects.map(sel => [...sel.options].filter(o => o.value).map(o => o.text.trim()));
  if (qType.items) { s.items = qType.items.map((it, i) => (i+1)+') "'+it.innerText.trim().slice(0,100)+'"'); s.zoneCount = qType.dropZones ? qType.dropZones.length : '?'; }
  if (qType.type === 'frac-inputs' && qType.inputs) s.fracInputCount = qType.inputs.length;
  if (qType.type === 'graph' && qType.graphMeta) {
    s.graphMeta = { xTitle: qType.graphMeta.xTitle, yTitle: qType.graphMeta.yTitle, xRange: qType.graphMeta.xRange, yRange: qType.graphMeta.yRange };
    if (qType.mcButtons) s.mcButtons = qType.mcButtons.map(b => b.innerText.trim().slice(0, 80) || '(graph)');
    if (qType.hasCompoundBtns) s.hasCompoundBtns = true;
  }
  if (qType.type === 'lineplot') {
    s.columnCount = qType.columns.length;
    s.maxMarksPerCol = qType.maxMarksPerCol;
    if (qType.labels?.length) s.labels = qType.labels;
  }
  if (qType.type === 'order' && qType.items) {
    s.orderItems = qType.items.map((el, i) => (i+1)+') '+el.innerText.trim().slice(0, 80));
  }
  if (qType.type === 'classify') {
    s.binNames = qType.binNames;
    s.classifyItems = qType.items.map((el, i) => (i+1)+') "'+el.innerText.trim().slice(0, 100)+'"');
  }
  if (qType.type === 'cloze') {
    if (qType.subType === 'proofread') {
      s.clozeSubType = 'proofread';
      s.passage = qType.passage;
      s.contextPassage = qType.contextPassage || '';
      s.passageWords = qType.passageWords.map((w, i) => ({ i: i + 1, w: w.word, s: w.suffix }));
    } else {
      s.clozeOptions = qType.optTexts;
    }
  }
  if (qType.type === 'correctable') {
    s.correctableTexts = qType.correctableTexts;
  }
  const fillIn = document.querySelector('.fillIn, .fill-in');
  s.hasPercentLabel = !!(fillIn && fillIn.parentElement && fillIn.parentElement.textContent && fillIn.parentElement.textContent.includes('%'));
  return s;
}

function tryArithmetic(text) {
  if (!text) return null;
  let s = text
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/[\u2013\u2212]/g, '-')
    .replace(/\s+/g, ' ').trim();

  s = s.replace(/^(?:what\s+is|find|calculate|evaluate|simplify|solve|multiply|divide|add|subtract)\s*:?\s*/i, '');
  s = s.replace(/[?.]$/, '').trim();

  s = s.replace(/\s*=\s*$/, '').trim();

  if (!/^[\d\s\+\-\*\/\(\)\.%\^]+$/.test(s)) return null;

  if (!/[\+\-\*\/\^%]/.test(s)) return null;

  if (s.length > 120) return null;
  s = s.replace(/\^/g, '**');
  try {

    const result = Function('"use strict"; return (' + s + ')')();
    if (typeof result !== 'number' || !isFinite(result)) return null;
    const rounded = +result.toPrecision(12);
    return Number.isInteger(rounded) ? String(rounded) : String(+rounded.toFixed(10));
  } catch (_) { return null; }
}

async function askGemini({ questionImages, tileImages, text, qType, imageBase64 }) {
  const sType = serializeQType(qType);
  const tileTexts = qType.options ? qType.options.map(o => o.innerText?.trim()?.slice(0,60) || '(graph)') : [];
  if (tileTexts.length) sType.tileTexts = tileTexts;
  const lessonTitle = (document.querySelector('.skill-name, .breadcrumbs li:last-child, [class*="skillName"], [class*="skill-title"]')?.innerText?.trim() ||
    document.querySelector('title')?.textContent?.replace(/\s*[|\-]\s*IXL.*/, '').trim() || '').slice(0, 200);
  const lessonUrl = window.location.pathname;
  const body = { questionImages, tileImages, text, qType: sType, imageBase64, thinking: getThinkingEnabled(), thinkingBudget: getThinkingBudget(), modelMode: getModelMode(), lessonTitle, lessonUrl };
  if (_retryWithPro && body.modelMode === 'auto') { body.forceModel = 'pro'; _retryWithPro = false; console.log('[amoura] retrying with Pro after wrong answer'); }
  console.log('[amoura] /solve request:', sType.type, sType.subject);
  const solveBody = JSON.stringify(body);
  const abortSignal = newSolveAbort();

  const maxRetries = 2;
  const _thinkBudget = parseInt(body.thinkingBudget) || 0;
  const _perAttemptTimeout = _thinkBudget > 10000 ? 60000 : 45000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (abortSignal.aborted) throw new Error('Paused');
    try {
      const timeoutCtrl = new AbortController();
      const timeoutId = setTimeout(() => timeoutCtrl.abort(), _perAttemptTimeout);
      const onPause = () => timeoutCtrl.abort();
      abortSignal.addEventListener('abort', onPause, { once: true });

      let res;
      try {
        res = await _secFetch(PROXY_URL + '/solve', { method:'POST', headers: _authHeaders(), body: solveBody, signal: timeoutCtrl.signal }, { withChallenge: true });
      } finally {
        clearTimeout(timeoutId);
        abortSignal.removeEventListener('abort', onPause);
      }
      if (abortSignal.aborted) throw new Error('Paused');

      if (res.ok) {
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        console.log('[amoura] model:', data.model);
        return data.answer;
      }
      const errText = await res.text();

      if (res.status === 401 && attempt < maxRetries) {
        console.warn('[amoura] auth expired, re-establishing...');
        _authExpiry = 0;
        const refreshed = await _refreshIfNeeded(true);
        if (!refreshed && (!_authUser || _authAnonymous)) await _authAnonymousLogin();
        if (!_authToken) throw new Error('Authentication failed. Please sign in again.');
        _sessKeyBytes = null; _sessKeyExpiry = 0; _aesKeyCache = null; _aesKeySrc = null;
        _prefetchedChallenge = null; _prefetchingChallenge = null;
        await _initServerSession();
        continue;
      }

      if (res.status === 403) {
        if (errText.includes('Temporarily blocked')) {
          throw new Error('Temporarily blocked by server. Try again in a few minutes.');
        }
        if (errText.includes('Invalid origin')) {
          throw new Error('Connection blocked — please reload the page');
        }
        const isSessionErr = errText.includes('Invalid request signature') || errText.includes('Missing request signature') || errText.includes('session') || errText.includes('No session key');
        if (isSessionErr && attempt < maxRetries) {
          console.warn('[amoura] session/signature error, re-initializing...', errText.slice(0, 200));
          _sessKeyBytes = null; _sessKeyExpiry = 0; _aesKeyCache = null; _aesKeySrc = null;
          _prefetchedChallenge = null; _prefetchingChallenge = null;
          await _initServerSession();
          continue;
        }
        const isChallengeOrNonce = errText.includes('challenge') || errText.includes('nonce') || errText.includes('Nonce') || errText.includes('timestamp');
        if (isChallengeOrNonce && attempt < maxRetries) {
          const wait = Math.min(1500 * Math.pow(2, attempt) + Math.random() * 500, 10000);
          console.warn('[amoura] challenge/nonce error, retrying...', errText.slice(0, 200));
          setStatus('<span style="color:#f59e0b">' + IC.warn + ' Retrying...</span>');
          _prefetchedChallenge = null; _prefetchingChallenge = null;
          await _prefetchChallenge();
          await sleep(wait);
          if (abortSignal.aborted) throw new Error('Paused');
          continue;
        }
      }

      const isRetryable = res.status === 429 || res.status >= 500;
      if (isRetryable && attempt < maxRetries) {
        const wait = Math.min(2000 * Math.pow(2, attempt) + Math.random() * 500, 15000);
        console.warn('[amoura] retry ' + (attempt+1) + '/' + maxRetries + ' after ' + res.status + ': ' + errText.slice(0, 200) + ', waiting ' + Math.round(wait) + 'ms');
        setStatus('<span style="color:#f59e0b">' + IC.warn + ' Rate limited — retrying in ' + Math.round(wait/1000) + 's...</span>');
        await sleep(wait);
        if (abortSignal.aborted) throw new Error('Paused');
        continue;
      }
      throw new Error('Solve ' + res.status + ': ' + errText.slice(0, 150));
    } catch (e) {

      if (abortSignal.aborted || (e.message && e.message === 'Paused')) throw new Error('Paused');

      if (e.name === 'AbortError') {
        
        if (attempt < maxRetries) {
          console.warn('[amoura] solve timeout, retry ' + (attempt+1) + '/' + maxRetries);
          setStatus('<span style="color:#f59e0b">' + IC.warn + ' AI slow — retrying...</span>');
          _prefetchedChallenge = null; _prefetchingChallenge = null;
          await _prefetchChallenge();
          await sleep(1000);
          if (abortSignal.aborted) throw new Error('Paused');
          continue;
        }
        throw new Error('AI timed out after ' + (maxRetries + 1) + ' attempts');
      }

      if (e.message && !e.message.startsWith('Solve ') && attempt < maxRetries) {
        const wait = Math.min(2000 * Math.pow(2, attempt) + Math.random() * 500, 15000);
        console.warn('[amoura] network retry ' + (attempt+1) + '/' + maxRetries + ': ' + e.message);
        setStatus('<span style="color:#f59e0b">' + IC.warn + ' Connection error — retrying in ' + Math.round(wait/1000) + 's...</span>');
        await sleep(wait);
        if (abortSignal.aborted) throw new Error('Paused');
        continue;
      }
      throw e;
    }
  }
  throw new Error('All retries exhausted');
}

function cleanAnswer(raw) {
  let a = raw.trim().replace(/^["']|["']$/g, '');
  a = a.replace(/^```[\s\S]*?\n([\s\S]*?)\n?```$/g, '$1').trim();
  a = a.replace(/^`([^`]+)`$/, '$1');
  a = a.replace(/(?<![A-Z])\.\s*$/i, '');
  return a.trim();
}

const _nativeInputSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
const _nativeTextareaSet = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
function reactSet(input, value) {
  const setter = input.tagName === 'TEXTAREA' ? _nativeTextareaSet : _nativeInputSet;
  input.focus();
  if (setter) setter.call(input, value); else input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

function reactClick(el) {
  const rk = Object.keys(el).find(k => /^__reactFiber|^__reactInternal/.test(k));
  if (rk) {
    let fiber = el[rk];
    const rect2 = el.getBoundingClientRect();
    const ev2 = new MouseEvent('click', { bubbles:true, cancelable:true, clientX:rect2.left+rect2.width/2, clientY:rect2.top+rect2.height/2 });
    for (let i = 0; i < 30 && fiber; i++, fiber = fiber.return) {
      const p = fiber.memoizedProps;
      if (p) {
        if (typeof p.onClick === 'function') { try { p.onClick(ev2); return; } catch(e2) {} }
        if (typeof p.onChange === 'function') { try { p.onChange({ target: el, currentTarget: el, isTrusted: true, bubbles: true, type: 'change', nativeEvent: ev2, preventDefault: ()=>{}, stopPropagation: ()=>{} }); return; } catch(e2) {} }
      }
    }
  }
  const rect = el.getBoundingClientRect();
  const cx = rect.left+rect.width/2, cy = rect.top+rect.height/2;
  const o = { bubbles:true, cancelable:true, clientX:cx, clientY:cy };
  const _isTouch = navigator.maxTouchPoints > 0;
  if (_isTouch) {
    try {
      const _tid = Date.now();
      const tp = [new Touch({ identifier: _tid, target: el, clientX: cx, clientY: cy, pageX: cx + window.scrollX, pageY: cy + window.scrollY })];
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: tp, targetTouches: tp, changedTouches: tp }));
      el.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: tp }));
    } catch(e) {}
  }
  el.dispatchEvent(new PointerEvent('pointerdown', o));
  el.dispatchEvent(new MouseEvent('mousedown', o));
  el.dispatchEvent(new PointerEvent('pointerup', o));
  el.dispatchEvent(new MouseEvent('mouseup', o));
  el.dispatchEvent(new MouseEvent('click', o));
}

async function clickTile(tile, multiSelect) {
  const allTiles = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile')].filter(e => e.offsetParent);
  console.log('[amoura] clickTile text:', tile.innerText.trim().slice(0,30));
  const check = () => tile.getAttribute('aria-checked') === 'true';
  if (check()) return true;
  const isTouch = navigator.maxTouchPoints > 0;
  const pType = isTouch ? 'touch' : 'mouse';
  if (!multiSelect) {
    for (const t of allTiles) {
      if (t !== tile && t.getAttribute('aria-checked') === 'true') {
        const r = t.getBoundingClientRect();
        const tcx = r.left+r.width/2, tcy = r.top+r.height/2;
        const o = { bubbles:true, cancelable:true, clientX:tcx, clientY:tcy, pointerId:1, pointerType:pType, isPrimary:true, button:0, view:window };
        if (isTouch) {
          try {
            const _tid = Date.now();
            const ttp = [new Touch({ identifier: _tid, target: t, clientX: tcx, clientY: tcy, pageX: tcx + window.scrollX, pageY: tcy + window.scrollY })];
            t.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: ttp, targetTouches: ttp, changedTouches: ttp }));
            t.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: ttp }));
          } catch(e) {}
        }
        t.dispatchEvent(new PointerEvent('pointerdown', o));
        await sleep(_gr(55,15,30,90));
        t.dispatchEvent(new PointerEvent('pointerup', o));
        await sleep(_gr(200,50,120,320));
      }
    }
  }
  tile.scrollIntoView({block:'center',behavior:'smooth'});
  await sleep(_gr(130,30,80,200));
  await _simMousePath(tile);
  const rect = tile.getBoundingClientRect();
  const cx = rect.left+rect.width/2, cy = rect.top+rect.height/2;
  const opts = { bubbles:true, cancelable:true, clientX:cx, clientY:cy, pointerId:1, pointerType:pType, isPrimary:true, button:0, view:window };
  if (isTouch) {
    try {
      const _tid = Date.now();
      const tp = [new Touch({ identifier: _tid, target: tile, clientX: cx, clientY: cy, pageX: cx + window.scrollX, pageY: cy + window.scrollY })];
      tile.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: tp, targetTouches: tp, changedTouches: tp }));
      await sleep(_gr(65,18,35,110));
      tile.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: tp }));
    } catch(e) {}
  }
  tile.dispatchEvent(new PointerEvent('pointerdown', opts));
  await sleep(_gr(65,18,35,110));
  tile.dispatchEvent(new PointerEvent('pointerup', opts));
  tile.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:cx, clientY:cy, view:window }));
  await sleep(_gr(260,50,160,380));
  if (check()) { console.log('[amoura] clickTile ok'); return true; }
  reactClick(tile);
  await sleep(_gr(260,50,160,380));
  if (check()) { console.log('[amoura] clickTile ok (reactClick)'); return true; }
  const inner = document.elementFromPoint(cx, cy);
  if (inner && inner !== tile) {
    inner.dispatchEvent(new PointerEvent('pointerdown', opts));
    await sleep(_gr(65,18,35,110));
    inner.dispatchEvent(new PointerEvent('pointerup', opts));
    inner.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:cx, clientY:cy, view:window }));
    await sleep(_gr(260,50,160,380));
    if (check()) { console.log('[amoura] clickTile ok (inner)'); return true; }
    reactClick(inner);
    await sleep(_gr(260,50,160,380));
    if (check()) { console.log('[amoura] clickTile ok (inner reactClick)'); return true; }
  }

  try { tile.focus(); tile.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true, cancelable: true, view: window })); await sleep(_gr(40,12,20,75)); tile.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true, cancelable: true, view: window })); } catch(e) {}
  await sleep(_gr(210,45,130,320));
  if (check()) { console.log('[amoura] clickTile ok (keyspace)'); return true; }
  console.log('[amoura] clickTile: DOM fallback');
  if (!multiSelect) { for (const t of allTiles) { if (t !== tile) { t.setAttribute('aria-checked','false'); t.classList.remove('selected'); } } }
  tile.setAttribute('aria-checked','true'); tile.classList.add('selected');
  const pk = Object.keys(tile).find(k => k.startsWith('__reactProps$'));
  if (pk && tile[pk]) {
    const props = tile[pk];
    if (typeof props.onClick === 'function') {
      try { props.onClick(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window })); } catch(e) {}
    } else {
      props['aria-checked'] = true;
    }
  }
  return true;
}

function dismissDialog() {
  const crispGotIt = [...document.querySelectorAll('button.crisp-button')].find(b => b.offsetParent && /got it|entendido/i.test(b.innerText));
  if (crispGotIt) { reactClick(crispGotIt); return true; }
  const btn = [...document.querySelectorAll('button')].find(b => b.offsetParent && /go back|got it|try again|entendido|volver|intentar de nuevo/i.test(b.innerText));
  if (btn) { reactClick(btn); return true; }
  return false;
}

async function clickSubmit() {
  const btns = [...document.querySelectorAll('button')];
  for (const btn of btns) {
    if (btn.disabled || !btn.offsetParent) continue;
    const txt = btn.innerText.trim().toLowerCase();
    const cls = btn.className || '';
    if (/^(submit|enviar|check|comprobar|check my answer|verificar mi respuesta)$/.test(txt) || (cls.includes('crisp-button') && /^(submit|enviar|check|comprobar)$/.test(txt)) || (cls.includes('crisp') && !cls.includes('nav') && !cls.includes('search') && /^(submit|enviar|check|comprobar)$/.test(txt))) { await _simMousePath(btn); reactClick(btn); return true; }
  }
  const fallback = document.querySelector('button.crisp-button:not([disabled])');
  if (fallback && fallback.offsetParent && /^(submit|enviar|check|comprobar)$/.test(fallback.innerText.trim().toLowerCase())) { await _simMousePath(fallback); reactClick(fallback); return true; }
  return false;
}

async function typeMathEditor(el, text) {
  el.focus(); el.click();
  const mqField = document.querySelector('.mq-editable-field, [class*="mq-editable"], [class*="mathquill"] .mq-textarea textarea');
  const target = mqField || el.querySelector('textarea') || el;
  target.focus();
  for (const char of text) {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
    target.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') target.value += char;
    target.dispatchEvent(new InputEvent('input', { data: char, inputType: 'insertText', bubbles: true }));
    target.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
    await sleep(_gr(45,15,20,110));
  }
}

async function typeSymPad(el, text) {
  const fiArea = el.querySelector?.('.symPadFIArea') || el.closest?.('.bundle.symPad')?.querySelector('.symPadFIArea') || el;
  const clickBox = el.querySelector?.('.aitContentBox') || fiArea.querySelector?.('.aitContentBox') || el;

  function getProxy() {
    return el.querySelector('input.proxy-input') || document.querySelector('input.proxy-input') || document.activeElement;
  }

  let proxy = el.querySelector('input.proxy-input');
  if (proxy) {

    const contentEl = el.querySelector('.yui3-sympadfiwidget-content') || el;
    contentEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    contentEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    contentEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    proxy.focus();
    await sleep(120);
  } else {

    if (navigator.maxTouchPoints > 0) {
      try {
        const cbr = clickBox.getBoundingClientRect();
        const cbcx = cbr.left + cbr.width/2, cbcy = cbr.top + cbr.height/2;
        const _tid = Date.now();
        const tp = [new Touch({ identifier: _tid, target: clickBox, clientX: cbcx, clientY: cbcy, pageX: cbcx + window.scrollX, pageY: cbcy + window.scrollY })];
        clickBox.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: tp, targetTouches: tp, changedTouches: tp }));
        clickBox.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: tp }));
      } catch(e) {}
    }
    clickBox.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    clickBox.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    clickBox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    clickBox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    clickBox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    clickBox.focus();
    await sleep(200);
    proxy = el.querySelector('input.proxy-input') || document.querySelector('input.proxy-input');
    if (!proxy) {
      clickBox.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      clickBox.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      clickBox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await sleep(200);
      proxy = getProxy();
    }
  }
  if (!proxy || proxy === document.body) { console.log('[amoura] sympad: no proxy-input found'); return; }
  console.log('[amoura] sympad proxy:', proxy.tagName, proxy.className, 'in widget:', el.id);
  proxy.focus();

  const _isMac = /Mac|iPad|iPhone|iPod/.test(navigator.platform) || (navigator.userAgent.includes('Mac') && navigator.maxTouchPoints > 0);
  const selMod = _isMac ? { metaKey: true } : { ctrlKey: true };
  proxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', keyCode: 65, which: 65, ...selMod, bubbles: true, cancelable: true }));
  proxy.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', code: 'KeyA', keyCode: 65, which: 65, ...selMod, bubbles: true, cancelable: true }));
  await sleep(50);
  proxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8, bubbles: true, cancelable: true }));
  proxy.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8, bubbles: true, cancelable: true }));
  await sleep(30);
  proxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', code: 'Delete', keyCode: 46, which: 46, bubbles: true, cancelable: true }));
  proxy.dispatchEvent(new KeyboardEvent('keyup', { key: 'Delete', code: 'Delete', keyCode: 46, which: 46, bubbles: true, cancelable: true }));
  await sleep(50);

  let clean = text
    .replace(/\\sqrt\[3\]\{([^}]*)\}/g, 'cbrt($1)')
    .replace(/\\sqrt\[n\]\{([^}]*)\}/g, 'cbrt($1)')
    .replace(/\\cbrt\{([^}]*)\}/g, 'cbrt($1)')
    .replace(/cbrt\{([^}]*)\}/g, 'cbrt($1)')
    .replace(/sqrt\{([^}]*)\}/g, 'sqrt($1)')
    .replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)').replace(/\\sqrt\s*/g, 'sqrt')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)').replace(/\^{([^}]*)}/g, '^($1)')
    .replace(/\\pi/g, 'pi').replace(/\\cdot/g, '*')
    .replace(/\\ln\b/g, 'ln').replace(/\\log\b/g, 'log')
    .replace(/\\arcsin\b/g, 'arcsin').replace(/\\arccos\b/g, 'arccos').replace(/\\arctan\b/g, 'arctan')
    .replace(/\\sin\b/g, 'sin').replace(/\\cos\b/g, 'cos').replace(/\\tan\b/g, 'tan')
    .replace(/\\sec\b/g, 'sec').replace(/\\csc\b/g, 'csc').replace(/\\cot\b/g, 'cot')
    .replace(/\\left\(/g, '(').replace(/\\right\)/g, ')')
    .replace(/\barc(sin|cos|tan|sec|csc|cot)\s*\(/gi, (m, fn) => fn.toLowerCase() + '^(-1)(')
    .replace(/(sin|cos|tan|sec|csc|cot)\^-1\s*\(/gi, (m, fn) => fn.toLowerCase() + '^(-1)(')
    .replace(/(sin|cos|tan|sec|csc|cot)-1\s*\(/gi, (m, fn) => fn.toLowerCase() + '^(-1)(');
  console.log('[amoura] sympad clean:', clean);

  async function typeChar(c) {
    proxy = getProxy(); proxy.focus();

    const origVal = proxy.value || '';
    proxy.value = origVal + c;
    const kOpts = { key: c, code: 'Key' + c.toUpperCase(), charCode: c.charCodeAt(0), keyCode: c.charCodeAt(0), which: c.charCodeAt(0), bubbles: true, cancelable: true };
    proxy.dispatchEvent(new KeyboardEvent('keydown', kOpts));
    proxy.dispatchEvent(new KeyboardEvent('keypress', kOpts));
    proxy.dispatchEvent(new InputEvent('input', { data: c, inputType: 'insertText', bubbles: true }));
    proxy.dispatchEvent(new KeyboardEvent('keyup', kOpts));

    const mqTA = (el.querySelector?.('.mq-textarea textarea')) || document.querySelector('.mq-textarea textarea');
    if (mqTA && mqTA !== proxy) {
      mqTA.focus();
      mqTA.value = c;
      mqTA.dispatchEvent(new KeyboardEvent('keydown', kOpts));
      mqTA.dispatchEvent(new InputEvent('input', { data: c, inputType: 'insertText', bubbles: true }));
      mqTA.dispatchEvent(new KeyboardEvent('keyup', kOpts));
      proxy.focus();
    }
    await sleep(_gr(45,15,20,110) + (Math.random()<0.06 ? _gr(180,60,80,350) : 0));
  }

  async function pressKey(key) {
    proxy = getProxy(); proxy.focus();
    const kc = key === 'ArrowRight' ? 39 : key === 'ArrowLeft' ? 37 : key === 'ArrowDown' ? 40 : key === 'ArrowUp' ? 38 : key === 'Tab' ? 9 : key === 'Backspace' ? 8 : 0;
    const kOpts = { key, code: key, keyCode: kc, which: kc, bubbles: true, cancelable: true };
    proxy.dispatchEvent(new KeyboardEvent('keydown', kOpts));
    proxy.dispatchEvent(new KeyboardEvent('keyup', kOpts));
    const mqTA = (el.querySelector?.('.mq-textarea textarea')) || document.querySelector('.mq-textarea textarea');
    if (mqTA && mqTA !== proxy) {
      mqTA.dispatchEvent(new KeyboardEvent('keydown', kOpts));
      mqTA.dispatchEvent(new KeyboardEvent('keyup', kOpts));
    }
    await sleep(_gr(50,18,25,120));
  }

  async function clickAIT(label) {
    const btns = [...document.querySelectorAll('.symPadButton[aria-label]')].filter(b => b.offsetParent);
    for (const btn of btns) {
      if (btn.getAttribute('aria-label').toLowerCase().includes(label)) {
        if (navigator.maxTouchPoints > 0) {
          try {
            const br = btn.getBoundingClientRect();
            const bcx = br.left + br.width/2, bcy = br.top + br.height/2;
            const _tid = Date.now();
            const tp = [new Touch({ identifier: _tid, target: btn, clientX: bcx, clientY: bcy, pageX: bcx + window.scrollX, pageY: bcy + window.scrollY })];
            btn.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: tp, targetTouches: tp, changedTouches: tp }));
            btn.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: tp }));
          } catch(e) {}
        }
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await sleep(100);
        proxy = getProxy(); proxy.focus();
        return true;
      }
    }
    return false;
  }

  async function typeTokens(str) {
    let i = 0;
    while (i < str.length) {

      const invTrigM = str.slice(i).match(/^(sin|cos|tan|sec|csc|cot)\^\(-1\)\s*\(/i);
      if (invTrigM) {
        const fn = invTrigM[1].toLowerCase();
        const invAitMap = { sin: 'inverse sine', cos: 'inverse cosine', tan: 'inverse tangent', sec: 'inverse secant', csc: 'inverse cosecant', cot: 'inverse cotangent' };
        i += invTrigM[0].length;
        let depth = 1, inner = '';
        while (i < str.length && depth > 0) {
          if (str[i] === '(') depth++;
          else if (str[i] === ')') { depth--; if (depth === 0) { i++; break; } }
          inner += str[i++];
        }
        const clicked = await clickAIT(invAitMap[fn]);
        if (clicked) { await typeTokens(inner); await pressKey('ArrowRight'); }
        else {

          for (const c of fn) await typeChar(c);
          const expClicked = await clickAIT('exponent');
          if (expClicked) { await typeChar('-'); await typeChar('1'); await pressKey('ArrowRight'); }
          else { for (const c of '^(-1)') await typeChar(c); }
          await typeChar('('); await typeTokens(inner); await typeChar(')');
        }
        continue;
      }
      const funcM = str.slice(i).match(/^(cbrt|ln|log|abs|sin|cos|tan|sec|csc|cot)\s*\(/i);
      if (funcM) {
        const fn = funcM[1].toLowerCase();
        const aitMap = { cbrt: 'cube root', ln: 'natural log', log: 'log', abs: 'absolute value', sin: 'sine', cos: 'cosine', tan: 'tangent', sec: 'secant', csc: 'cosecant', cot: 'cotangent' };
        i += funcM[0].length;
        let depth = 1, inner = '';
        while (i < str.length && depth > 0) {
          if (str[i] === '(') depth++;
          else if (str[i] === ')') { depth--; if (depth === 0) { i++; break; } }
          inner += str[i++];
        }
        const clicked = await clickAIT(aitMap[fn]);
        if (clicked) { await typeTokens(inner); await pressKey('ArrowRight'); }
        else { for (const c of (fn + '(' + inner + ')')) await typeChar(c); }
      } else if (str.slice(i, i + 5).toLowerCase() === 'sqrt(' || str.slice(i, i + 5).toLowerCase() === 'sqrt{') {
        const open = str[i + 4];
        const close = open === '(' ? ')' : '}';
        i += 5;
        let depth = 1, inner = '';
        while (i < str.length && depth > 0) {
          if (str[i] === open) depth++;
          else if (str[i] === close) { depth--; if (depth === 0) { i++; break; } }
          inner += str[i++];
        }
        const clicked = await clickAIT('square root');
        if (clicked) {
          await typeTokens(inner);
          await pressKey('ArrowRight');
        } else {
          for (const c of ('sqrt(' + inner + ')')) await typeChar(c);
        }
      } else if (str[i] === '^') {
        i++;
        let inner = '';
        if (i < str.length && (str[i] === '(' || str[i] === '{')) {
          const open = str[i], close = open === '(' ? ')' : '}';
          i++;
          let depth = 1;
          while (i < str.length && depth > 0) {
            if (str[i] === open) depth++;
            else if (str[i] === close) { depth--; if (depth === 0) { i++; break; } }
            inner += str[i++];
          }
        } else if (i < str.length) {

          if (str[i] === '-' || str[i] === '+') {
            inner = str[i++];
            while (i < str.length && /\d/.test(str[i])) inner += str[i++];
          } else {
            inner = str[i++];
          }
        }

        if (inner === '2' || inner === '3') {
          const shortcut = await clickAIT('exponent of ' + inner);
          if (shortcut) continue;
        }
        const clicked = await clickAIT('exponent');
        if (clicked) {
          await typeTokens(inner);
          await pressKey('ArrowRight');
        } else {
          for (const c of ('^' + inner)) await typeChar(c);
        }
      } else if (str.slice(i, i + 2).toLowerCase() === 'pi' && (i + 2 >= str.length || !/[a-z]/i.test(str[i + 2]))) {
        const clicked = await clickAIT('pi');
        if (!clicked) { await typeChar('p'); await typeChar('i'); }
        i += 2;
      } else if (str[i] === '(' || /\d/.test(str[i])) {

        let numStr = null, denStr = null, advance = 0;
        if (str[i] === '(') {

          let j = i + 1, d = 1, ns = '';
          while (j < str.length && d > 0) {
            if (str[j] === '(') d++;
            else if (str[j] === ')') { if (--d === 0) break; }
            if (d > 0) ns += str[j];
            j++;
          }

          if (d === 0 && j + 1 < str.length && str[j + 1] === '/') {
            let denStart = j + 2, ds = '', iAfter = denStart;
            if (denStart < str.length && str[denStart] === '(') {
              let k = denStart + 1, d2 = 1;
              while (k < str.length && d2 > 0) {
                if (str[k] === '(') d2++;
                else if (str[k] === ')') { if (--d2 === 0) break; }
                if (d2 > 0) ds += str[k];
                k++;
              }
              iAfter = k + 1;
            } else {
              while (iAfter < str.length && /[0-9a-zA-Z.]/.test(str[iAfter])) ds += str[iAfter++];
            }
            if (ds) { numStr = ns; denStr = ds; advance = iAfter - i; }
          }
        } else {

          const m = str.slice(i).match(/^(\d+)\/(\d+)/);
          if (m) { numStr = m[1]; denStr = m[2]; advance = m[0].length; }
        }
        if (numStr !== null && denStr !== null) {
          const clicked = await clickAIT('fraction');
          if (clicked) {
            i += advance;
            await typeTokens(numStr);
            await pressKey('Tab');
            await sleep(100);
            await typeTokens(denStr);
            await pressKey('Tab');
            await sleep(100);
          } else {

            i += advance;
            for (const c of numStr) await typeChar(c);
            await typeChar('/');
            await sleep(100);
            for (const c of denStr) await typeChar(c);
            await pressKey('ArrowRight');
          }
        } else {
          await typeChar(str[i++]);
        }
      } else {
        await typeChar(str[i++]);
      }
    }
  }

  await typeTokens(clean);
}

async function simulatePointerDrag(fromEl, toEl) {
  const fr = fromEl.getBoundingClientRect();
  const tr = toEl.getBoundingClientRect();
  const srcX = fr.left + fr.width * 0.5;
  const srcY = fr.top + fr.height * 0.5;
  const tgtX = tr.left + tr.width * 0.5;
  const tgtY = tr.top + tr.height * 0.5;

  const inner = fromEl.querySelector('.draggableExpressionContainer') || fromEl.querySelector('span') || fromEl;

  const origSet = Element.prototype.setPointerCapture;
  const origRel = Element.prototype.releasePointerCapture;
  const origHas = Element.prototype.hasPointerCapture;
  const captureState = new Map();

  Element.prototype.setPointerCapture = function(pid) { captureState.set(pid, this); };
  Element.prototype.releasePointerCapture = function(pid) { captureState.delete(pid); };
  Element.prototype.hasPointerCapture = function(pid) { return captureState.get(pid) === this; };

  const nextFrame = () => new Promise(r => requestAnimationFrame(r));

  const _pType = navigator.maxTouchPoints > 0 ? 'touch' : 'mouse';

  const mk = (type, x, y, btns) => new PointerEvent(type, {
    bubbles: true, cancelable: true,
    pointerId: 1, pointerType: _pType, isPrimary: true,
    button: 0, buttons: btns, clientX: x, clientY: y,
    screenX: x, screenY: y,
    pressure: btns ? 0.5 : 0, width: 1, height: 1,
  });

  try {

    const mkMouse = (type, x, y, btns) => new MouseEvent(type, {
      bubbles: true, cancelable: true,
      button: 0, buttons: btns, clientX: x, clientY: y,
      screenX: x, screenY: y, view: window,
    });

    inner.dispatchEvent(mk('pointerdown', srcX, srcY, 1));
    inner.dispatchEvent(mkMouse('mousedown', srcX, srcY, 1));

    for (let h = 0; h < 9; h++) {
      await nextFrame();
      inner.dispatchEvent(mk('pointermove', srcX, srcY, 1));
      inner.dispatchEvent(mkMouse('mousemove', srcX, srcY, 1));
    }

    await nextFrame();
    inner.dispatchEvent(mk('pointermove', srcX + 2, srcY - 2, 1));
    inner.dispatchEvent(mkMouse('mousemove', srcX + 2, srcY - 2, 1));
    await nextFrame();
    inner.dispatchEvent(mk('pointermove', srcX + 4, srcY - 4, 1));
    inner.dispatchEvent(mkMouse('mousemove', srcX + 4, srcY - 4, 1));

    const steps = 28;
    for (let s = 1; s <= steps; s++) {
      await nextFrame();
      const x = srcX + (tgtX - srcX) * s / steps;
      const y = srcY + (tgtY - srcY) * s / steps;
      const cap = captureState.get(1);
      const tgt = cap || document.elementFromPoint(x, y) || inner;
      tgt.dispatchEvent(mk('pointermove', x, y, 1));
      tgt.dispatchEvent(mkMouse('mousemove', x, y, 1));
    }

    await nextFrame();
    const cap = captureState.get(1);
    const upTgt = cap || document.elementFromPoint(tgtX, tgtY) || inner;
    upTgt.dispatchEvent(mk('pointerup', tgtX, tgtY, 0));
    upTgt.dispatchEvent(mkMouse('mouseup', tgtX, tgtY, 0));

    await sleep(400);
  } finally {
    Element.prototype.setPointerCapture = origSet;
    Element.prototype.releasePointerCapture = origRel;
    Element.prototype.hasPointerCapture = origHas;
    captureState.clear();
  }
}

async function yuiSortItems(container, desiredOrder) {

  let Y = null;
  if (typeof YUI !== 'undefined' && YUI.Env && YUI.Env._instances) {
    for (const key in YUI.Env._instances) {
      try {
        const inst = YUI.Env._instances[key];
        if (inst && inst.DD && inst.DD.DDM) { Y = inst; break; }
      } catch (e) {}
    }
  }
  console.log('[amoura] order yui: sandbox found:', !!Y);

  for (const item of desiredOrder) container.appendChild(item);
  console.log('[amoura] order yui: DOM reordered to:', desiredOrder.map(e => e.innerText.trim().slice(0, 25)));

  if (!Y) {

    const item0 = desiredOrder[0];
    if (item0) {
      const fk = Object.keys(item0).find(k => /^__reactFiber|^__reactInternal/.test(k));
      if (fk) {
        let fiber = item0[fk];
        for (let i = 0; i < 30 && fiber; i++, fiber = fiber.return) {
          const p = fiber.memoizedProps;
          if (p && typeof p.updateAnswer === 'function' && p.items) {
            try { p.updateAnswer(p.items); console.log('[amoura] order: React updateAnswer called'); return true; } catch (e) {}
          }
        }
      }
    }
    console.log('[amoura] order: no YUI DD and no React fiber — DOM reorder only');
    return false;
  }

  const ddm = Y.DD.DDM;

  const containerDrags = [];
  const tryAddDrags = (store) => {
    if (!store) return;
    const arr = Array.isArray(store) ? store : Object.values(store);
    for (const d of arr) {
      try {
        const node = d.get && d.get('node');
        if (!node) continue;
        const dom = node._node || (node.getDOMNode && node.getDOMNode());
        if (dom && container.contains(dom)) containerDrags.push(d);
      } catch (e) {}
    }
  };
  tryAddDrags(ddm._drags);
  tryAddDrags(ddm._regDrag);
  tryAddDrags(ddm._valid);

  const containerDrops = [];
  const tryAddDrops = (store) => {
    if (!store) return;
    const arr = Array.isArray(store) ? store : Object.values(store);
    for (const d of arr) {
      try {
        const node = d.get && d.get('node');
        if (!node) continue;
        const dom = node._node || (node.getDOMNode && node.getDOMNode());
        if (dom && (dom === container || container.contains(dom))) containerDrops.push(d);
      } catch (e) {}
    }
  };
  tryAddDrops(ddm._targets);
  tryAddDrops(ddm._drops);

  console.log('[amoura] order yui: drags:', containerDrags.length, 'drops:', containerDrops.length);

  if (containerDrags.length > 0) {
    const drag = containerDrags[0];
    const drop = containerDrops.length > 0 ? containerDrops[0] : null;
    const evData = { drag: drag, drop: drop, target: drag };
    try { ddm._activeDrag = drag; } catch (e) {}
    try { ddm.fire('drag:start', evData); } catch (e) { console.log('[amoura] order yui: drag:start err:', e.message); }
    try { ddm.fire('drag:drag', evData); } catch (e) {}
    if (drop) {
      try { ddm.fire('drag:over', evData); } catch (e) {}
      try { ddm.fire('drop:over', evData); } catch (e) {}
      try { ddm.fire('drop:hit', evData); } catch (e) {}
    }
    try { ddm.fire('drag:end', evData); } catch (e) { console.log('[amoura] order yui: drag:end err:', e.message); }
    try { drag.fire('drag:end', evData); } catch (e) {}
    try { ddm._activeDrag = null; } catch (e) {}
    console.log('[amoura] order yui: fired drag events on DDM');
  }

  try {
    if (Y.Sortable && Y.Sortable._sortables) {
      for (const s of Y.Sortable._sortables) {
        try { s.delegate && s.delegate.syncTargets(); } catch (e) {}
      }
    }
  } catch (e) {}
  try {
    const delegates = ddm._delegates || [];
    for (const del of delegates) {
      try { del.syncTargets(); } catch (e) {}
    }
  } catch (e) {}

  try {
    const yContainer = Y.one(container);
    if (yContainer) {
      yContainer.fire('drop:hit');
      yContainer.fire('sort');
      console.log('[amoura] order yui: fired events on container node');
    }
  } catch (e) {}

  return true;
}

async function simulateDrag(source, target) {
  const srcRect = source.getBoundingClientRect();
  const tgtRect = target.getBoundingClientRect();
  const srcX = srcRect.left + srcRect.width / 2;
  const srcY = srcRect.top + srcRect.height / 2;
  const tgtX = tgtRect.left + tgtRect.width / 2;
  const tgtY = tgtRect.top + tgtRect.height / 2;
  const _isTouch = navigator.maxTouchPoints > 0;
  try {
    if (_isTouch) {
      const _tid = Date.now();
      const mkTouch = (el, x, y) => new Touch({ identifier: _tid, target: el, clientX: x, clientY: y, pageX: x + window.scrollX, pageY: y + window.scrollY });
      const t1 = mkTouch(source, srcX, srcY);
      source.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches:[t1], targetTouches:[t1], changedTouches:[t1] }));
      await sleep(80);
      const steps = 5;
      for (let s = 1; s <= steps; s++) {
        const mx = srcX + (tgtX - srcX) * s / steps;
        const my = srcY + (tgtY - srcY) * s / steps;
        const mt = mkTouch(source, mx, my);
        source.dispatchEvent(new TouchEvent('touchmove', { bubbles:true, cancelable:true, touches:[mt], targetTouches:[mt], changedTouches:[mt] }));
        await sleep(30);
      }
      const t2 = mkTouch(source, tgtX, tgtY);
      source.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches:[], targetTouches:[], changedTouches:[t2] }));
      await sleep(100);
    }
    const dt = new DataTransfer();
    dt.setData('text/plain', source.innerText || '');
    source.dispatchEvent(new PointerEvent('pointerdown', { clientX: srcX, clientY: srcY, bubbles: true }));
    source.dispatchEvent(new MouseEvent('mousedown', { clientX: srcX, clientY: srcY, bubbles: true }));
    await sleep(50);
    source.dispatchEvent(new DragEvent('dragstart', { clientX: srcX, clientY: srcY, dataTransfer: dt, bubbles: true, cancelable: true }));
    await sleep(50);
    target.dispatchEvent(new DragEvent('dragenter', { clientX: tgtX, clientY: tgtY, dataTransfer: dt, bubbles: true, cancelable: true }));
    target.dispatchEvent(new DragEvent('dragover', { clientX: tgtX, clientY: tgtY, dataTransfer: dt, bubbles: true, cancelable: true }));
    await sleep(50);
    target.dispatchEvent(new DragEvent('drop', { clientX: tgtX, clientY: tgtY, dataTransfer: dt, bubbles: true, cancelable: true }));
    await sleep(50);
    source.dispatchEvent(new DragEvent('dragend', { clientX: tgtX, clientY: tgtY, dataTransfer: dt, bubbles: true }));
    source.dispatchEvent(new PointerEvent('pointerup', { clientX: tgtX, clientY: tgtY, bubbles: true }));
    source.dispatchEvent(new MouseEvent('mouseup', { clientX: tgtX, clientY: tgtY, bubbles: true }));
    console.log('[amoura] drag simulated:', source.innerText.trim().slice(0,30), '->', target.className?.slice(0,40));
  } catch(e) { console.log('[amoura] drag error:', e.message); }
}

async function fillAnswer(answerText, qType) {
  if (qType.type === 'order' && qType.container && qType.items) {

    const lines = answerText.split('\n').map(l => l.replace(/^\d+[.:)]\s+/, '').trim()).filter(Boolean);

    const allItems = () => [...qType.container.querySelectorAll(':scope > [class*="order-items-item"]')];
    const normalize = s => s.replace(/\s+/g, ' ').trim();
    const findItemByText = (targetText) => {
      const nt = normalize(targetText);
      return allItems().find(el => {
        const t = normalize(el.innerText);
        return t === nt || nt.includes(t) || t.includes(nt);
      });
    };

    const matchedTexts = lines.filter(l => findItemByText(l));
    if (matchedTexts.length < 2) {
      console.log('[amoura] order: could only match', matchedTexts.length, 'of', lines.length, 'lines to DOM items');
      return false;
    }

    const desiredOrder = matchedTexts.map(t => findItemByText(t)).filter(Boolean);
    if (desiredOrder.length < 2) {
      console.log('[amoura] order: could not resolve DOM elements for desired order');
      return false;
    }

    const yuiOk = await yuiSortItems(qType.container, desiredOrder);
    console.log('[amoura] order: yuiSortItems result:', yuiOk);
    await sleep(150);

    const finalItems = allItems();
    const finalTexts = finalItems.map(el => normalize(el.innerText));
    const desiredTexts = matchedTexts.map(t => normalize(t));
    const orderCorrect = desiredTexts.every((t, i) => {
      const ft = finalTexts[i] || '';
      return ft === t || ft.includes(t) || t.includes(ft);
    });
    console.log('[amoura] order: DOM order correct:', orderCorrect, 'final:', finalTexts.map(t => t.slice(0, 25)));

    return true;
  }
  if (qType.type === 'lineplot' && qType.columns) {

    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    const counts = [];
    for (const line of lines) {
      const m = line.match(/(\d+)\s*$/);
      if (m) counts.push(parseInt(m[1]));
    }
    if (!counts.length) {

      const csv = answerText.match(/\d+/g);
      if (csv) csv.forEach(n => counts.push(parseInt(n)));
    }
    console.log('[amoura] lineplot counts:', counts, 'columns:', qType.columns.length);
    for (let ci = 0; ci < qType.columns.length && ci < counts.length; ci++) {
      const want = counts[ci];
      if (want <= 0) continue;
      const col = qType.columns[ci];

      const mcs = [...col.markContainers].filter(mc => mc.querySelector('div.initial')).sort((a, b) => {
        const aInit = a.querySelector('div.initial');
        const bInit = b.querySelector('div.initial');
        return (parseInt(bInit.style.top) || 0) - (parseInt(aInit.style.top) || 0);
      });
      let placed = 0;
      for (const mc of mcs) {
        if (placed >= want) break;
        if (mc.classList.contains('isClicked')) { placed++; continue; }

        const initDiv = mc.querySelector('div.initial:not(.invisible-mark)') || mc.querySelector('div.initial');
        let rect = initDiv ? initDiv.getBoundingClientRect() : mc.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) rect = mc.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {

          const colRect = col.el.getBoundingClientRect();
          if (colRect.width > 0) { rect = colRect; } else { console.warn('[amoura] lineplot: zero-size mark, skipping'); continue; }
        }
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        mc.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: 1, view: window }));
        await sleep(50);
        mc.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, button: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: 0, view: window }));
        await sleep(50);
        mc.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, view: window }));
        await sleep(400);
        if (mc.classList.contains('isClicked')) { placed++; console.log('[amoura] lineplot: clicked col', ci, 'mark', placed); }
        else {

          reactClick(mc);
          await sleep(400);
          if (mc.classList.contains('isClicked')) { placed++; console.log('[amoura] lineplot: reactClick col', ci, 'mark', placed); }
          else console.warn('[amoura] lineplot: click failed for col', ci);
        }
      }
    }
    return true;
  }
  if (qType.type === 'graph') {
    const coords = [];
    const pairRegex = /\((-?[\d.]+)\s*,\s*(-?[\d.]+)\)/g;
    let m;
    while ((m = pairRegex.exec(answerText)) !== null) coords.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) });
    if (coords.length && qType.overlay && qType.graphMeta) {
      await plotGraphPoints(qType.overlay, qType.graphMeta, coords);
    } else { console.warn('[amoura] graph: no valid coords parsed from:', answerText); }
    if (qType.mcButtons?.length) {
      await sleep(300);
      const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
      const mcLine = lines.find(l => !/^\(/.test(l) && !/^PLOT/i.test(l)) || lines[lines.length - 1];
      const mcText = mcLine.replace(/^MC:\s*/i, '').trim();
      let btn = qType.mcButtons.find(b => b.innerText.trim().toLowerCase() === mcText.toLowerCase());
      if (!btn) {
        const letter = mcText.toUpperCase()[0];
        const idx = 'ABCDEFGH'.indexOf(letter);
        if (idx >= 0 && qType.mcButtons[idx]) btn = qType.mcButtons[idx];
      }
      if (btn) { reactClick(btn); console.log('[amoura] graph mc clicked:', mcText); }
      else console.warn('[amoura] graph mc: no match for "'+mcText+'" in', qType.mcButtons.map(b => b.innerText.trim()));
    }
    return true;
  }
  if ((qType.type === 'fill-in') && qType.inputs && qType.inputs.length === 1) {
    qType.inputs[0].focus(); await sleep(_gr(55,15,30,85)); reactSet(qType.inputs[0], answerText); await sleep(_gr(210,45,130,310)); return true;
  }
  if (qType.type === 'mixed-fill-mc') {
    const rawLines = answerText.split('\n').map(l => l.trim()).filter(Boolean);

    const lines = [];
    for (const line of rawLines) {
      const inlineGraph = line.match(/^(.*?)\s+GRAPH:\s*([A-H])\s*$/i);
      if (inlineGraph && inlineGraph[1].trim()) {
        lines.push(inlineGraph[1].trim());
        lines.push('GRAPH: ' + inlineGraph[2].toUpperCase());
      } else {
        lines.push(line);
      }
    }

    const freshTiles = [...document.querySelectorAll('[data-testid="SelectableTile"], .SelectableTile')].filter(e => e.offsetParent);
    const tileTexts = freshTiles.map(t => t.innerText.trim().toLowerCase());
    const fillLines = [];
    const mcLines = [];
    for (const line of lines) {
      const clean = line.replace(/^graph:\s*/i, '').trim();
      const isExplicitGraph = /^graph:/i.test(line);
      const cleanLow = clean.toLowerCase();

      const matchesTile = tileTexts.some(t => t === cleanLow || cleanLow.includes(t) || (clean.length > 4 && t.includes(cleanLow)));
      const isLetter = /^[A-H]$/i.test(clean);
      if (isExplicitGraph || matchesTile || isLetter) {
        mcLines.push(clean);
      } else {
        fillLines.push(clean);
      }
    }

    const _mfQA = document.querySelector('.ixl-practice-crate, [class*="question"], .qreactbridge, main') || document.body;
    const _mfFills = [...document.querySelectorAll('input.fillIn:not([disabled])')].filter(i => i.offsetParent);
    const _mfPlain = [..._mfQA.querySelectorAll('input[type="text"]:not([disabled]):not([class*="nav"]):not([class*="search"]):not([class*="header"]):not([role="combobox"]), input:not([type]):not([disabled])')].filter(i => i.offsetParent && !i.closest('[class*="nav"],[class*="header"],[class*="search"]'));
    const freshInputs = _mfFills.length ? _mfFills : (_mfPlain.length ? _mfPlain : qType.inputs);
    console.log('[amoura] mixed-fill inputs: fresh=' + freshInputs.length + ' stored=' + qType.inputs.length + ' fillLines=' + JSON.stringify(fillLines) + ' mcLines=' + JSON.stringify(mcLines));
    for (let i = 0; i < freshInputs.length && i < fillLines.length; i++) { freshInputs[i].focus(); await sleep(_gr(55,15,30,85)); reactSet(freshInputs[i], fillLines[i]); console.log('[amoura] filled input ' + i + ' → ' + fillLines[i]); await sleep(_gr(130,30,80,200)); }
    for (const mcText of mcLines) {
      await sleep(150);
      const letter = mcText[0];
      const idx = 'ABCDEFGH'.indexOf(letter.toUpperCase());
      const target = (idx >= 0 && mcText.length === 1 && freshTiles[idx]) ? freshTiles[idx]
        : freshTiles.find(o => o.innerText.trim().toLowerCase().includes(mcText.toLowerCase())) || qType.options.find(o => o.innerText.trim().toLowerCase().includes(mcText.toLowerCase()));
      if (target) { await clickTile(target, qType.multiSelect); }
    }
    return true;
  }
  if (qType.type === 'multi-fill') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < qType.inputs.length; i++) { qType.inputs[i].focus(); await sleep(_gr(55,15,30,85)); reactSet(qType.inputs[i], lines[i] || ''); await sleep(_gr(130,30,80,200)); }
    return true;
  }
  if (qType.type === 'frac-inputs') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < qType.inputs.length; i++) { qType.inputs[i].focus(); await sleep(_gr(55,15,30,85)); reactSet(qType.inputs[i], lines[i] || ''); await sleep(_gr(130,30,80,200)); }
    return true;
  }
  if (qType.type === 'multi-sympad') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    const fieldCount = qType.inputCount || qType.inputs.length;
    const widgets = qType.widgets || [qType.el];
    for (let i = 0; i < fieldCount; i++) {
      const val = lines[i] || '';
      if (!val) continue;

      const prevProxy = document.querySelector('input.proxy-input');
      if (prevProxy) {
        prevProxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
        prevProxy.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
        prevProxy.blur();
      }
      document.body.click();
      await sleep(100);

      const targetWidget = widgets[i] || widgets[widgets.length - 1] || qType.el;
      await typeSymPad(targetWidget, val);
      await sleep(80);
    }
    const proxyMs = document.querySelector('input.proxy-input');
    if (proxyMs) {
      proxyMs.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
      proxyMs.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
      proxyMs.blur();
    }
    document.body.click();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await sleep(200);
    return true;
  }
  if (qType.type === 'sympad') {
    await typeSymPad(qType.el, answerText);

    const proxy = document.querySelector('input.proxy-input');
    if (proxy) {
      proxy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
      proxy.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true }));
      proxy.blur();
    }
    document.body.click();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await sleep(500);
    return true;
  }
  if (qType.type === 'math-editor') { await typeMathEditor(qType.el, answerText); await sleep(_gr(210,45,130,310)); return true; }
  if (qType.type === 'select-words') {
    for (const opt of qType.options) { if (opt.classList.contains('select-words-chunk-selected')) { reactClick(opt); await sleep(_gr(85,20,50,130)); } }
    await sleep(_gr(110,25,65,170));
    const nums = answerText.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    if (nums.length) {
      for (const n of nums) { if (qType.options[n - 1]) { reactClick(qType.options[n - 1]); await sleep(_gr(210,45,130,310)); } }
      return true;
    }
    const phrases = answerText.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
    let matched = false;
    for (const phrase of phrases) {
      for (const opt of qType.options) {
        if (opt.innerText.trim().toLowerCase() === phrase || opt.innerText.trim().toLowerCase().includes(phrase)) {
          reactClick(opt); await sleep(_gr(210,45,130,310)); matched = true; break;
        }
      }
    }
    return matched;
  }
  if (qType.type === 'audio-spell') {
    const freshBlanks = [...document.querySelectorAll('input.fillIn:not([disabled]), textarea.fill-in:not([disabled])')].filter(e => e.offsetParent);
    if (freshBlanks.length) {
      freshBlanks[0].focus(); await sleep(_gr(55,15,30,85));
      reactSet(freshBlanks[0], answerText);
      await sleep(_gr(130,30,80,200));
      console.log('[amoura] audio-spell: typed', answerText);
      return true;
    }
    return false;
  }
  if (qType.type === 'correctable') {
    const nums = answerText.split(/[,\n]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
    let clicked = 0;
    for (const n of nums) {
      const target = qType.options.find(el => parseInt(el.getAttribute('choiceindex')) === n) || qType.options[n - 1];
      if (target && !target.classList.contains('corrected')) { reactClick(target); await sleep(_gr(210,45,130,310)); clicked++; }
    }
    if (!clicked) {
      const words = answerText.split(/[,\n]+/).map(w => w.trim().toLowerCase()).filter(Boolean);
      for (const word of words) {
        const target = qType.options.find(el => el.innerText.trim().toLowerCase() === word);
        if (target && !target.classList.contains('corrected')) { reactClick(target); await sleep(_gr(210,45,130,310)); clicked++; }
      }
    }
    console.log('[amoura] correctable: clicked', clicked, 'words');
    return clicked > 0;
  }
  if (qType.type === 'retype') {
    qType.textarea.focus(); await sleep(_gr(55,15,30,85));
    reactSet(qType.textarea, answerText);
    await sleep(_gr(210,45,130,310));
    console.log('[amoura] retype: typed', answerText.length, 'chars');
    return true;
  }
  if (qType.type === 'cloze') {
    if (qType.subType === 'proofread') {
      console.log('[amoura] proofread raw answer:', JSON.stringify(answerText));
      const corrections = {};
      answerText.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
        if (/^none$/i.test(line)) return;
        const m = line.match(/^(\d+)\s*[=:.\-\)]+\s*(.+)/);
        if (m) corrections[parseInt(m[1])] = m[2].trim();
      });
      console.log('[amoura] proofread corrections:', corrections);
      const containers = [...document.querySelectorAll('.select-edit-text-container')].filter(c => c.offsetParent && c.querySelector('.fill-in-box'));
      let applied = 0;
      for (let i = 0; i < containers.length; i++) {
        const c = containers[i];
        const textarea = c.querySelector('textarea.fill-in');
        const clickable = c.querySelector('.select-edit-text-clickable');
        const wordNum = i + 1;
        if (corrections[wordNum] && textarea) {

          if (clickable) { reactClick(clickable); await sleep(180); }
          textarea.focus();
          await sleep(100);

          textarea.select();
          textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', code: 'KeyA', ctrlKey: true, bubbles: true }));
          await sleep(30);

          if (_nativeTextareaSet) _nativeTextareaSet.call(textarea, ''); else textarea.value = '';
          textarea.dispatchEvent(new InputEvent('input', { data: null, inputType: 'deleteContentBackward', bubbles: true }));
          await sleep(30);

          const corrWord = corrections[wordNum];
          for (let ci = 0; ci < corrWord.length; ci++) {
            const ch = corrWord[ci];
            textarea.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keypress', { key: ch, bubbles: true }));
            if (_nativeTextareaSet) _nativeTextareaSet.call(textarea, corrWord.slice(0, ci + 1)); else textarea.value = corrWord.slice(0, ci + 1);
            textarea.dispatchEvent(new InputEvent('input', { data: ch, inputType: 'insertText', bubbles: true }));
            textarea.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
            await sleep(_gr(25, 8, 15, 50));
          }
          await sleep(120);
          console.log('[amoura] proofread: typed word', wordNum, '"' + corrWord + '"');
          applied++;
        }

      }
      console.log('[amoura] proofread: applied', applied, 'corrections,', containers.length - applied, 'unchanged');
      return applied > 0 || containers.length > 0;
    }
    const answers = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    const freshBlanks = [...document.querySelectorAll('textarea.fill-in:not([disabled])')].filter(e => e.offsetParent);
    let filled = 0;
    for (let i = 0; i < Math.min(answers.length, freshBlanks.length); i++) {
      freshBlanks[i].focus(); await sleep(_gr(55,15,30,85));
      reactSet(freshBlanks[i], answers[i]);
      await sleep(_gr(130,30,80,200)); filled++;
    }
    console.log('[amoura] cloze: filled', filled, '/', answers.length, 'blanks');
    return filled > 0;
  }
  if (qType.type === 'mc') {
    const letter = answerText.trim().toUpperCase()[0];
    let idx = 'ABCDEFGH'.indexOf(letter);

    if (idx >= 4 && qType.options && qType.options.length <= 4) {
      const IXL_MAPS = { 4: 0, 5: 1, 6: 2, 7: 3 };
      idx = IXL_MAPS[idx] ?? idx;
      console.log('[amoura] MC: remapped IXL label ' + letter + ' → index ' + idx);
    }

    const freshTiles = [...document.querySelectorAll('[data-testid="SelectableTile"],.SelectableTile')].filter(e => e.offsetParent && (e.innerText.trim().length > 0 || e.querySelector('svg,canvas,img:not([class*="check"])') ));
    const pool = freshTiles.length >= 2 ? freshTiles : qType.options;
    const target = (idx >= 0 && pool[idx]) ? pool[idx]
      : pool.find(o => answerText.trim().length > 1 && o.innerText?.trim().toLowerCase().includes(answerText.trim().toLowerCase()))
      || (idx >= 0 && qType.options[idx])
      || (answerText.trim().length > 1 && qType.options.find(o => o.innerText?.trim().toLowerCase().includes(answerText.trim().toLowerCase())));
    if (!target) return false;
    await clickTile(target); return true;
  }
  if (qType.type === 'radio') {
    const letter = answerText.trim().toUpperCase()[0];
    let idx = 'ABCDEFGH'.indexOf(letter);
    const ansLower = answerText.trim().toLowerCase();
    const target = (idx >= 0 && qType.radioLabels[idx])
      || qType.radioLabels.find((l, i) => { const t = (qType.options[i]?.innerText || l.innerText || '').trim().toLowerCase(); return t === ansLower; })
      || qType.radioLabels.find((l, i) => { const t = (qType.options[i]?.innerText || l.innerText || '').trim().toLowerCase(); return ansLower.includes(t) || t.includes(ansLower); });
    if (!target) return false;
    target.scrollIntoView({block:'center',behavior:'smooth'});
    await sleep(_gr(130,30,80,200));
    reactClick(target);
    await sleep(_gr(260,50,160,380));
    if (!target.classList.contains('selected')) {
      target.click();
      await sleep(_gr(260,50,160,380));
    }
    console.log('[amoura] radio click:', target.innerText?.trim()?.slice(0,30) || 'label');
    return true;
  }
  if (qType.type === 'mc-multi') {
    let letters = answerText.trim().toUpperCase().split(/[,\s]+/).filter(l => /^[A-Z]$/.test(l));

    const maxLetter = String.fromCharCode(65 + (qType.options ? qType.options.length - 1 : 25));
    letters = letters.filter(l => l <= maxLetter);
    if (!letters.length) letters = ['A'];
    letters = [...new Set(letters)];

    const freshTiles = [...document.querySelectorAll('[data-testid="SelectableTile"],.SelectableTile')].filter(e => e.offsetParent && (e.innerText.trim().length > 0 || e.querySelector('svg,canvas,img:not([class*="check"])') ));
    const pool = freshTiles.length >= 2 ? freshTiles : qType.options;
    for (const letter of letters) { const idx = 'ABCDEFGH'.indexOf(letter); if (idx >= 0) { const tile = pool[idx] || qType.options[idx]; if (tile) { await clickTile(tile, true); await sleep(_gr(65,18,35,110)); } } }
    return true;
  }
  if (qType.type === 'multi-select') {
    const nums = answerText.split(',').map(n => parseInt(n.trim())-1).filter(n => !isNaN(n));
    for (const n of nums) { if (qType.checkboxes[n]) { qType.checkboxes[n].click(); await sleep(_gr(35,10,18,60)); } }
    return true;
  }
  if (qType.type === 'checkbox-grid') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length && i < qType.gridData.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim()).filter(Boolean);
      for (const col of cols) {
        const colIdx = parseInt(col) - 1;
        if (!isNaN(colIdx) && colIdx >= 0 && qType.gridData[i].checkboxes[colIdx]) {
          const cb = qType.gridData[i].checkboxes[colIdx];
          const clickTarget = cb.closest('label') || cb.closest('td') || cb;
          reactClick(clickTarget);
          await sleep(_gr(160,35,100,250));
        }
      }
    }
    return true;
  }
  if (qType.type === 'text-select') {
    const nums = answerText.split(',').map(n => parseInt(n.trim())-1).filter(n => !isNaN(n));
    for (const n of nums) { if (qType.options[n]) { reactClick(qType.options[n]); await sleep(_gr(160,35,100,250)); } }
    return true;
  }
  if (qType.type === 'dropdown') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < qType.selects.length; i++) {
      const sel = qType.selects[i]; const target = lines[i] || answerText; const opts = [...sel.options];
      const match = opts.find(o => o.text.trim().toLowerCase() === target.toLowerCase()) || opts.find(o => o.text.trim().toLowerCase().includes(target.toLowerCase()));
      if (match) { sel.value = match.value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    return true;
  }
  if (qType.type === 'ixl-dropdown') {
    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < qType.dropdowns.length; i++) {
      const dd = qType.dropdowns[i];
      const rawAns = (lines[i] || answerText).replace(/^\$/, '').trim();
      const target = normDDText(rawAns);
      function pointerTap(el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const opts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, pointerId: 1, pointerType: 'mouse', isPrimary: true };
        if (navigator.maxTouchPoints > 0) {
          try {
            const _tid = Date.now();
            const tp = [new Touch({ identifier: _tid, target: el, clientX: cx, clientY: cy, pageX: cx + window.scrollX, pageY: cy + window.scrollY })];
            el.dispatchEvent(new TouchEvent('touchstart', { bubbles:true, cancelable:true, touches: tp, targetTouches: tp, changedTouches: tp }));
            el.dispatchEvent(new TouchEvent('touchend', { bubbles:true, cancelable:true, touches: [], targetTouches: [], changedTouches: tp }));
          } catch(e) {}
        }
        try {
          el.dispatchEvent(new PointerEvent('pointerdown', opts));
          el.dispatchEvent(new PointerEvent('pointerup', opts));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy }));
        } catch(e) {  }
      }
      const trigger = dd.header || dd.arrow;
      pointerTap(trigger); await sleep(500);
      const hb = dd.hidingBox;
      for (let w = 0; w < 10; w++) {
        if (hb && hb.offsetHeight > 20) break;
        await sleep(100);
      }
      let freshChoices = dd.hidingBox ? [...dd.hidingBox.querySelectorAll('.drop-down-choice')] : [];
      if (!freshChoices.length && dd.choiceList) freshChoices = [...dd.choiceList.querySelectorAll('.drop-down-choice')];
      if (!freshChoices.length) freshChoices = dd.choices;
      const allTexts = freshChoices.map(c => ddChoiceText(c));
      console.log('[amoura] ixl-dropdown[' + i + '] target:', target, 'choices:', allTexts);

      let match = freshChoices.find((c, ci) => normDDText(allTexts[ci]) === target);
      if (!match) match = freshChoices.find((c, ci) => { const ct = normDDText(allTexts[ci]); return ct && (ct.includes(target) || target.includes(ct)); });

      if (!match) {
        const strip = s => s.replace(/[\s_]+/g, '');
        const tStrip = strip(target);
        match = freshChoices.find((c, ci) => strip(normDDText(allTexts[ci])) === tStrip);
        if (!match) match = freshChoices.find((c, ci) => { const cs = strip(normDDText(allTexts[ci])); return cs && (cs.includes(tStrip) || tStrip.includes(cs)); });
      }

      if (!match) {
        const letter = rawAns.toUpperCase().match(/^([A-H])\.?$/);
        if (letter) match = freshChoices[letter[1].charCodeAt(0) - 65];
      }
      if (match) {
        pointerTap(match);
        console.log('[amoura] ixl-dropdown: selected:', ddChoiceText(match));
        await sleep(400);
      } else {
        console.log('[amoura] ixl-dropdown: no match for:', target, 'in:', allTexts);
      }
    }
    return true;
  }
  if (qType.type === 'classify') {

    const lines = answerText.split('\n').map(l => l.trim()).filter(Boolean);
    const normalize = s => s.replace(/\s+/g, ' ').trim().toLowerCase();

    const binAssignments = new Map();
    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const binLabel = line.slice(0, colonIdx).trim();
      const itemsPart = line.slice(colonIdx + 1).trim();

      const binIdx = qType.binNames.findIndex(bn => normalize(bn) === normalize(binLabel));
      if (binIdx === -1) { console.log('[amoura] classify: unknown bin "' + binLabel + '"'); continue; }

      const refs = itemsPart.split(',').map(s => s.trim()).filter(Boolean);
      const itemIdxs = [];
      for (const ref of refs) {
        const num = parseInt(ref);
        if (!isNaN(num) && num >= 1 && num <= qType.items.length) {
          itemIdxs.push(num - 1);
        } else {

          const idx = qType.items.findIndex(el => normalize(el.innerText).includes(normalize(ref)) || normalize(ref).includes(normalize(el.innerText)));
          if (idx >= 0) itemIdxs.push(idx);
        }
      }
      binAssignments.set(binIdx, (binAssignments.get(binIdx) || []).concat(itemIdxs));
    }
    console.log('[amoura] classify: parsed', binAssignments.size, 'bin assignments');

    for (const [binIdx, itemIdxs] of binAssignments) {
      const bin = qType.bins[binIdx];
      if (!bin) continue;

      const slots = [...bin.querySelectorAll('.binContentDropSlot')].filter(s => !s.querySelector('.dragWrapper'));
      for (let j = 0; j < itemIdxs.length; j++) {
        const item = qType.items[itemIdxs[j]];
        if (!item) continue;

        const target = slots[j] || bin;
        console.log('[amoura] classify: dragging item', itemIdxs[j] + 1, '"' + item.innerText.trim().slice(0, 30) + '" -> bin "' + qType.binNames[binIdx] + '"');
        await simulatePointerDrag(item, target);
        await sleep(500);
      }
    }
    return true;
  }
  if (qType.type === 'drag-drop') {
    const nums = answerText.split('\n').map(l => parseInt(l.trim())).filter(n => !isNaN(n));
    const zones = qType.dropZones || [];
    console.log('[amoura] drag-drop fill. answer nums:', nums, 'zones:', zones.length, 'items:', qType.items.length);
    for (let i = 0; i < zones.length && i < nums.length; i++) {
      const itemIdx = nums[i] - 1;
      const source = qType.items[itemIdx];
      const target = zones[i];
      if (!source || !target) { console.log('[amoura] drag-drop: missing source/target at', i); continue; }
      await simulatePointerDrag(source, target);
      await sleep(400);
    }

    if (!zones.length && qType.items.length) {
      console.log('[amoura] drag-drop: no zones, trying click approach');
      for (let i = 0; i < nums.length; i++) {
        const itemIdx = nums[i] - 1;
        if (qType.items[itemIdx]) { reactClick(qType.items[itemIdx]); await sleep(300); }
      }
    }
    return true;
  }
  const anyInput = document.querySelector('input.fillIn:not([disabled]),textarea.fill-in:not([disabled]),input[type="text"]:not([disabled]):not([class*="search"]):not([class*="nav"])');
  if (anyInput && anyInput.offsetParent) { anyInput.focus(); reactSet(anyInput, answerText); await sleep(150); return true; }
  return false;
}

async function submitAnswer(answerText, qType, autoGotIt = true) {
  const filled = await fillAnswer(answerText, qType);
  if (!filled) { console.warn('[amoura] could not fill. type:', qType.type); return false; }
  await sleep(_gr(280,60,160,420));
  if (qType.type === 'mc' || qType.type === 'radio') {
    await clickSubmit();
    await sleep(_gr(900,200,550,1400));
    if (autoGotIt) dismissDialog();
    return true;
  }
  const submitted = await clickSubmit();

  await sleep(_gr(900,200,550,1400));
  if (autoGotIt) dismissDialog();
  return submitted;
}

function isOnLesson() {
  const p = window.location.pathname;

  if (/^\/(benchmark|diagnostic)\b/.test(p)) return true;

  const segments = p.replace(/^\/|\/$/g, '').split('/');

  if (segments.length < 3 && !/\/skill\//.test(p)) return false;

  if (document.querySelector('[class*="smartscore"],[class*="SmartScore"],[data-cy*="smart-score"]')) return true;
  if (document.querySelector('.practice-crate,.qreactbridge,[class*="ixl-practice"]')) return true;
  if (document.querySelector('.questionRow, .fillIn, .fill-in, input.fillIn, [class*="mq-editable"]')) return true;
  if (document.querySelector('[data-testid="SelectableTile"], .SelectableTile')) return true;
  if (/\/skill\//.test(p)) return true;

  const subjectMatch = /^\/(math|ela|science|social-studies|language-arts|spanish|french|algebra|geometry|calculus|statistics|reading|precalculus|trigonometry|ap-[^/]+|ib-[^/]+)/.test(p);
  return subjectMatch && segments.length >= 3;
}
if (!window.location.hostname.includes('ixl.com')) {
  setStatus('<span style="color:#60a5fa">' + IC.warn + ' Not on IXL — go to an IXL practice page first</span>');
  return;
}

showMainUI();

if (isAutoStart()) {
  setTimeout(() => { if (isPaused()) triggerStart(); }, 500);
}

let _ixlMemoryLessons = [];
(async () => {
  try {
  await _tryAutoLogin();
  if (!_authToken || !_authUid) return;

  await _initServerSession();

  const pathLc = window.location.pathname.toLowerCase();
  let subj = 'math';
  if (/\bela\b|language-arts|reading/.test(pathLc)) subj = 'ela';
  else if (/\bscience\b/.test(pathLc)) subj = 'science';
  else if (/\bsocial\b/.test(pathLc)) subj = 'social';
  try {
    const r = await _fetch(FB_FIRESTORE + '/ixlMemory/' + _authUid + '/subjects/' + encodeURIComponent(subj), { headers: { 'Authorization': 'Bearer ' + _authToken } });
    if (r.ok) {
      const d = await r.json();
      _ixlMemoryLessons = (d.fields?.lessons?.arrayValue?.values || []).slice(-10).map(v => v.stringValue).filter(Boolean);
      if (_ixlMemoryLessons.length) console.log('[amoura] loaded ' + _ixlMemoryLessons.length + ' memory lessons for ' + subj);
    }
  } catch(e) {}
  } catch(e) {}
})();

showLoading('Loading renderer');
try { await loadHtml2Canvas(); } catch(e) {}
updatePageInfo();
setStatus(IC.sparkle + ' <b>AMOURA</b> ready — click ' + IC.play + ' to start');

const _ixRoot = document.getElementById('_amoura_root');
const noLessonEl = _ixRoot.querySelector('#_am_not_lesson');
const mainEls2 = [_ixRoot.querySelector('#_am_stats'), _ixRoot.querySelector('#_am_settings'), _ixRoot.querySelector('#_am_current'), _ixRoot.querySelector('#_am_home_controls'), _ixRoot.querySelector('#_am_history')];
const footerEl2 = _ixRoot.querySelector('#_am_footer');
if (!isOnLesson()) {
  noLessonEl.style.display = 'flex';
  mainEls2.forEach(el => { if (el) el.style.display = 'none'; });
  footerEl2.style.display = 'none';
  while (window._amouraRunning && !isOnLesson()) { await sleep(800); }
  if (!window._amouraRunning) return;
  noLessonEl.style.display = 'none';
  mainEls2.forEach(el => { if (el) el.style.display = ''; });
  footerEl2.style.display = '';
  updatePageInfo();
}

let lastFP = null;
let count = 0;
let _lastSubmittedAnswer = null, _lastSubmittedQType = null, _lastSubmittedText = null;
let _retryWithPro = false;

function _waitForQuestionChange(maxWait) {
  return new Promise(resolve => {
    const target = document.querySelector('.ixl-practice-crate, .practice-question-wrapper, [class*="practiceQuestion"], .qreactbridge') || document.querySelector('main') || document.body;
    let resolved = false;
    const done = () => { if (resolved) return; resolved = true; observer.disconnect(); clearTimeout(timer); resolve(); };
    const observer = new MutationObserver(mutations => {

      for (const m of mutations) {
        if (m.type === 'childList' && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) { done(); return; }
        if (m.type === 'characterData') { done(); return; }
        if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) { done(); return; }
      }
    });
    observer.observe(target, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });
    const timer = setTimeout(done, maxWait);
  });
}

if (!_authToken) {
  const _ok = await _tryAutoLogin();
  if (!_ok) await _authAnonymousLogin();
}
if (_authToken && (!_sessKeyBytes || Date.now() >= _sessKeyExpiry)) {
  await _initServerSession();
}

while (window._amouraRunning) {
  if (window._amResetFP) { lastFP = null; window._amResetFP = false; }
  if (isPaused()) {
    const _st = document.getElementById('_amoura_root');
    const _sw = _st && _st.querySelector('._am_wave');
    if (_sw) { try { panel.status.innerHTML = '<span style="color:#60a5fa">Paused</span>'; } catch(e) {} }
    await sleep(400); continue;
  }
  if (isMinimized() && !isAnswerWhileMin()) { await sleep(400); continue; }

  if (!isOnLesson()) {
    noLessonEl.style.display = 'flex';
    mainEls2.forEach(el => { if (el) el.style.display = 'none'; });
    footerEl2.style.display = 'none';
    while (window._amouraRunning && !isOnLesson()) { await sleep(800); }
    if (!window._amouraRunning) break;
    noLessonEl.style.display = 'none';
    mainEls2.forEach(el => { if (el) el.style.display = ''; });
    footerEl2.style.display = '';
    updatePageInfo();
    lastFP = null;
    continue;
  }

  const limitEl = document.querySelector('[class*="upsell"], [class*="Upsell"], [class*="practice-limit"], [class*="practiceLimit"]');
  const bodyText = (limitEl ? limitEl.innerText : '') || document.body?.innerText || '';
  if (/daily practice limit|daily limit.*reached|reached your daily/i.test(bodyText.slice(0, 2000))) {
    setStatus('<span style="color:#f59e0b">' + IC.warn + ' IXL daily practice limit reached — try again tomorrow or get a membership</span>');
    setAnswer('');
    await sleep(5000);
    continue;
  }
  const czOverlay = document.querySelector('.challenge-zone-interstitial, .challenge-zone-overlay, .challenge-zone-countdown, [class*="challengeZone"][class*="interstitial"], [class*="challengeZone"][class*="overlay"]');
  if (czOverlay && czOverlay.offsetParent) {
    console.log('[amoura] challenge zone countdown active, waiting...');
    setStatus('<span style="color:#f59e0b">Challenge Zone — waiting...</span>');
    await sleep(1500);
    continue;
  }

  const incompleteDialog = document.querySelector('.modal, [role="dialog"], [class*="dialog"], [class*="Dialog"]');
  if (incompleteDialog && incompleteDialog.offsetParent && /incomplete answer/i.test(incompleteDialog.innerText)) {
    const goBackBtn = [...incompleteDialog.querySelectorAll('button')].find(b => /go\s*back/i.test(b.innerText));
    if (goBackBtn) {
      console.log('[amoura] incomplete answer dialog — clicking Go back');
      reactClick(goBackBtn);
      lastFP = null;
      await sleep(600);
      continue;
    }
  }

  const continueBtn = [...document.querySelectorAll('button.crisp-button,button')].find(b => b.offsetParent && /^(continue|ok)$/i.test(b.innerText?.trim()) && !b.disabled);
  if (continueBtn) {
    if (isAutoSkip()) {
      console.log('[amoura] auto-skip: clicking', continueBtn.innerText.trim());
      reactClick(continueBtn);
      lastFP = null;
      await sleep(400);
      continue;
    } else {
      setStatus('<span style="color:#60a5fa">Explanation screen — click <b>'+continueBtn.innerText.trim()+'</b> to proceed, or <a href="#" id="_am_enable_skip" style="color:#60a5fa;text-decoration:underline;cursor:pointer">enable Auto Skip</a></span>');
      const _skipLink = panel.status.querySelector('#_am_enable_skip');
      if (_skipLink) _skipLink.onclick = (e) => { e.preventDefault(); autoSkip = true; saveSetting(S_KEYS.autoskip, '1'); toggleAutoSkip.classList.add('on'); reactClick(continueBtn); };
      await new Promise(resolve => {
        const chk = setInterval(() => { if (!document.body.contains(continueBtn) || !continueBtn.offsetParent) { clearInterval(chk); resolve(); } }, 300);
      });
      lastFP = null;
      continue;
    }
  }

  const gotItVisible = [...document.querySelectorAll('button.crisp-button,button')].find(b => b.offsetParent && /^got\s+it$/i.test(b.innerText?.trim()));
  if (gotItVisible) {

    if (_lastSubmittedAnswer && _lastSubmittedQType && _authUid) {
      const _fbSubj = _lastSubmittedQType.subject || 'math';
      const _fbType = _lastSubmittedQType.type;
      const _fbAns = _lastSubmittedAnswer.slice(0, 100);
      const _fbText = (_lastSubmittedText || '').slice(0, 200);

      let _fbCorrect = '', _fbExplanation = '';
      try {
        const wrongScreen = gotItVisible.closest('[class*="feedback"],[class*="Feedback"],[class*="after-submit"],[class*="answer-section"]') || document.querySelector('[class*="feedback"],[class*="Feedback"],[class*="wrong-answer"],[class*="incorrect"],.after-submit-response');
        if (wrongScreen) {

          const allText = wrongScreen.innerText || '';

          const correctMatch = allText.match(/(?:correct answer\s*(?:is|was)\s*:?\s*)([\s\S]*?)(?:\n\s*\n|explanation|review|you answered|$)/i);
          if (correctMatch) _fbCorrect = correctMatch[1].trim().slice(0, 300);

          _fbExplanation = allText.slice(0, 1500);
        }

        if (!_fbCorrect) {
          const ansEl = document.querySelector('.correct-answer-text,.correct-answer,.answer-value,[class*="correctAnswer"],[class*="correct-answer"]');
          if (ansEl) _fbCorrect = (ansEl.innerText || '').trim().slice(0, 300);
        }

        if (!_fbExplanation) {
          const afterSubmit = document.querySelector('.after-submit-response,.explanation-section,[class*="explanation"],[class*="Explanation"],.solution-steps');
          if (afterSubmit) _fbExplanation = (afterSubmit.innerText || '').trim().slice(0, 1500);
        }
      } catch(e) {  }
      const _fbBody = JSON.stringify({ subject: _fbSubj, qType: _fbType, wrongAnswer: _fbAns, questionText: _fbText, correctAnswer: _fbCorrect, explanation: _fbExplanation });
      (async () => {
        for (let _fbAtt = 0; _fbAtt < 2; _fbAtt++) {
          try {
            const r = await _secFetch(PROXY_URL + '/memory/feedback', { method: 'POST', headers: _authHeaders(), body: _fbBody });
            if (r.ok) break;
            if (r.status === 403 && _fbAtt === 0) {
              let errData = {};
              try { errData = await r.clone().json(); } catch(_) {}
              if (errData.error && (errData.error.includes('signature') || errData.error.includes('session') || errData.error.includes('No session'))) {
                console.warn('[amoura] feedback session error, re-initializing...', errData.error);
                _sessKeyBytes = null; _sessKeyExpiry = 0; _aesKeyCache = null; _aesKeySrc = null;
                await _initServerSession();
                continue;
              }
            }
            console.warn('[amoura] feedback failed:', r.status);
            break;
          } catch(e) { console.warn('[amoura] feedback error:', e.message); break; }
        }
      })();
    }
    _lastSubmittedAnswer = null;
    _retryWithPro = true;
    _prefetchedChallenge = null; _prefetchingChallenge = null; _prefetchChallenge();
    if (isAutoGotIt()) {
      reactClick(gotItVisible);
      lastFP = null;
      await sleep(500);
      continue;
    } else {
      const _gotitPromptId = '_am_gotit_prompt_' + Date.now();
      setStatus('<span style="color:#f97316">'+IC.warn+' Wrong answer — <a id="'+_gotitPromptId+'" href="#" style="color:#60a5fa;text-decoration:underline;cursor:pointer">Enable Auto Got It</a> to auto-dismiss, or click <b>Got It</b> manually.</span>');
      const _promptLink = panel.status.querySelector('#'+_gotitPromptId);
      if (_promptLink) _promptLink.onclick = (e) => { e.preventDefault(); autoGotIt = true; saveSetting(S_KEYS.gotit, '1'); toggleGotIt.classList.add('on'); setStatus('<span style="color:#22c55e">'+IC.check+' Auto Got It enabled — wrong answer screens will now be dismissed automatically.</span>'); };
      await new Promise(resolve => {
        const chk = setInterval(() => { if (!document.body.contains(gotItVisible) || !gotItVisible.offsetParent) { clearInterval(chk); resolve(); } }, 300);
      });
      lastFP = null;
      continue;
    }
  }
  updatePageInfo();
  const ss = getSmartScore();
  if (ss === '100' && isStopAt100()) {
    console.log('[amoura] SmartScore 100');
    panel.complete.style.display = 'block';
    setStatus('<span style="color:#60a5fa">'+IC.sparkle+' Lesson Complete! SmartScore: 100</span>');
    clearInterval(timerInterval);
    break;
  }
  const congrats = document.querySelector('[class*="congrat"],[class*="Congrat"],[class*="complete"],[class*="Complete"]');
  if (congrats && congrats.offsetParent && /congrat|you did it|100/i.test(congrats.textContent)) {
    panel.complete.style.display = 'block';
    setStatus('<span style="color:#60a5fa">'+IC.sparkle+' Lesson Complete!</span>');
    clearInterval(timerInterval);
    break;
  }
  const q = await captureQuestion();
  const fp = qHash(q.text + '|' + (q.qType.options?.length || 0) + '|' + q.qType.type);
  if (fp === lastFP) { if (isBetaObs()) await _waitForQuestionChange(2000); else await sleep(400); continue; }
  if (!q.text && !q.questionImages?.length && !q.tileImages?.length) { if (isBetaObs()) await _waitForQuestionChange(2000); else await sleep(600); continue; }
  if (q.text && q.text.length < 5 && !q.questionImages?.length && !q.tileImages?.length) { if (isBetaObs()) await _waitForQuestionChange(2000); else await sleep(600); continue; }
  lastFP = fp;
  const tl = q.qType.type + (q.qType.type === 'multi-fill' ? ' ('+q.qType.inputs.length+')' : '');
  if (q.qType.type === 'unknown') {
    showLoading(q.qType.subject.toUpperCase()+' / unknown — getting answer...');
    setAnswer('');
    try {
      const rawAnswer = await askGemini(q);
      if (!window._amouraRunning) break;
      if (isPaused()) { lastFP = null; continue; }
      const answer = cleanAnswer(rawAnswer);
      count++;
      _pingCounter();
      panel.count.textContent = getQuestionsAnswered();
      setStatus('<span style="color:#f59e0b">'+IC.warn+' Auto answer not supported for this question type</span>');
      setAnswer(answer);
      console.log('[amoura] #'+count+' [unknown] '+answer);
      addHistory(count, answer, 'unknown', false);
      _amToast('Auto answer not supported — answer shown above', 'warn');
      _logUnsupportedType(q);
    } catch(e) {
      if (e.message === 'Paused') { setStatus('<span style="color:#60a5fa">'+IC.pause+' Paused</span>'); lastFP = null; continue; }
      setStatus('<span style="color:#f59e0b">'+IC.warn+' Unsupported type + AI error: '+_esc((e.message||'').slice(0,50))+'</span>');
      _logUnsupportedType(q);
    }
    if (isBetaObs()) {
      await _waitForQuestionChange(30000);
    } else {
      let waitCount = 0;
      while (window._amouraRunning && waitCount < 120) {
        await sleep(800);
        if (isPaused()) continue;
        const newQ = await captureQuestion();
        const newFP = qHash(newQ.text + '|' + (newQ.qType.options?.length || 0) + '|' + newQ.qType.type);
        if (newFP !== fp) break;
        waitCount++;
      }
    }
    lastFP = null;
    continue;
  }
  showLoading(q.qType.subject.toUpperCase()+' / '+tl);
  setAnswer('');
  _amToast('Solving: ' + tl, 'info');

  const _calcTypes = new Set(['fill-in', 'sympad', 'math-editor', 'frac-inputs']);
  if (!q.qType.directAnswer && _calcTypes.has(q.qType.type) && q.text && !q.questionImages?.length) {
    const calcAns = tryArithmetic(q.text);
    if (calcAns !== null) {
      q.qType.directAnswer = calcAns;
      console.log('[amoura] calc shortcut:', calcAns);
    }
  }

  if (q.qType.type === 'graph' && q.qType.overlay && q.qType.graphMeta && !q.qType.directAnswer) {
    const _gPairRx = /\(\s*(?:–|-|−)?\s*\d+(?:\.\d+)?\s*,\s*(?:–|-|−)?\s*\d+(?:\.\d+)?\s*\)/g;
    const _gMatches = (q.text || '').match(_gPairRx);
    if (_gMatches && _gMatches.length >= 2) {

      q.qType.directAnswer = _gMatches.map(m => m.replace(/–|−/g, '-')).join('\n');
      console.log('[amoura] graph shortcut: extracted', _gMatches.length, 'coords from question text:', q.qType.directAnswer);
    }
  }
  try {
    let rawAnswer;
    if (q.qType.type === 'audio-spell' && !q.qType.directAnswer) {
      let _spellWord = _getAudioSpellFromDOM();
      if (!_spellWord) {
        await _clickAudioPlay();
        for (let _try = 0; _try < 12; _try++) {
          await sleep(400);
          _spellWord = _getAudioSpellFromDOM() || _getAudioSpellWord();
          if (_spellWord) break;
          if (_try === 3) await _clickAudioPlay();
          q.qType.audioFile = _getAudioFileName() || q.qType.audioFile;
        }
      }
      if (_spellWord) {
        q.qType.directAnswer = _spellWord;
        console.log('[amoura] audio-spell word found:', _spellWord);
      } else if (q.qType.audioFile) {
        console.log('[amoura] audio-spell: sending audio URL to AI as fallback');
      } else {
        console.warn('[amoura] audio-spell: no audio URL found at all');
        setStatus('<span style="color:#f59e0b">Could not detect audio — skipping</span>');
        lastFP = null; await sleep(2000); continue;
      }
    }
    if (q.qType.directAnswer) {
      rawAnswer = q.qType.directAnswer;
      console.log('[amoura] direct answer (no AI):', rawAnswer);
    } else {
      rawAnswer = await askGemini(q);
    }
    if (!window._amouraRunning) break;
    if (isPaused()) { lastFP = null; continue; }
    const answer = q.qType.directAnswer ? rawAnswer : cleanAnswer(rawAnswer);
    count++;
    _pingCounter();
    panel.count.textContent = getQuestionsAnswered();
    setStatus('<span style="color:#3b82f6">'+_esc(q.qType.subject.toUpperCase())+'</span> / <span style="color:#5c5c5c">'+_esc(tl)+'</span>');
    setAnswer(answer);
    console.log('[amoura] #'+count+' ['+tl+'] '+answer);
    _lastSubmittedAnswer = answer; _lastSubmittedQType = q.qType; _lastSubmittedText = q.text;
    const nextBtn = _ixRoot.querySelector('#_am_next_btn');
    if (isAutoAnswer()) {
      await sleep(_gr(300,80,150,550));
      if (isPaused()) { lastFP = null; continue; }
      const ok = await submitAnswer(answer, q.qType, isAutoGotIt());
      addHistory(count, answer, tl, ok);
      updatePageInfo();
      _amToast(ok ? 'Solved #'+count+': '+answer.substring(0,40) : 'Submit failed #'+count, ok ? 'success' : 'error', ok);
      if (!ok) { setStatus('<span style="color:#f97316">'+IC.warn+' Submit failed</span> / '+_esc(tl)); await sleep(2500); lastFP = null; continue; }
      await sleep(DELAY_MIN + Math.random()*(DELAY_MAX-DELAY_MIN));
      if (!isAutoNext() && nextBtn) {
        nextBtn.style.display = '';
        setStatus('<span style="color:#60a5fa">Paused — click Solve Next to continue</span>');
        await new Promise(resolve => { nextBtn.addEventListener('click', resolve, { once: true }); });
        nextBtn.style.display = 'none';
      }
    } else {
      if (isPaused()) { lastFP = null; continue; }
      await fillAnswer(answer, q.qType);
      addHistory(count, answer, tl, true);
      if (!isAutoNext() && nextBtn) {
        nextBtn.style.display = '';
        setStatus('<span style="color:#3b82f6">Answer: <b>'+_fmtMath(answer)+'</b></span> / '+_esc(tl)+' <span style="color:#5c5c5c">— click Solve Next when ready</span>');
        await new Promise(resolve => { nextBtn.addEventListener('click', resolve, { once: true }); });
        nextBtn.style.display = 'none';
      } else {
        setStatus('<span style="color:#3b82f6">Answer: <b>'+_fmtMath(answer)+'</b></span> / '+_esc(tl)+' <span style="color:#5c5c5c">(you submit)</span>');
        let waitCount = 0;
        while (window._amouraRunning && waitCount < 120) {
          await sleep(800);
          if (isPaused()) continue;
          const newQ = await captureQuestion();
          const newFP = qHash(newQ.text + '|' + (newQ.qType.options?.length || 0) + '|' + newQ.qType.type);
          if (newFP !== fp) break;
          waitCount++;
        }
      }
    }
    lastFP = null;
  } catch (e) {
    if (e.message === 'Paused') { setStatus('<span style="color:#60a5fa">'+IC.pause+' Paused</span>'); lastFP = null; continue; }
    setStatus('<span style="color:#60a5fa">'+IC.warn+' '+_esc((e.message || 'Unknown error').slice(0,60))+'</span>');
    console.error('[amoura]', e);
    await sleep(2500); lastFP = null;
  }
}
})();
