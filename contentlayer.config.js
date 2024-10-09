import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files"

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
}


/**
 * Shared fields used between Pages and Post objects.
 */
const globals = {
  /**
   * Title of the <Page|Post>.
   */
  title: {
    type: "string",
    required: true,
  },
  /**
   * Brief description of the <Page|Post>. 
   */
  description: {type: "string"},
  /**
   * Status of the <Page|Post>
   *  - draft: <Page|Post> is still being worked on and not set for publication
   *  - publish: <Page|Post> is set to be published
   *  - hide: <Page|Post> is set to be hidden and not displayed at all.
   */
  status: {
    // TODO: Draft and Hide share identical features. 
    //       ----------------------------------------------------
    //       Adding 'Hide' flag, haven't implemented anything yet.
    //       Want to have Draft pages to appear only during local or dev builds. 
    //       The Hide keyword will stop any .mdx file from being published into a web page.
    type: "enum",
    options: ["draft", "publish", "hide"],
    default: "draft"
  },
  /**
   * Keywords tags associated with the <Page|Post>.
   * tags: ['foo', 'bar']
   */
  tags: { 
    type: 'list', 
    of: { type: 'string' }, 
    default: [] 
  },
  /**
   * Date of publication. Future dates are accepted, but will block publishing the <Page|Post>.
   */
  publish: {
    type: "date",
    default: new Date().toLocaleDateString(),
  },
  /**
   * Date of last modification.  Tracks the last edit on a <Page|Post> .
   */
  modified: {
    type: "date",
    default: new Date().toLocaleDateString(),
  },
  /**
   * Control flags of the article.
   */
  flags: { 
    type: 'list', 
    of: { type: 'string' }, 
    default: [] 
  },
}

/**
 * Page object created from .mdx file found within the '/pages' directory. 
 */
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: globals,
  computedFields,
}))

/**
 * Series are a collection of blog posts or pages.
 * ---
 * series:
 *   title: Series title goes here
 *   description: Brief description of the series
 */
const Series = defineNestedType(() => ({
  name: 'Series',
  fields: {
    /**
     * Title of the series
     */
    title: {type: "string",},
    /**
     * Brief description of the Series
     */
    description: {type: "string",},

    /**
     * Series Index - Number of where the Post falls in the series 
     */
    index:{
      type: "number",
      default: 0,
    },
  },    
}))

/**
 * Post object created from .mdx file found within the '/posts' directory. 
 * Posts can be grouped together into a series.
 */
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  // Using the spread operator to merge in the global fields.
  fields: {...{

  series: {
    type: 'nested',
    of: Series,
  },
    

  }, ...globals },
  computedFields,
}))

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post, Page],
})