import { Post, Page,  } from "@/.contentlayer/generated";
import { allPosts, allPages } from "@/.contentlayer/generated"

/**
 * Collection of flag types
 */
export const FlagTypes = {
  /**
   * Flag to hide an article on the RSS feed.
   */
  HIDE_RSS: "hide_rss",
  /**
   * Flag to hide an article on the site map.
   */
  HIDE_SITEMAP: "hide_sitemap",
  /**
   * Flag to hide an article on the web page.
   */
  HIDE_WEB: "hide",
}

/**
 * Collection of valid status codes for an article.
 */
export const ArticleStatus = {
  DRAFT: "draft", 
  PUBLISH: "publish", 
  HIDE: "hide",
}

export function getHomePage(){
  return {
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  }.filter((article: Page | Post) => (containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
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
 * @param articles 
 */
function getPublish(articles: Post[] | Page[] | any[]) {
  return articles.filter((article) => !isPublished(article)).sort(compareDates);
}


/**
 * Returns a collection of article for the RSS feed. 
 * @param article 
 */
export function getRssArticles() {
  return {
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  }.filter((article: Page | Post) => (containsFlag(article, FlagTypes.HIDE_RSS) || containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
}

/**
 * Returns a collection of article for the sitemap xml doc. 
 * @param article 
 */
export function getSiteMapArticles() {
  return {
    ...getPublishPages(), 
    ...getPublishSeries(), 
    ...getPublishPosts(),
  }.filter((article: Page | Post) => (containsFlag(article, FlagTypes.HIDE_SITEMAP) || containsFlag(article, FlagTypes.HIDE_WEB))).sort(compareDates);
}

/**
 * 
 * @param xArticle 
 * @param yArticle 
 * @returns 
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
 * @param article 
 * @returns boolean
 */
export function isDraft(article: Post | Page) {
  // Returning false if status is missing or in another state besides 'draft'
  if(
      article.status === undefined || 
      (article.status !== ArticleStatus.DRAFT && article.status !== ArticleStatus.HIDE)) {
    return false;
  }

  // If publication timestamp is a future date, forcing a draft status.   
  if(article.publish !== undefined && new Date(article.publish) > new Date()) {
    return false;
  }

  return true;
}


/**
* Checks if the article is published
* @param article Either Post or Page object
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
 * @param article 
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
 * @param article 
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


