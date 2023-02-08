// 記事全体
// アイキャッチ画像と記事の本体を含む
import EyeCatch from "./EyeCatch";
import PostDate from './PostDate';
import H1 from '../util/H1';

const ArticleView: React.FC<Props> = (props) => {
    return (
        <div className="flex flex-col gap-6">
            <EyeCatch src={props.eyeCatch} />
            <article>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <H1>{props.title}</H1>
                        <PostDate created={props.createdDate} lastUpdated={props.lastUpdatedDate} />
                    </div>
                    <div>
                        {props.children}
                    </div>
                </div>
            </article>
        </div>
    );
}
export default ArticleView;

type Props = {
    eyeCatch?: string,
    title: React.ReactNode | string,
    children: React.ReactNode,
    createdDate?: string,
    lastUpdatedDate?: string,
}
