import dateFormat from 'dateformat';
import { useEffect, useState } from 'react';

type Props = {
    /**
     * 作成日
     */
    created: string,

    /**
     * 最終更新日
     */
    lastUpdated: string,
}

const PostDate: React.FC<Props> = ({ created, lastUpdated }) => {
    // クライント側のタイムゾーンで日付をフォーマットする.
    // useEffect外で実行するとサーバとクライアントでの
    // 表示時刻が異なる可能性があり、Hydrationに失敗する
    const [time, setTime] = useState({
        created: '',
        lastUpdated: ''
    });
    useEffect(() => {
        setTime({
            created: dateFormat(created, 'yyyy年mm月dd日'),
            lastUpdated: dateFormat(lastUpdated, 'yyyy年mm月dd日')
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // 日付が不足していたら表示しない
    if (!(created && lastUpdated)) return null;

    return (<div className="flex flex-col text-slate-400 ml-auto gap-1">
        <div className="flex items-center gap-2">
            <time>
                {time.created}
            </time>
            作成
        </div>
        <div className="flex items-center gap-2">
            <time>
                {time.lastUpdated}
            </time>
            更新
        </div>
    </div>);
}
export default PostDate;
