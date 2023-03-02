import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { fetchArticle } from "../../../../src/lib/db";

export async function GET(_: Request, context: { params }) {
    if (!context.params.slug) { notFound() }

    const article = await fetchArticle(context.params.slug);

    if (!article) { notFound() }
    return NextResponse.json(article);
}

/*
export async function POST(req: Request, context: { params }) {
    const session = await getServerSession();
    if (!session) { notFound() }

    try {
        const article: Article = req.body.article;
        if (!(article.title.trim() && article.slug.trim() && article.content.trim() && article.tags)) throw 'Validation Error';
        await insertArticle(article);

        await res.revalidate(`/post/${article.slug}`);
        res.json({ data: 'you win!' });
    } catch (e) {
        return NextResponse.json({
            data: e.toString()
        }, {status: 400})
    }
}
*/
