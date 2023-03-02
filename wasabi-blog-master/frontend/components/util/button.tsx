'use client';

import { MouseEventHandler } from "react";

type Props = {
    children: React.ReactNode,
    theme?: 'danger' | 'orange' | 'ocean',
    className?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
};

const ColoredButton: React.FC<Props> = ({ children, theme, className, onClick }) => {
    let color = '';

    if (theme == 'danger') {
        color = 'text-white bg-red-600';
    }
    else if (theme == 'orange') {
        color = 'text-white bg-yellow-500';
    }
    else if (theme == 'ocean') {
        color = 'text-white bg-sky-500';
    }
    else {
        color = 'text-white bg-blue-600';
    }

    return <button className={["px-8 py-2 rounded-md shadow-md transition hover:opacity-50", color].join(' ')} onClick={onClick}>
        {children}
    </button>
}
export default ColoredButton;
