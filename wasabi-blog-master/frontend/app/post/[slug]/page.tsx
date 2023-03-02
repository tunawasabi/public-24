import { notFound } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import Markdown from 'components/Markdown';
import ArticleView from 'components/post/ArticleView';
import SingleView from 'components/SingleView';
import Tags from 'components/TagList';
import Article from 'src/lib/types/Article';
import { getServerSession } from 'next-auth';
import ColoredButton from 'components/util/button';
import hostName from 'src/lib/hostname';
import Link from 'next/link';

export const dynamic = 'force-static';

const endpoint = new URL('/api/article', hostName)

export async function generateMetadata({ params }) {
    const res = await fetch(`${endpoint}/${params.slug}`, { cache: 'force-cache', next: { revalidate: 60 } });
    const article: Article = await res.json();

    return {
        title: article.title,
        openGraph: {
            title: article.title,
            description: article.content.split('\n')[0],
        }
    }
}

export default async function ArticlePage({ params }) {
    if (!params.slug) { notFound() }

    const res = await fetch(`${endpoint}/${params.slug}`, { next: { revalidate: 60 } });
    const article: Article = await res.json();

    if (!article.published) { notFound() }

    return <>
        <SingleView>
            <ArticleView
                eyeCatch={article.eye_catch}
                title={article.title}
                createdDate={article.created_date}
                lastUpdatedDate={article.last_updated_date}
            >
                {
                    (await getServerSession())
                        ? <ActionBar slug={article.slug} />
                        : null
                }
                <Markdown>{article.content}</Markdown>
                <Tags tags={article.tags} />
            </ArticleView>
        </SingleView>
    </>;

}

const ActionBar: React.FC<{ slug: string }> = ({ slug }) => {
    return <div className="w-full my-2">
        <Link href={`/ctrl/edit/${slug}`}><ColoredButton>編集</ColoredButton></Link>
    </div>
}
