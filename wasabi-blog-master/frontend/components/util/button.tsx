'use client';

import { MouseEventHandler } from "react";

type Props = {
    children: React.ReactNode,
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
};

const ColoredButton: React.FC<Props> = ({ children, className, onClick }) => {
    return <button className="bg-blue-600 px-8 py-2 rounded-md shadow-md transition hover:opacity-50" onClick={onClick}>
        {children}
    </button>
}
export default ColoredButton;
