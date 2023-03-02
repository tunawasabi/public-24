import hostName from "src/lib/hostname";
import Article from "src/lib/types/Article";
import EditPanel from "./editPanel";

export const metadata = {
    title: '投稿・編集'
}

async function fetchArticleOrNew(slug: string): Promise<Article> {
    if (slug != 'new') {
        const res = await fetch(`${hostName}/api/article/${slug}`, { cache: 'no-store' });
        const article: Article = await res.json();
        if (!article) {
            return {
                id: '',
                title: '',
                slug: slug,
                content: '',
                published: true,
                tags: [],
                created_date: (new Date()).toISOString(),
            }
        }
        return article;
    } else {
        return {
            id: '',
            title: '',
            slug: '',
            content: '',
            published: true,
            tags: [],
            created_date: (new Date()).toISOString(),
        }
    }
}

export default async function EditPage({ params }: { params: { slug: string } }) {
    const article = await fetchArticleOrNew(params.slug);

    return <EditPanel article={article} />
}
