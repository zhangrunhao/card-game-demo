import test from 'node:test'
import assert from 'node:assert/strict'
import { cacheControlForKey, joinCosKey, toPosix, CONFIG } from './deploy-static.mjs'

test('cacheControlForKey returns no-cache for html', () => {
  assert.equal(cacheControlForKey('index.html'), 'no-cache')
  assert.equal(cacheControlForKey('foo/bar/page.html'), 'no-cache')
})

test('cacheControlForKey returns long cache for non-html', () => {
  assert.equal(
    cacheControlForKey('static/app.123.js'),
    'public, max-age=31536000, immutable',
  )
})

test('toPosix normalizes separators', () => {
  assert.equal(toPosix('a\\b\\c'), 'a/b/c')
})

test('joinCosKey prefixes and normalizes', () => {
  assert.equal(joinCosKey('static/site/', 'a/b.js'), 'static/site/a/b.js')
  assert.equal(joinCosKey('static/site', 'a/b.js'), 'static/site/a/b.js')
})

test('CONFIG uses hardcoded defaults', () => {
  assert.equal(CONFIG.COS_BUCKET, 'your-bucket')
  assert.equal(CONFIG.COS_REGION, 'ap-guangzhou')
  assert.equal(CONFIG.COS_PREFIX, 'static/site')
  assert.equal(CONFIG.BUILD_DIR, 'dist/20250122_website')
  assert.equal(CONFIG.CDN_BASE_URL, 'https://cdn.example.com')
})
