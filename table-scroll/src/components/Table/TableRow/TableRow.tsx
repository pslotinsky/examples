import * as React from 'react';

import './TableRow.css'

import { Row } from '@models/Row';

import { TableCell } from '../TableCell';


interface IParams {
    index?: number;
    children?: React.ReactNode;
    model?: Row;
}

export function TableRow({ index, children, model }: IParams): JSX.Element {
    const className = (!index || index % 2 === 0)
        ? 'table__row'
        : 'table__row table__row_even';

    return (
        <div className={className}>
            {model
                ? model.getCells().map(item =>
                    <TableCell key={item.id} model={item} width={item.width} />
                )
                : children
            }
        </div>
    );
}
