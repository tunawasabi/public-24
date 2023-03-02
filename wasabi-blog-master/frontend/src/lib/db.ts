import mongo, { MongoClient, ObjectId, WithId } from 'mongodb'
import Article from './types/Article';

type ArticleDocument = Omit<Article, 'id'>;

// mongodbのurl
const uri = process.env.DB_URL;
const client = new MongoClient(uri!);

function toArticle(document: WithId<ArticleDocument>): Article {
    const { _id, ...rest } = document;
    return { id: _id.toString(), ...rest }
}

/**
 * クエリを送る
 */
async function connect<T extends mongo.Document = mongo.Document>(collection: string) {
    await client.connect();
    const db = client.db('blog');
    return db.collection<T>(collection);
}

/**
 * データベースから記事を取得します。
 */
export async function fetchArticle(slug: string): Promise<Article | null> {
    const collection = await connect<ArticleDocument>('articles');
    const result = await collection.findOne({ slug });
    if (!result) return null;

    return JSON.parse(JSON.stringify(toArticle(result)));
}

/**
 * 全ての記事を取得します
 */
export async function fetchAllArticle(include_draft: boolean): Promise<Article[]> {
    const collection = await connect<ArticleDocument>('articles');

    const query = include_draft ? {} : {
        published: true
    }

    const res = await collection
        .find(query)
        .map(doc => toArticle(doc))
        .toArray();

    return JSON.parse(JSON.stringify(res));
}

/**
 * タグがついている記事を取得します。
 */
export async function fetchArticleWithTag(tag: string): Promise<Article[]> {
    const query = { tags: { $all: [tag] } };
    const collection = await connect<ArticleDocument>('articles');

    const result = await collection.find(query).map(doc => toArticle(doc)).toArray();
    if (!result) throw 'ArticleNotFound';
    return JSON.parse(JSON.stringify(result));
}

/**
 * タグの一覧を取得します。
 */
export async function fetchAllTag(): Promise<string[]> {
    const collection = await connect<Article>('articles');
    const res = await collection.distinct('tags');
    return res;
}

/**
 * 最新の記事を取得
 */
export async function fetchLatestArticle(): Promise<WithId<Article> | null> {
    const collection = await connect<ArticleDocument>('articles');
    const result = await collection.findOne({ published: true }, {
        sort: { _id: -1 }
    });

    if (!result) {
        return null;
    };

    return JSON.parse(JSON.stringify(toArticle(result)));
}

/**
 * 最新n件を取得
 */
export async function fetchLatestArticles(limit: number, skip?: number): Promise<WithId<Article>[]> {
    const collection = await connect<ArticleDocument>('articles');
    const result = await collection.find({ published: true }, {
        projection: { content: 0 },
        sort: { _id: -1 },
        limit,
        skip,
    }).map(doc => toArticle(doc)).toArray();
    return JSON.parse(JSON.stringify(result));
}

/**
 * 記事を追加
 */
export async function insertArticle(article: Article) {

    // 最終更新時間を更新
    const created = new Date(article.created_date);
    const lastUpdated = new Date();

    const { id, ...rest } = article;

    // ドキュメントを生成する
    const document: WithId<ArticleDocument> = {
        _id: (ObjectId.isValid(id) ? new ObjectId(id) : new ObjectId()),
        ...rest
    }

    try {
        await client.connect();
        const db = client.db('blog');
        const articles = db.collection('articles');

        // クエリ
        await articles.updateOne({ _id: document._id },
            { $set: { ...document, created_date: created, last_updated_date: lastUpdated } },
            { upsert: true });
    } finally {
        await client.close();
    }
}

/**
 * 記事が作成された年月の一覧を取得する
 */
export async function getAllYearAndMonth() {
    await client.connect();
    const db = client.db('blog');
    const articles = db.collection('articles');

    const res = await articles.aggregate<{
        distinct: {
            year: String,
            month: String,
        }[]
    }>([
        {
            '$project': {
                'year': { '$year': '$created_date' },
                'month': { '$month': '$created_date' },
            }
        },
        {
            '$group': {
                '_id': null,
                'distinct': { '$addToSet': { 'year': '$year', 'month': '$month' } }
            }
        },
        {
            '$project': {
                '_id': 0, 'distinct': 1
            }
        }
    ]).toArray();

    return res[0].distinct;
}
