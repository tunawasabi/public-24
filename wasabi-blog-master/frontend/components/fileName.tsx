type Props = {
    type?: string,
    name: string,
}

const FileName: React.FC<Props> = ({ name, type }) => {
    return <div className="flex gap-2 items-center">
        <span className="font-mono">
            {name}
        </span>
    </div>
};
export default FileName;
