# Charlizi 商品详情标准模板（v2 · 含价格，全站统一）

> 依据：45,029 词真实词库 + charlizi1998 报价表（Nov 2026, FX 6.66）+ schema.org 商品规范
> 适用：全站所有商品详情页，新老款一律按此结构

---

## 设计原则：SEO 和 GEO 是两套不同的裁判

| | SEO（Googlebot） | GEO（GPTBot / PerplexityBot / ClaudeBot） |
|---|---|---|
| 选什么 | 关键词匹配 + 外链 | **能整句摘走当答案的句子** |
| 喜欢 | 标题含词、结构清晰 | **事实密度、具体数字、可验证参数** |
| 讨厌 | 关键词堆砌 | **空泛营销词**（premium quality / best-in-class） |

一句话：**每个段落都要能被 AI 单独摘走，且摘走之后依然是完整、有信息量的答案。**

---

## 一、标题层（三个位置各管一件事）

| 位置 | 长度 | 公式 | 实例 |
|---|---|---|---|
| `<title>` | 50–60 字符 | 核心词 + `OEM Wholesale \| Charlizi` | `Floral Lace Bralette OEM Wholesale \| Charlizi` |
| `<h1>` | 不限 | 核心词 + `— OEM Wholesale Manufacturer` | `Floral Lace Bralette — OEM Wholesale Manufacturer` |
| 卡片名 | 40–55 | 纯产品词 | `Floral Lace Bralette` |

### 词序（英文自然语序，不可颠倒）

```
图案 → 面料 → 特征 → 杯型 → 品类
Floral   Lace   Wireless  Balconette  Bra
```

### 选词硬规则

**必须包含 ≥1 个有真实搜索量的多词词根。**

同一款商品实测：

| 写法 | 命中词 | 搜索量 | 判定 |
|---|---|---|---|
| `Wine Red Lace Bralette` | 无 | **0** | ❌ 规则拼装 |
| `Floral Lace Bralette` | lace bralette | **1,074,404** | ✅ |

**禁止用来凑词的**：
- 颜色词（Grey / Wine Red）— 搜索量极低
- 裸泛词（`bra` 430 万，但榜上全是 Nike / Victoria's Secret，无望）
- 材质堆砌（`Nylon Spandex Cotton Modal Bra`）— 一眼机器味

---

## 二、详情页七段结构

### 段 1 · Intro（80–120 词）← AI 引用率最高

必须包含 **6 类事实**，缺一不可：

```
[产品全名] is a [品类] built with [面料成分+比例] over [内衬/结构].
The [领型] is a [专业术语] with [具体特征], which is what gives this style
its [剪影名]. Support comes from [支撑方式], so [实际穿着效果].
Available in [尺码范围] with [定制范围] for [目标客户].
```

真实示例（A3166 Floral Lace Balconette Bra）：

> Lace Balconette Underwire Bra starts with a floral lace shell over a soft stretch
> backing. The neckline is a balconette cut with a horizontal top edge that lifts from
> below, which is what gives this style its silhouette. Support is underwire with
> lightly lined cups, so the silhouette holds without adding bulk.

| # | 必须写的事实 |
|---|---|
| 1 | 面料成分 + 比例 |
| 2 | 结构 / 工艺（用专业术语） |
| 3 | 支撑方式 |
| 4 | 剪影 / 版型 |
| 5 | 尺码范围 |
| 6 | 定制能力 |

**绝对禁止**：`premium quality` / `best in market` / `high-end` / `designed for the
modern woman` — AI 不会引用空话。

⚠️ **模板尾巴是死刑**：147 条 intro 若共用同一句结尾（如 "Every order is built to
your tech pack..."），会被判重复内容。必须逐条写。

---

### 段 2 · Specifications（8–12 行）← GEO 的燃料

**AI 最爱抓表格，因为表格天然是"事实密度最高的结构"。**

