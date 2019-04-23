import * as React from 'react';

import './TableHead.css'

import { Column } from '@models/Column';

import { TableCell } from '../TableCell';
import { TableRow } from '../TableRow';


interface IParams {
    model: Column[];
}

export function TableHead({ model }: IParams): JSX.Element {
    return (
        <div className="table__head">
            <div className="table__rows">
                <div className="table__rows-body">
                    <TableRow>
                        {model.map(item => (
                            <TableCell key={item.id}>{item.name}</TableCell>
                        ))}
                    </TableRow>
                </div>
                <div className="table__rows-fixed-column">
                    <TableRow>
                        <TableCell>fixed</TableCell>
                    </TableRow>
                </div>
            </div>
        </div>
    );
}
