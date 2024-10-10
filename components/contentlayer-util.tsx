import { Post, Page,  } from "@/.contentlayer/generated";
import { allPosts, allPages } from "@/.contentlayer/generated"

/** 
 * This file contains code for directly working with generated content from ContentLayer
 */


/**
 * Collection of flag that can be added to a MDX article header.
 * Sample use case would be adding hide_rss & hide_web flags on the 'About' 
 */
export const FlagTypes = {
  /**
   * Flag prevents a mdx article from appearing on the RSS feed.
   */
  HIDE_RSS: "hide_rss",
  /**
   * Flag prevents a mdx article from appearing within sitemap.xml.
   */
  HIDE_SITEMAP: "hide_sitemap",
  /**
   * Flag prevents a mdx article to be published to the web site.   
   */
  HIDE_WEB: "hide_web",
  /**
   * Flag prevents to ignore a mdx article everywhere.
   */
  HIDE: "hide_all",
}

/**
 * Collection of valid status codes for an article.
 */
export const ArticleStatus = {
  DRAFT: "draft", 
  PUBLISH: "publish", 
}

/**
 * Collection of articles for the home page
 * @returns 
 */
export function getHomePageArticles(){
  const articles = [
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  ]

  return articles.filter((article: Page | Post) => (!containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
}

/**
 * Returns a collection of articles in a published state.
 * Article with a future publication date, will be treated as drafts.
 */
export function getPublishPosts() {
  return getPublish(allPosts).filter((article) => !isSeries(article))
}

/**
 * Returns a collection of articles in a published state.
 * Article with a future publication date, will be treated as drafts.
 */
export function getPublishSeries() {
  return getPublish(allPosts).filter((article) => isSeries(article))
}

/**
 * Fetch's only the first article of a series.
 */
export function getFirstEntryOfSeries() {
  return getPublishSeries().filter((article) => (article.series.index == 1) );
}


/**
 * Returns a collection of articles in a published state.
 * Article with a future publication date, will be treated as drafts.
 */
export function getPublishPages() {
  return getPublish(allPages).filter((page) => !containsFlag(page, FlagTypes.HIDE_WEB)).sort(compareDates);
}

/**
 * Returns a collection of articles ready for publication.
 * Article with a future publication date, will be treated as drafts.
 * @param articles Post or Page object
 */
function getPublish(articles: Post[] | Page[] | any[]) {
  return articles.filter((article) => !isPublished(article)).sort(compareDates);
}


/**
 * Returns a collection of article for the RSS feed. 
 * @param article Post or Page object
 */
export function getRssArticles() {
  const articles = [
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  ]
  return articles.filter((article: Page | Post) => (containsFlag(article, FlagTypes.HIDE_RSS) || containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
}

/**
 * Returns a collection of article for the sitemap xml doc. 
 * @param article Post or Page object
 */
export function getSiteMapArticles() {
  // Getting a list of pages, series and posts.
  const articles = [
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  ]
  return articles.filter((article: Page | Post) => (containsFlag(article, FlagTypes.HIDE_SITEMAP) || containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
}

/**
 * Returns a date comparison between two articles.
 *   - If xArticle was published before yArticle, then -1.
 *   - If xArticle was published after yArticle, then 1.
 *   - If xArticle published date equals yArticle, then 0.
 * @param xArticle Post or Page object
 * @param yArticle Post or Page object
 * @returns boolean
 */
function compareDates(xArticle : Post | Page, yArticle : Post | Page) {
  if(
    xArticle === undefined || yArticle === undefined ||
    xArticle.publish === undefined || yArticle.publish === undefined) {
    console.log(`--- Sanity Log: Found articles without an publish date.  By default, it should revert to the current timestamp. ---`)
    // TODO: Refactor the sanity null checks out.
    return 0; // Should never trigger.
  }

  if(xArticle.publish < yArticle.publish) {
    return -1;
  } else if (xArticle.publish > yArticle.publish){
    return 1;
  }
  return 0;
}

/**
 * Checks if the article is in draft status
 * @param article Post or Page object
 * @returns boolean
 */
export function isDraft(article: Post | Page) {
  // Returning false if 
  //  1. Status is missing  
  //  2. In another state besides 'draft' 
  //  3. Contains the hide flag
  if(
      article.status === undefined || article.status !== ArticleStatus.DRAFT || containsFlag(article, FlagTypes.HIDE)
    ){
    return false;
  }

  // When timestamp is a future date, forcing to draft status.   
  if(article.publish !== undefined && new Date(article.publish) > new Date()) {
    return false;
  }
  return true;
}


/**
* Checks if the article is published
* @param article Post or Page object
* @returns boolean
*/
export function isPublished(article: Post | Page) {
    if(isDraft(article)){
      return false;
    }
    return (article.status !== undefined && article.status === ArticleStatus.PUBLISH);
}


/**
 * Check if the article belongs to a series.
 * @param article Post or Page object
 * @returns boolean
 */
export function isSeries (post: Post) {
  if(post.series === undefined) {
    return false;
  }
  return true;
}

/**
 * Checks if the article contains the given flag name
 * @param article Post or Page object
 * @param flagName Name of the flag, i.e. hide_rss
 */
export function containsFlag(article: Post | Page, flagName: string){
  for(const i in article.flags) {
    if(article.flags[i] === flagName){
      return true; // Found the given flag.
    }
  }
  return false;
}