import {getRssArticles} from "@/components/contentlayer-util";

import '@next/env'
import RSS from 'rss';

/*
export const metadata: Metadata = {
  title: process.env.RSS_META_TITLE,
  description: process.env.RSS_META_DESC,
  alternates: {
    types: {
      'application/rss+xml': process.env.RSS_META_FEED_URL,
    },
  }
};
*/

const feed = new RSS({
  title: `${process.env.RSS_TITLE}`,
  description: process.env.RSS_DESC,
  site_url: `${process.env.RSS_SITE_URL}`,
  feed_url: `${process.env.RSS_FEED_URL}`,
  copyright: `${new Date().getFullYear()} ${process.env.RSS_COPYRIGHT_MSG}`,
  language: 'en',
  pubDate: new Date(),
});

export async function GET() {
    // Adding entries on the feed.

    getRssArticles()
      .map((article) => {
        feed.item({
            title: article.title,
            guid: `${process.env.BASE_PATH}${article.slug}`,
            url: `${process.env.BASE_PATH}${article.slug}`,
                    date: `${article.publish}`,
                    description: `${article.description}`,
                    author: 'Dan Moore',
                  });
                });

return new Response(feed.xml({ indent: true }), {
  headers: {
    'Content-Type': 'application/atom+xml; charset=utf-8',
  },
});
}