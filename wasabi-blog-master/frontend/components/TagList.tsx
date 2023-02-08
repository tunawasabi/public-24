import Link from 'next/link';
import Tag from './util/Tag';

const TagList: React.FC<{ tags: string[] }> = ({ tags }) => {
    return (
        <div className='flex gap-2 items-center flex-wrap'>
            {
                tags?.map((e, num) =>
                    <Link href={`/tag/${e}`} key={num}>
                        <Tag name={e} />
                    </Link>
                ) ?? 'タグなし'
            }
        </div>
    );
};
export default TagList;
