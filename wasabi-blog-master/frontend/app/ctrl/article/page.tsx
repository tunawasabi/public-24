import Link from "next/link";
import { Suspense } from "react";
import ColoredButton from "../../../components/util/button";
import { fetchAllArticle } from "../../../src/lib/db";
import Loading from "./loading";
import MainView from "../mainView";
import Article from "src/lib/types/Article";

export const metadata = {
    title: '記事'
}

export default async function ArticleManagerPage() {
    const articles = await fetchAllArticle(true);

    return <MainView title="記事" actionbar={
        <Link href="/ctrl/edit/new" className="ml-auto">
            <ColoredButton>新規作成</ColoredButton>
        </Link>
    }>
        記事の一覧が表示されます
        <Suspense fallback={<Loading />}>
            <ul className="list-none px-0">
                {
                    articles.map(article => {
                        return <Entry key={article.slug} {...article} />
                    })
                }
            </ul>
        </Suspense>
    </MainView>
}

const Entry: React.FC<Article> = (e) => {
    return <li key={e.id} className="transition hover:backdrop-brightness-95 dark:hover:backdrop-brightness-200 px-6 py-4">
        <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-end">
                <span className="font-black text-2xl font-sans">
                    <Link href={`/post/${e.slug}`} className="hover:underline">
                        {e.title}
                    </Link>
                </span>
                <span className="text-gray-400 gap-4 text-sm font-mono">
                    {e.id}
                </span>
            </div>
            <div className="flex flex-row gap-1 text-sm">
                <span className="text-gray-400">
                    slug:
                    {e.slug}
                </span>
                {
                    e.published ?
                        <span className="text-green-500">公開中</span>
                        : <span className="font-bold text-amber-400">下書き</span>
                }
            </div>
            <div className="flex flex-row gap-2">
                <Link href={`ctrl/edit/${e.slug}`} className="textlink" prefetch={false}>
                    編集
                </Link>
                <span className="text-gray-400">
                    作成: {e.created_date}・
                    最終更新日: {e.last_updated_date}
                </span>
            </div>
        </div>
    </li>
}
