import mongo, { MongoClient, ObjectId, WithId } from 'mongodb'
import Article from './types/Article';

// mongodbのurl
//const uri = 'mongodb://dbusr:dbpass@mongo:27017/';
const uri = "URLは非公開" /* セキュリティ上の理由で非公開とします */
const client = new MongoClient(uri);

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
export async function fetchArticle(slug: string): Promise<mongo.WithId<Article> | null> {
    const collection = await connect<Article>('articles');
    const result = await collection.findOne({ slug });
    if (!result) return null;
    return JSON.parse(JSON.stringify(result));
}

/**
 * タグがついている記事を取得します。
 */
export async function fetchArticleWithTag(tag: string) {
    const query = { tags: { $all: [tag] } };
    const collection = await connect<Article>('articles');

    const result = await collection.find(query).toArray();
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
export async function fetchLatestArticle(): Promise<WithId<Article>> {
    const collection = await connect<Article>('articles');
    const result = await collection.findOne({ published: true }, {
        sort: { _id: -1 }
    });

    if (!result) {
        return null;
    };

    return JSON.parse(JSON.stringify(result));
}

/**
 * 最新n件を取得
 */
export async function fetchLatestArticles(limit: number, skip?: number): Promise<WithId<Article>[]> {
    const collection = await connect<Article>('articles');
    const result = await collection.find({ published: true }, {
        projection: { content: 0 },
        sort: { _id: -1 },
        limit,
        skip,
    }).toArray();
    return JSON.parse(JSON.stringify(result));
}

/**
 * 記事を追加
 */
export async function insertArticle(article: mongo.WithId<Article>) {

    // 最終更新時間を更新
    const created = new Date(article.created_date);
    const lastUpdated = new Date();

    // idが空欄なら新たに生成する．
    const id = new ObjectId(article._id || null);

    try {
        await client.connect();
        const db = client.db('blog');
        const articles = db.collection('articles');

        // クエリ
        await articles.updateOne({ _id: id },
            { $set: { ...article, _id: id, created_date: created, last_updated_date: lastUpdated } },
            { upsert: true });
    } finally {
        await client.close();
    }
}
