# push_charlizi_seo.py
# Push SEO/GEO improvements to charliziofficial-droid/charlizi-site via GitHub Git Data API (no git binary needed)
import json, base64, urllib.request, os, sys

TOKEN = ***"GITHUB_TOKEN") or ""
if not TOKEN:
    sys.exit("GITHUB_TOKEN env var is required")
OWNER = "charliziofficial-droid"
REPO = "charlizi-site"
BRANCH = "main"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"

def req(url, method="GET", data=None):
    body = json.dumps(data).encode() if data is not None else None
    r = urllib.request.Request(url, data=body, method=method)
    r.add_header("Authorization", f"token {TOKEN}")
    r.add_header("Accept", "application/vnd.github+json")
    r.add_header("User-Agent", "openclaw-deploy")
    if body: r.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(r) as resp:
        return json.loads(resp.read().decode())

ROOT = r"C:\Users\Administrator\.openclaw\workspace\charlizi-site"

# Files to push: repo-relative path -> local path
FILES = {
    "public/llms.txt": os.path.join(ROOT, "public", "llms.txt"),
    "public/robots.txt": os.path.join(ROOT, "public", "robots.txt"),
    "src/layouts/FactoryLayout.astro": os.path.join(ROOT, "src", "layouts", "FactoryLayout.astro"),
    "src/pages/index.astro": os.path.join(ROOT, "src", "pages", "index.astro"),
    "astro.config.mjs": os.path.join(ROOT, "astro.config.mjs"),
}

# 1. get current HEAD
ref = req(f"{API}/git/ref/heads/{BRANCH}")
head_sha = ref["object"]["sha"]
print("HEAD:", head_sha)

# 2. get base tree
commit = req(f"{API}/git/commits/{head_sha}")
base_tree = commit["tree"]["sha"]
print("base tree:", base_tree)

# 3. create blobs for each file
tree_items = []
for repo_path, local_path in FILES.items():
    with open(local_path, "rb") as f:
        content = f.read()
    blob = req(f"{API}/git/blobs", "POST", {
        "content": base64.b64encode(content).decode(),
        "encoding": "base64",
    })
    tree_items.append({
        "path": repo_path,
        "mode": "100644",
        "type": "blob",
        "sha": blob["sha"],
    })
    print(f"  blob {repo_path}: {blob['sha']} ({len(content)} bytes)")

# 4. create new tree
new_tree = req(f"{API}/git/trees", "POST", {
    "base_tree": base_tree,
    "tree": tree_items,
})
print("new tree:", new_tree["sha"])

# 5. create commit
new_commit = req(f"{API}/git/commits", "POST", {
    "message": "SEO/GEO: add llms.txt, Organization+Manufacturer & WebSite JSON-LD schema, AI-crawler-friendly robots.txt, exclude admin from sitemap",
    "tree": new_tree["sha"],
    "parents": [head_sha],
})
print("new commit:", new_commit["sha"])

# 6. update ref
req(f"{API}/git/refs/heads/{BRANCH}", "PATCH", {
    "sha": new_commit["sha"],
    "force": False,
})
print("PUSHED OK ->", new_commit["sha"])
