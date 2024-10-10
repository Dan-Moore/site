import AiDemoComponent from "@/components/ai/card-grid-pagination";
import {getHomePageArticles} from "@/components/contentlayer-util";
import ToCards from "@/components/web-components";

/*

<AiDemoComponent />

getHomePageArticles().map((article) => (
        <ToCard article={article} />
      ))
*/


export default function HomePage() {
  return (
    <div className="prose dark:prose-invert">{ 
        <ToCards articles={getHomePageArticles()} />     
    }</div>);
}