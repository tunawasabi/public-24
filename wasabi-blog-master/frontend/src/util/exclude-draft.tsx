import Article from "../lib/types/Article";

export default function excludeDraftArticle(articles: Article[]) {
    return articles.filter(e => e.published)
}