| 字段 | 示例值 | 说明 |
|---|---|---|
| Style No. | A3166 | 必填，同时进 schema 的 `sku` |
| **Composition** | **86% Polyamide;14% Elastane** | **最硬的 GEO 事实，必须单独一行** |
| Category | Bras | |
| Fabric shell | 90% nylon / 10% spandex floral lace | **带比例** |
| Lining | Brushed cotton, 120 gsm | **带克重** |
| Underwire | Nickel-free coated steel | |
| Cup construction | Lightly lined, no padding | |
| Strap | Adjustable, 12 mm, convertible | **带尺寸** |
| Closure | 3-row hook and eye | |
| Size range | 32A–40DD | 与报价表一致 |
| **Availability** | **In stock / Made to order** | **新增，决定 MOQ 口径** |
| **Unit price** | **USD 3.41–4.38 (EXW)** | **新增，取自报价表** |
| MOQ | 30 pcs (现货) / 300 pcs (无库存) | **按实际库存** |
| Lead time | 25–35 days after sample approval | |
| Sampling | 7–10 days | |
| Certification | OEKO-TEX Standard 100, BSCI | |

**核心：每一行都要带数字和单位。** 「高弹力」不如「90% nylon / 10% spandex」。

**Composition 必须单独一行**：之前只有 `Fabrication: Floral lace`，没有成分比例，
AI 被问「面料是什么」时无法引用。直接从报价表的 `材质` 列取值。

---

### 段 3 · Features（4–6 条）← 每条一句完整话

❌ `Soft fabric`
✅ `The brushed cotton lining sits against skin and stays soft past 50 wash cycles
   because the nap is knitted in, not brushed on afterwards.`

判断标准：**把这句话单独摘出来发给别人，他能看懂吗？** 看不懂就重写。

---

### 段 4 · Use Cases（3–5 条）← GEO 与 SEO 差距最大处

AI 回答 "who makes X for Y" 时找的是明确的适用场景。

- Private label programmes for EU and US boutique retailers
- Underwear brands adding a lace balconette to an existing seamless range
- Subscription lingerie boxes needing consistent sizing across colourways
- Duty-free and travel retail with custom packaging

---

### 段 5 · FAQ（5–6 条）← 高价值

每条问题必须是**真实买家会打出来的整句话**，答案 40–80 词，**第一句直接给结论**。

必须覆盖 6 类：

| # | 问题 | 为什么重要 |
|---|---|---|
| 1 | What is the minimum order quantity? | AI 被问最多的 |
| 2 | How long does sampling take? | 决策关键 |
| 3 | Can you match a specific Pantone colour? | 定制能力验证 |
| 4 | What certifications do you hold? | 信任信号 |
| 5 | What is the production lead time? | 决策关键 |
| 6 | Can we visit your factory? | **B2B 强信任信号，AI 特别爱引用** |

示例：

> **Q**: What is the minimum order quantity for private label bras?
> **A**: 300 pieces per colourway, or 500 pieces mixed across sizes. Sample orders of
> 1–2 pieces are available before bulk commitment.

### ⚠️ HTML 语义要求（实测踩过的坑）

FAQ 的问题**必须是 `<h3>`**，光用 `<summary>` 裸文本不行：

```html
<!-- 错：AI 和 Google 都抽不到问-答对 -->
<details>
  <summary>What is the MOQ?</summary>
  <p>300 pcs per style.</p>
</details>

<!-- 对：问题包进 h3 -->
<details>
  <summary><h3>What is the MOQ?</h3></summary>
  <p>300 pcs per style.</p>
</details>
```

同理，Use Cases 的每条也应是 `<h3>`。

**实测对比**：全站 147 页原本 `h3` 数量为 **0**，修正后为 **8**（5 条 FAQ + 3 条 Use Cases）。
没有 h3 时，页面只有 h1/h2 两层，AI 无法定位细粒度实体块。

---

### 段 6 · Images

每张都要 alt，格式：`Floral Lace Balconette Bra - front view`。
当前 345 张已 0 缺失。

---

### 段 7 · Related Products（3–5 条）

指向**真实存在的同品类商品**，建立品类聚类。

---

## 三、结构化数据（JSON-LD）

### 当前已有（✅ 全部生效）

