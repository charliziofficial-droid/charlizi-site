import io, json, os, re, sys, time, urllib.request, urllib.error

KEY = "7045e74bb4d83f16d1df06514ce65d00"
HOST = "charlizi.com"
SITEMAP = f"https://{HOST}/sitemap.xml"

ENDPOINTS = [
    ("Bing", "https://www.bing.com/indexnow"),
    ("IndexNow", "https://api.indexnow.org/indexnow"),
    ("Yandex", "https://yandex.com/indexnow"),
    ("Seznam", "https://search.seznam.cz/indexnow"),
]


def fetch_urls():
    req = urllib.request.Request(SITEMAP, headers={"User-Agent": "CharliziIndexNow/1.0"})
    with urllib.request.urlopen(req, timeout=45) as f:
        body = f.read().decode("utf-8", "replace")
    return re.findall(r"<loc>(.*?)</loc>", body)


def submit(urls, dry=False):
    if not urls:
        print("no urls, nothing to do")
        return 0
    payload = {"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt",
               "urlList": urls}
    body = json.dumps(payload).encode("utf-8")
    if dry:
        print(f"[dry-run] would submit {len(urls)} urls")
        return 0
    ok = 0
    for name, ep in ENDPOINTS:
        req = urllib.request.Request(
            ep, data=body,
            headers={"Content-Type": "application/json; charset=utf-8",
                     "User-Agent": "CharliziIndexNow/1.0"},
            method="POST")
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                code = r.status
            if code in (200, 202):
                ok += 1
                print(f"  {name:10s} {code} OK")
            else:
                print(f"  {name:10s} {code} unexpected")
        except urllib.error.HTTPError as e:
            print(f"  {name:10s} HTTP {e.code} {e.reason}")
        except Exception as e:
            print(f"  {name:10s} ERROR {e}")
        time.sleep(2)
    return ok


def main():
    argv = sys.argv[1:]
    dry = "--dry-run" in argv
    single = [a for a in argv if a.startswith("http")]
    urls = single if single else fetch_urls()
    print(f"submitting {len(urls)} url(s)")
    n = submit(urls, dry=dry)
    print(f"accepted by {n}/{len(ENDPOINTS)} endpoints")
    return 0 if n else 1


if __name__ == "__main__":
    sys.exit(main())
