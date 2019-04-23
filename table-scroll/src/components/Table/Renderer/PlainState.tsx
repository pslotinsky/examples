import * as React from 'react';

import { Row } from '@models/Row';

import { Scroller, XScroller, YScroller } from '../Scroller';
import { TableRows } from '../TableRows';
import { State, StateName } from './State';


export class PlainState extends State {

    public name: StateName = StateName.Plain;

    public render(): JSX.Element {
        return this.scrollerY.render(
            <TableRows scroller={this.scrollerX} model={this.getRows()} />
        );
    }

    protected createScrollerX(): Scroller {
        return new XScroller({
            model: this.model,
            rootRef: this.rootRef
        });
    }

    protected createScrollerY(): Scroller {
        return new YScroller({
            model: this.model,
            rootRef: this.rootRef
        });
    }

    protected getRows(): Row[] {
        const { start, end } = this.scrollerX.page;

        return this.model.getRows()
            .slice(this.scrollerY.page.start, this.scrollerY.page.end)
            .map(item => {
                const row = new Row();
                row.id = item.id;
                row.cells = item.cells.slice(start, end);
                return row;
            });
    }

}
