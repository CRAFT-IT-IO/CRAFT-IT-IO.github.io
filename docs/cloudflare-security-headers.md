# Cloudflare setup for security headers

GitHub Pages cannot send custom HTTP response headers. The HTML changes in this repo cover **Subresource Integrity** and a browser-enforced CSP meta tag, but scanners that look at response headers (CSP, HSTS, anti-clickjacking) will still fail until **Cloudflare sits in front of the site** and injects those headers.

This is required for `https://www.craft-it.io` (and the apex `https://craft-it.io` redirect). A Free Cloudflare plan is enough.

## What the repo already does vs what Cloudflare must do

| Review finding | Repo | Cloudflare |
| --- | --- | --- |
| Sub Resource Integrity Attribute Missing | Done (`integrity` on every CDN script) | Nothing |
| Content Security Policy (CSP) header not set | Meta tag (browsers enforce it; scanners usually ignore it) | Send `Content-Security-Policy` |
| Missing Anti-clickjacking header | Not possible on GitHub Pages (`frame-ancestors` is ignored in meta tags) | Send `X-Frame-Options` and CSP `frame-ancestors` |
| HSTS header is missing | `web.config` only (IIS; ignored by GitHub Pages) | Enable HSTS |

Do **not** add a `_headers` file. That format is for Cloudflare Pages / Netlify. It does nothing when Cloudflare is only proxying GitHub Pages.

## 1. Put the domain on Cloudflare

1. Create or sign in to a Cloudflare account.
2. Add site `craft-it.io`.
3. Cloudflare will scan existing DNS and give you two nameservers.
4. At the current registrar (GoDaddy: `ns45.domaincontrol.com` / `ns46.domaincontrol.com`), replace the nameservers with Cloudflare’s.
5. Wait until the domain shows **Active** in Cloudflare.

## 2. DNS records (proxied)

Use these records. The orange cloud (**Proxied**) must be on, or Cloudflare cannot add headers.

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `www` | `craft-it-io.github.io` | Proxied |
| CNAME | `@` (apex) | `craft-it-io.github.io` | Proxied |

Cloudflare flattens the apex CNAME automatically. Keep the repo `CNAME` file as `www.craft-it.io`.

**GitHub Pages certificate:** GitHub needs a grey-cloud (DNS only) record the first time it issues HTTPS for the custom domain, and sometimes on renewal.

1. Create the records as **DNS only**.
2. In the GitHub repo: Settings → Pages → custom domain `www.craft-it.io` → wait until **Enforce HTTPS** is available and checked.
3. Confirm `https://www.craft-it.io` works on GitHub’s certificate.
4. Switch `www` and `@` back to **Proxied**.

If HTTPS on GitHub later shows a certificate error, grey-cloud again until GitHub reissues, then re-enable the proxy.

## 3. SSL / TLS

In **SSL/TLS**:

1. Overview → encryption mode **Full (strict)**. GitHub Pages already presents a valid certificate. Do not use Flexible.
2. Edge Certificates → **Always Use HTTPS**: On.
3. Edge Certificates → **Minimum TLS Version**: `1.2`.
4. Edge Certificates → **TLS 1.3**: On.

## 4. Turn off Cloudflare features that break CSP

A strict CSP will block Cloudflare-injected scripts and the site will look broken.

| Setting | Path | Value |
| --- | --- | --- |
| Rocket Loader | Speed → Optimization | Off |
| Email Address Obfuscation | Scrape Shield | Off |
| Auto Minify (HTML/JS) | Speed → Optimization | Off (safer with CSP) |
| Zaraz | Zaraz | Off unless you add it to the CSP |

## 5. Inject CSP and anti-clickjacking headers

One Response Header Transform Rule covers the header-based findings except HSTS (next section).

1. Open **Rules** → **Overview**.
2. **Create rule** → **Response Header Transform Rule**.
3. Rule name: `Security headers`.
4. When incoming requests match: **All incoming requests**.
5. For each row below, choose **Set static**, then paste the header name and value.
6. **Deploy**.

Use **Set static** (not Add). Set overwrites; Add can produce duplicate headers.

| Header name | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://raw.githubusercontent.com; worker-src 'self' blob:; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |

These values match `web.config`. The HTML CSP meta tag is the same policy without `frame-ancestors` (meta tags cannot carry that directive). Keep the two in sync if you change either.

Do **not** put `Strict-Transport-Security` in this rule. Enable it in the HSTS panel so it is not sent twice.

## 6. Enable HSTS

Only after HTTPS works end-to-end on both `craft-it.io` and `www.craft-it.io`.

1. **SSL/TLS** → **Edge Certificates**.
2. **HTTP Strict Transport Security (HSTS)** → **Enable HSTS**.
3. Confirm the warning.
4. Use:

| Setting | Value |
| --- | --- |
| Enable HSTS | On |
| Max Age Header | 12 months (`max-age=31536000`) |
| Apply HSTS policy to subdomains (`includeSubDomains`) | On (only if every subdomain of `craft-it.io` is HTTPS) |
| Preload | Off until you are sure you will stay on HTTPS |
| No-Sniff Header | Off (already set in the transform rule) |

HSTS is sticky in browsers. Do not pause Cloudflare, grey-cloud the zone, or drop HTTPS until you have disabled HSTS and waited out `max-age`.

## 7. Verify

After DNS is proxied and the rules are deployed:

```bash
curl -sI https://www.craft-it.io | grep -iE 'content-security-policy|strict-transport|x-frame-options|x-content-type|referrer-policy|permissions-policy'
```

You should see all six headers. Repeat for `https://craft-it.io` (the 301 is fine; the HSTS header should still be present on that response).

Then rescan with the original tool, or [SecurityHeaders.com](https://securityheaders.com/?q=https://www.craft-it.io).

In the browser console on each page, confirm there are no CSP violations (Three.js, GSAP, Google Fonts, and the banking-page GeoJSON fetch are already allowlisted).

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Headers still missing | Record is DNS only (grey cloud), or the transform rule is draft |
| Error 526 | SSL mode is Full (strict) but GitHub’s custom-domain cert is not ready — grey-cloud, wait for GitHub HTTPS, then proxy again |
| Error 525 | SSL mode is Full/Full (strict) while GitHub Enforce HTTPS is off |
| Blank page / scripts blocked | Rocket Loader or email obfuscation is still on, or CSP does not match the HTML |
| Duplicate CSP / HSTS headers | Header is set both in the transform rule and in another Cloudflare panel |
| GitHub “certificate not yet issued” | Custom domain records must be DNS only during issuance |
