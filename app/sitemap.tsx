import { MetadataRoute } from 'next'
import { allPosts } from "@/.contentlayer/generated"
import { allPages } from "@/.contentlayer/generated"
import '@next/env'

export default function sitemap(): MetadataRoute.Sitemap {
  // Sample url element found in sitemap.xml
  /*<url>
      <loc>https://daniel-moore.net/pages/about</loc>
      <lastmod>2023-01-02T00:00:00.000Z</lastmod>
    </url>*/
  const pageUrls = allPages
  .map((page) => ({
    // Slug comes pre-appended with '/' in path
    url: `${process.env.SITE_MAP_URL}${page.slug}`,
    lastModified: page.modified || page.modified,
  }))

  const postUrls = allPosts
    .map((post) => ({
      url: `${process.env.SITE_MAP_URL}${post.slug}`,
      lastModified: post.modified || post.modified,
    }))

  return [...pageUrls, ...postUrls]
}