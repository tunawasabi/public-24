import { NextApiRequest, NextApiResponse } from "next";
import { insertArticle } from "../../src/lib/db";
import Article from "../../src/lib/types/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export const Submit = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(400).json({ data: 'POST request only' });

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: '認証されていません' });
    }

    try {
        const article: Article = req.body.article;
        if (!(article.title.trim() && article.slug.trim() && article.content.trim() && article.tags)) throw 'Validation Error';
        await insertArticle(article);

        await res.revalidate(`/post/${article.slug}`);
        res.json({ data: 'you win!' });
    } catch (e) {
        res.status(400).json({ data: e.toString() });
    }
}
export default Submit;
