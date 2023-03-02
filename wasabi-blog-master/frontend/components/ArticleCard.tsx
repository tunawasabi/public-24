import Link from "next/link";
import type Article from "../src/lib/types/Article";
import Image from "next/image";

const ArticleCard: React.FC<Article> = article => {
    return (
        <div className="shadow-md rounded-md overflow-hidden transition hover:brightness-125 hover:underline">
            <Link href={`/post/${article.slug}`}>
                <div className="relative w-full aspect-[8/5] bg-white dark:bg-neutral-700">
                    <Image src={article.eye_catch || '/kiji.png'} alt={article.title} fill className="object-contain" />
                </div>
                <div className="p-2 font-sans font-black">{article.title}</div>
            </Link>
        </div>
    );
}
export default ArticleCard;
