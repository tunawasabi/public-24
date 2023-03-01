const Tag: React.FC<{ name: string }> = ({ name }) => {
    return <span className="px-4 py-1 transition backdrop-brightness-150 bg-neutral-200 dark:bg-gray-700 hover:opacity-50">
        {name}
    </span>
}
export default Tag;
