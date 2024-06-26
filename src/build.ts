import fs from "fs";
import path from "path";
// SPOOPY BUG: do not reorder the next two lines!!!!!
import renderPage from "./lib/render/render";
import {buildPageTree, getPageBaseDir, loadPageIndex, NavTree, pageIdToLogical, type PageIndex} from "./lib/content";
import {loadYamlTree} from "./lib/utils/files";
import {buildAndWriteSearchIndex, type SearchDoc} from "./lib/search";
import buildResources from "./lib/resources";
import { buildSitemap } from "./lib/sitemap";
import { buildAndWriteRedirects } from "./lib/redirects";
import { Lang } from "./lib/utils/localization";
import loadStructuredData from "./data";

export type BuildOpts = {
  contentDir: string;
  outputDir: string;
  baseUrl: string;
  noThumbs?: boolean;
};

async function renderPages(pageIndex: PageIndex, globalData: any, buildOpts: BuildOpts): Promise<{searchDocs: SearchDoc[], pageTrees: Record<Lang, NavTree>}> {
  const pageTrees: Record<Lang, NavTree> = {};

  //for all pages, and for all of their languages...
  const searchDocs = await Promise.all(Object.entries(pageIndex).flatMap(([pageId, pageDataByLang]) => {
    return Object.entries(pageDataByLang).map(async ([lang, pageData]) => {
      const baseDir = getPageBaseDir(pageId, buildOpts);
      const outputDir = path.join(buildOpts.outputDir, ...pageIdToLogical(pageId));
      const outputFileName = path.join(outputDir, lang == "en" ? "index.html" : `${lang}.html`);
      const localData = loadYamlTree(baseDir, {nonRecursive: true});
      const pageTree = pageTrees[lang] ?? (pageTrees[lang] = buildPageTree(pageIndex, "/", lang));

      //render the page to HTML and also gather search index data
      const renderOutput = renderPage({
        baseUrl: buildOpts.baseUrl,
        noThumbs: buildOpts.noThumbs,
        preloadJson: true,
        debug: !!process.env.C20_DEBUG,
        pageId: pageId,
        lang,
        ast: pageData.ast,
        front: pageData.front,
        localData: await localData,
        globalData,
        pageIndex,
        pageTree,
      });

      await fs.promises.mkdir(outputDir, {recursive: true});
      await fs.promises.writeFile(outputFileName, renderOutput.htmlDoc, "utf8");
      return pageData.front.noSearch ? null : renderOutput.searchDoc;
    });
  }));
  //return all search docs so they can be written to a single file (for this lang)
  return {searchDocs: searchDocs.filter(it => it != null) as SearchDoc[], pageTrees};
}

async function writePageTrees(pageTrees: Record<Lang, NavTree>, buildOpts: BuildOpts) {
  await fs.promises.mkdir(path.join(buildOpts.outputDir, "assets"), {recursive: true});
  await Promise.all(Object.entries(pageTrees).map(async ([lang, pageTree]: [string, any]) => {
    await fs.promises.writeFile(path.join(buildOpts.outputDir, "assets", `page-tree_${lang}.json`), JSON.stringify(pageTree), "utf8");
  }));
}

export default async function buildContent(buildOpts: BuildOpts) {
  const data = loadStructuredData();
  const pageIndex = loadPageIndex(buildOpts.contentDir);

  await Promise.all([
    buildResources(await pageIndex, buildOpts),
    renderPages(await pageIndex, await data, buildOpts)
      .then(({searchDocs, pageTrees}) => Promise.all([
        buildAndWriteSearchIndex(searchDocs, buildOpts),
        writePageTrees(pageTrees, buildOpts),
      ])),
    buildSitemap(await pageIndex, buildOpts),
    buildAndWriteRedirects(await pageIndex, buildOpts)
  ]);
}