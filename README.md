# Hello React!

This website was built from Shadcn's '[Next.js + Contentlayer](https://github.com/shadcn/next-contentlayer)' template.

The template is barebones project that comes preconfigured ContentLayer and Mdx files.

## ContentLayer
[ContentLayer](https://contentlayer.dev/docs/concepts/how-contentlayer-works-da5b2220 ) is a major convenience from the 
days of making a [Jekyll](https://jekyllrb.com/) webpage while in college.

ContentLayer scans the /content directory where mdx files exists for webpages and blog posts are stored and builds an easy to use api.

This one line import creates a collection of objects generated from a directory.   
```tsx
import { all<FolderName> } from "@/.contentlayer/generated"
```
In my case, I have a [Posts directory](/content/posts) use 'allPosts' as the import. The snippet below was taken from the home page, it retrieves
five of the latest posts and generates content for the home page with a bit of functional programming.  
Using the collection of all post objects generated by ContentLayer, I'm passing in a couple of functions that run on top of a set of posts.

```tsx
        allPosts
          .filter((post) => !post.draft)
          .sort((postA, postB) => {
            // Return codes [-1,0,1]: 
            //   -1: paDate is after pbDate.
            //    0: paDate is equal to pbDate.
            //    1: paDate is before pbDate.
             
            let paDate = new Date(postA.published_date).getTime();
            let pbDate = new Date(postB.published_date).getTime();
            
            if(paDate < pbDate) {
              return 1;
            } else if(paDate > pbDate) {
              return -1;
            }
            return 0;
          })
          .map((post) => (
            <article key={post._id}>
              <Link href={post.slug}>
                <h2>{post.title}</h2>
              </Link>
              {post.description && <p>{post.description}</p>}
            </article>
          ))
          .slice(0, 5) 
```
---
In the example above, I've created a simple process pipeline with four basic functions.  
Each of these dot methods takes in an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
that preforms a straight forward task.

1. Filter
    > The function being passed into the filter method is super basic, it returns a boolean value stored in the draft field on a Post object.  This one-liner removes any post with the draft status flag from the working collection.
   
2. Sort
    > The sort function compares two posts objects and sorts them in LIFO order.

3. Map
    > Map is being used to generate new collection of article tags for content generation.

4. Slice
    > Returns top five articles generated on the LIFO stack. 
    

Fireship has a good overview of functional programming with typescript.    
<a href="http://www.youtube.com/watch?feature=player_embedded&v=fsVL_xrYO0w
" target="_blank"><img src="http://img.youtube.com/vi/fsVL_xrYO0w/0.jpg"
alt="Fireship" width="500" height="281" border="10" /></a>

---

ContentLayer configuration is defined in [contentlayer.config.js](/contentlayer.config.js) located in the root directory.
The Post object is defined within this file, along with the configuration for the directory scan.
```tsx
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    published_date: {
      type: "date",
    },
    modified_date: {
      type: "date",
    },
    draft: {
      type: "boolean",
    },
  },
  computedFields,
}))
```

---

## Package Management
The project uses [pNpm package manager](https://pnpm.io/motivation) to manage dependencies.
Review [package.json](package.json) for current libraries being used by the website.

Here are a couple of common CLI pnpm commands.
```sh
# Common PNPM commands.

# Installing a packages listed in package.json
pnpm install 

# Runs the project locally
pnpm run dev

# Removing a package
pnpm rm @vercel/analytics

# Adding a package
pnpm add rss
```


## Environment Variables
There are three files used to keep track of when working with environment variables with Next.js.
1. [.env](.env)
   > Config file that contains key-value entries. By default, they can only be used on the server side of the app.
2. [next.config.js](next.config.js)
   > Here is where environment variables can be exposed on the client side of the application.
3. [envConfig.tsx](app/envConfig.tsx)
   > Typescript file within the app directory used to load in environment variables.

Usage when working with server side code is pretty straight forward.  You will need add the the import '@next/env' 
to start using process.env object which contains all the variables defined in the .env file.
```tsx
import '@next/env'
const foo = process.env.RSS_SITE_URL
```

## Creating Web Pages & Blog Posts
Web pages and blog posts are written in [.mdx files](https://mdxjs.com/docs/what-is-mdx/), 
located within the [content directory](/content).  

Every.mdx file starts with a header table which contains values for the fields defined in ContentLayer.
```md
---
title: Hello World!
description: Description of the post goes here
published_date: "2024-01-05"
modified_date: "2024-10-05"
draft: true
---

# Hello World!
```

Any .mdx file added to the posts directory will be scanned as a new blog post.
Local resources such as images, are stored in [/public](/public). 
## Site Map & RSS Feed

