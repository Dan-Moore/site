import { allPosts } from "@/.contentlayer/generated"
import { allPages } from "@/.contentlayer/generated"
import '@next/env'
import RSS from 'rss';

export const metadata: Metadata = {
  title: process.env.RSS_META_TITLE,
  description: process.env.RSS_META_DESC,
  alternates: {
    types: {
      'application/rss+xml': process.env.RSS_META_FEED_URL,
    },
  }
};


const feed = new RSS({
  title: process.env.RSS_TITLE,
  description: process.env.RSS_DESC,
  site_url: process.env.RSS_SITE_URL,
  feed_url: process.env.RSS_FEED_URL,
  copyright: `${new Date().getFullYear()} ${process.env.RSS_COPYRIGHT_MSG}`,
  language: 'en',
  pubDate: new Date(),
});

export async function GET() {
    // Adding entries on the feed.
    allPosts.map((post) => {
      feed.item({
        title: post.title,
        guid: `${process.env.BASE_PATH}${post.slug}`,
        url: `${process.env.BASE_PATH}${post.slug}`,
        date: post.published_date,
        description: post.description,
        author: 'Daniel Moore',
      });
    });

    allPages
      .filter((page) => !page.draft && !page.hide_rss)
      .map((page) => {
        feed.item({
            title: page.title,
            guid: `${process.env.BASE_PATH}${page.slug}`,
            url: `${process.env.BASE_PATH}${page.slug}`,
                    date: page.published_date,
                    description: page.description,
                    author: 'Daniel Moore',
                  });
                });

return new Response(feed.xml({ indent: true }), {
  headers: {
    'Content-Type': 'application/atom+xml; charset=utf-8',
  },
});
}