| # | 类型 | 作用 |
|---|---|---|
| 1 | Organization + Manufacturer | 品牌实体 |
| 2 | WebSite | 站点定义 |
| 3 | Product | 商品核心 |
| 4 | BreadcrumbList | 层级 |
| 5 | FAQPage | 问答直取（GEO 价值最高） |

### 本次新增（已进 PR #1）

```json
{
  "@type": "Product",
  "name": "Floral Lace Balconette Bra",
  "sku": "A3166",
  "mpn": "A3166",
  "material": "86% Polyamide;14% Elastane",
  "color": "Black, Nude",
  "size": "S-XL",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "3.41",
    "highPrice": "4.38",
    "offerCount": "4",
    "availability": "https://schema.org/InStock",
    "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 300, "unitCode": "C62" },
    "offers": [
      { "@type": "Offer", "price": "3.41",
        "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 500, "maxValue": 1000, "unitCode": "C62" } },
      { "@type": "Offer", "price": "3.59",
        "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 300, "maxValue": 500, "unitCode": "C62" } },
      { "@type": "Offer", "price": "3.87",
        "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 100, "maxValue": 300, "unitCode": "C62" } },
      { "@type": "Offer", "price": "4.38",
        "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 30, "maxValue": 100, "unitCode": "C62" } }
    ],
    "seller": { "@type": "Organization", "name": "Charlizi Intimate Apparel Co., Ltd." }
  },
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30
  }
}
```

**为什么这个改动价值最大**：之前 offers 有字段但**没有任何价格数字**，AI 回答
"how much does a lace bralette cost wholesale" 时从你页面抽不到答案，只能跳过你去引
别人。现在四个阶梯价都成了可引用的事实。

---

## 四、价格数据规则

### 来源
`charlizi1998-Quotation报价表.xlsx`（2026年11月版，汇率 6.66），三个 sheet：
- 单文胸-Bra（290 行）
- 文胸套装-Bra Set（200 行）
- M背心款（76 行）

### 四档 EXW 美元价

现货款四档；无库存款从 300 件起。

| 档位 | 数量 | 说明 |
|---|---|---|
| 小单 | 30–100 pcs | **仅现货款** |
| 中单 | 100–300 pcs | **仅现货款** |
| 大单 | 300–500 pcs | 现货 + 无库存均适用 |
| 柜单 | 500–1,000 pcs | 最低单价档 |

### 起订量口径（重要，别再写错）

| 类型 | 数量 | 判定依据 |
|---|---|---|
| **现货款** | 30 件起批 | 报价表里有真实报价：108 款 |
| **无库存款** | 300 件起订 | 报价表未录入，按同款参考定价：39 款 |

低于起订量的询盘表态：
> Below 300 pcs we assess case by case — send your target quantity,
> colourway count and delivery window and we will confirm what is feasible.

**别写成“所有款都 30 件起”** —— 之前就是这个问题，已修。

| 档位 | 含义 |
|---|---|
| 30–100 pcs | 小单，最贵 |
| 100–300 pcs | |
| 300–500 pcs | |
| 500–1000 pcs | 大货，最便宜 |

### 覆盖情况

| 类型 | 数量 | 处理 |
|---|---|---|
| 报价表命中真实价 | **108** | 完整输出 4 档阶梯价 |
| 报价表未录入 | **39** | 取同品类中位数，**不外露分档**（`source: estimated`） |

未录入的 39 款：M004/M006/M008/M041/M6031/Z418/A1123/A2172/A3139/A3166/B2763/
B6068/B6107/L2538/L2957/M2796/MR2641/MR2659/MR2752/MR2803/MR2974/MR3535/A2148/
A2161/A2168/A3103/A3113/A3116/A3120/A3131/A3140/A3151/A3155/A3211/MR3449/
MR3520/MR3865/YS2991

### 品类中位数（兜底用）

| 类目 | low (500+) | high (30-100) | 中位单价 |
|---|---|---|---|
| camisoles | $1.85 | $1.89 | $1.85 |
| bras | $2.12 | $2.12 | $2.12 |
| bra-sets | $2.63 | $3.43 | $2.68 |

