import * as React from 'react';

import './TableRows.css'

import { Row } from '@models/Row';

import { Scroller } from '../Scroller';
import { TableCell } from '../TableCell';
import { TableRow } from '../TableRow';


interface IParams {
    model: Row[];
    scroller?: Scroller;
}

export function TableRows({ model, scroller }: IParams): JSX.Element {
    const rows = model.map((row, index) => <TableRow key={row.id} model={row} index={index} />);

    return (
        <div className="table__rows">
            <div className="table__rows-body">
                {scroller ? scroller.render(rows) : rows }
            </div>
            <div className="table__rows-fixed-column">
                {model.map((row, index) => (
                    <TableRow key={row.id} index={index}>
                        <TableCell>{row.id}</TableCell>
                    </TableRow>
                ))}
            </div>
        </div>
    );
}
