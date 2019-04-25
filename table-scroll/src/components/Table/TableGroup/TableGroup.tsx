import * as React from 'react';

import { Group } from '@models/Group';

import { Scroller } from '../Scroller';
import { TableCell } from '../TableCell';
import { TableRow } from '../TableRow';
import { TableRows } from '../TableRows';


interface IParams {
    model: Group;
    scroller: Scroller;
}

export function TableGroup({ model, scroller }: IParams): JSX.Element {
    return (
        <React.Fragment>
            <TableRows model={model.getRows()} scroller={scroller} />
            <TableRow>
                <TableCell fill={true}>{model.sum()}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}