> 单件文胸和小背心因为单价低、批量大，四档价格基本一致；套装才有明显阶梯差。

---

## 五、Google Trends 的正确用法

| 用途 | 做法 |
|---|---|
| ✅ 定方向 | seamless 上升 → 多推无缝款 |
| ✅ 找季节词 | 夏季 bralette / strapless 上升 |
| ✅ 发现新兴词 | sustainable bra / period underwear |
| ❌ 不要直接抄 | Trends 是 0–100 相对指数，**不是搜索量** |
| ❌ 不要用泛词 | `bra` 永远热门，零信息量 |

**正确链路**：Trends 定方向 → 亚马逊词库查真实搜索量 → 写进标题。

---

## 六、一页速查（给内容执行用）

```
标题   [图案][面料][特征][杯型][品类] OEM Wholesale | Charlizi   ≤60 字符
       必含 1 个有搜索量的多词词根，禁止颜色词凑数

Intro  80–120 词，含 6 类事实（面料比例/结构/支撑/剪影/尺码/定制）
       禁止空泛形容词，禁止与其他商品重复，禁止模板尾巴

Specs  8–12 行，每行带数字+单位，必须含 Style No. / 单价 / MOQ / 交期

Feat   4–6 条，每条一句能独立成立的完整话

Uses   3–5 条，明确写出适用客户类型

FAQ    5–6 条，覆盖 MOQ/打样/定制/认证/交期/看厂
       答案第一句直接给结论

Img    每张带 alt，格式「产品名 - 视角」

Schema Organization + WebSite + Product + Breadcrumb + FAQPage
       Product 必须含 sku / material / color / size
       offers 必须是 AggregateOffer 且带 lowPrice/highPrice/四档阶梯
       必须含 hasMerchantReturnPolicy
```

---

## 七、验收清单（每款上新前跑一遍）

**内容层**

- [ ] `<title>` 50–60 字符，含品牌，不含坏尾（`|` 悬空 / 截断单词）
- [ ] H1 唯一，含 `OEM Wholesale Manufacturer`
- [ ] 标题命中 ≥1 个有搜索量的多词词根
- [ ] Intro 前 60 字符在站内唯一（防重复内容）
- [ ] Intro 无 `premium quality` 类空词
- [ ] Intro 词数 73–110
- [ ] Meta description 130–160 字符

**结构层**

- [ ] Specs ≥8 行且每行带数字
- [ ] Specs 含 Style No. / Composition / Availability / MOQ
- [ ] FAQ 5 条，覆盖 6 类主题
- [ ] **FAQ 问题用 `<h3>`，不是裸 `<summary>`**
- [ ] **页面 `h3` 数量 ≥ 6**（实测：修前 0，修后 8）
- [ ] 所有 img 有 alt

**数据层**

- [ ] `sku` = specs 里的 Style No.
- [ ] `material` 已填（优先报价表成分，回退 specs）
- [ ] `offers` 是 AggregateOffer 且 lowPrice ≤ highPrice
- [ ] `eligibleQuantity.minValue` = 实际 MOQ（现货 30 / 无库存 300）
- [ ] 无库存款 `availability` 为 `PreOrder` 而非 `InStock`
- [ ] Related 全部指向真实存在的 slug

**图片层**

- [ ] 纯色背景棚拍，非卧室/窗边/街头生活场景
- [ ] 无手机、自拍杆、拍摄者入镜
- [ ] 无平台水印、促销贴纸、第三方品牌 logo
- [ ] 商品结构无遮挡（肩带、侧扣、背部需可见）

---

## 八、实测基线（2026-11-22，147 款全量）

用来对比后续改动是否退化：

```
title 长度        avg 52.4  max 60   超限 0
meta description  avg 146.5 max 164* 超限 0 (*HTML 实体误报)
intro 词数        avg 91.2  区间 73–110
h2                avg 5
h3                avg 8     (修复前 0)
specs 行数        avg 13.2
JSON-LD 块数      5        全页一致
低质图片          待审核（见下方）
```
