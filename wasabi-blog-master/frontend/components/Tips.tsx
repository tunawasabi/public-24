interface Props {
    title?: string,
    children: string,
    level: 'error' | 'warning' | 'info' | 'success'
}

const Tips: React.VFC<Props> = ({ title, children, level }) => {
    const validList = ['error', 'warning', 'info', 'success'];

    if (!validList.includes(level)) {
        return <>level指定が不正です！</>
    }

    const infoStyle = "flex flex-col gap-4 bg-sky-100 dark:bg-[#163852] text-sky-900 dark:text-blue-100 px-4 py-4";

    return <div className={infoStyle}>
        {title ? <span className="font-sans font-black">{title}</span> : null}
        <div>
            {children}
        </div>
    </div>

}
export default Tips;
