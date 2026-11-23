/**
 * style-titles-override.ts
 *
 * 把 scripts/gen_titles_v2.py 生成的标题/SEO/款号覆盖到 style 内容上。
 *
 * 为什么不直接改 product-style-content.ts？
 *   那个文件是 AUTO-GENERATED（scripts/_gen_style_content.py 产出），
 *   手改会被下次生成覆盖。这里做成独立覆盖层，生成脚本重跑也不丢。
 *
 * 数据来源优先级：
 *   1. style-titles-v2.json   —— 标题/SEO（批发意图为主 + 零售词为辅 + 款号收尾）
 *   2. style-code-confirmed.json —— 人工核对确认的款号（若存在则最权威）
 *   3. style-code-map.json    —— 自动探测到的款号（仅 slug 内嵌的 1 个）
 */
import titlesV2 from './style-titles-v2.json';
import titlesExtra from './style-titles-extra.json';
import type { StyleContent } from './product-style-content';

type TitleRec = {
  category: string;
  oldTitle: string;
  newTitle: string;
  trunk: string;
  wholesaleTerm: string;
  retailAux: string;
  code: string | null;
  colors: string[];
  features: string[];
  seoTitle: string;
  seoDescription: string;
  ldName: string;
  hasCode: boolean;
};

const TITLES = titlesV2 as Record<string, TitleRec>;

// styleExtra 的 70 个「款号即 slug」页面，key 形如 "bras/b6043"
const TITLES_EXTRA = titlesExtra as Record<string, TitleRec>;

/**
 * 用生成结果覆盖单个 style。
 * - baseTitle  → 新标题（带批发词 + 款号），用于 H1 / 面包屑 / 正文
 * - seoTitle   → ≤60 字符的 meta title
 * - 另附 styleCode 字段供模板按需取用
 */
export function applyTitleOverride(s: StyleContent): StyleContent & { styleCode?: string | null } {
  // 先查 styleExtra 那批（key = category/slug），再查常规 68 款（key = slug）
  const rec = TITLES_EXTRA[`${s.category}/${s.slug}`] ?? TITLES[s.slug];
  if (!rec) return s;
  return {
    ...s,
    baseTitle: rec.newTitle,
    // h1 是独立字段，必须同步覆盖，否则页面上大标题还是旧的
    h1: rec.newTitle,
    seoTitle: rec.seoTitle,
    seoDescription: rec.seoDescription,
    styleCode: rec.code ?? null,
  };
}

/** 批量覆盖：给 getStaticPaths 用 */
export function applyTitleOverrides<T extends StyleContent>(map: Record<string, T>) {
  const out: Record<string, T & { styleCode?: string | null }> = {};
  for (const [slug, s] of Object.entries(map)) {
    out[slug] = applyTitleOverride(s) as T & { styleCode?: string | null };
  }
  return out;
}

/** 统计：多少款已带上款号（给构建日志用） */
export function codeStats() {
  const v2 = Object.values(TITLES);
  const ex = Object.values(TITLES_EXTRA);
  return {
    total: v2.length + ex.length,
    withCode: v2.filter((v) => v.hasCode).length + ex.filter((v) => v.hasCode).length,
    extraWithQuote: ex.filter((v: any) => v.hasQuoteData).length,
  };
}
