import H1 from "components/util/H1";

type Props = {
    title: string,
    actionbar?: React.ReactNode,
    children: React.ReactNode,
}

const MainView: React.FC<Props> = ({ title, actionbar, children }) => {
    return <div>
        <div className="flex slect-none">
            <H1>{title}</H1>
            {actionbar}
        </div>
        {children}
    </div>
}
export default MainView;
