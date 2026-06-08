# Charlizi Factory — 部署到 GitHub + Cloudflare Pages

## 前提条件
- GitHub 账号
- Cloudflare 账号（域名 DNS 由 Cloudflare 托管）
- 域名 charlizi.com

## 第一步：推送到 GitHub

```bash
cd C:\Users\Administrator\.openclaw\workspace\charlizi-site

# 1. 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial B2B factory site"

# 2. 在 GitHub 新建仓库（不要勾 README）
#    仓库名: charlizi-site（或 charlizi.com）

# 3. 推上去
git remote add origin https://github.com/你的用户名/charlizi-site.git
git branch -M main
git push -u origin main
```

## 第二步：Cloudflare Pages 设置

1. 登录 Cloudflare Dashboard → Workers & Pages → Create → Pages
2. Connect to Git → 选刚建好的 `charlizi-site` 仓库
3. 构建设置：

| 字段 | 值 |
|------|---|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (留空) |
| **Node.js version** | 22+ |

4. **重要：环境变量**（点 Advanced 添加）

| 变量名 | 值 |
|--------|---|
| `NODE_VERSION` | `22` |

5. 点击 Save and Deploy → 等2分钟首次部署完成

## 第三步：绑定域名

1. Pages 项目 → **Custom domains** → Set up a custom domain
2. 输入 `charlizi.com`
3. Cloudflare 会自动添加 DNS 记录

## 第四步：区域屏蔽（中国IP）

方法 A（推荐）— Cloudflare WAF 规则：

1. Cloudflare Dashboard → Security → WAF → Create rule
2. Rule name: `Block China Traffic`
3. Field: `Country` | Operator: `equals` | Value: `CN`
4. Action: `Block`
5. Save

这样连 JS 加载都不需要，服务器层直接断。

方法 B（已内置）— 客户端 JS 屏蔽：
已在 FactoryLayout.astro 里加了 `ipapi.co` 检测脚本，Cloudflare 部署后自动生效。

## 第五步：验证

```
https://charlizi.com/          ← 访问正常
https://charlizi.com/products  
https://charlizi.com/contact   
```

用 VPN 模拟中国 IP 访问 → 应显示屏蔽提示

## 后续更新流程

```bash
# 修改代码后
git add .
git commit -m "修改了xxx"
git push

# Cloudflare Pages 会自动重新构建（~30秒）
```
