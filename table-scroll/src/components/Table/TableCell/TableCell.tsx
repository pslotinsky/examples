import * as classNames from 'classnames';
import * as React from 'react';

import './TableCell.css'


interface IParams {
    children: React.ReactNode;
    fill?: boolean;
}

export function TableCell({ children, fill }: IParams): JSX.Element {
    const className = classNames(
        'table__cell',
        fill && 'table__cell_fill'
    );

    return <div className={className}>{children}</div>;
}
