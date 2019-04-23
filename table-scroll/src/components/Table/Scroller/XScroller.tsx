import * as React from 'react';

import { Scroller } from './Scroller';


const PAGE_WIDTH = 1000;

export class XScroller extends Scroller {

    public render(children: React.ReactNode): JSX.Element {
        return (
            <div style={{ position: 'relative', width: this.size }}>
                <div style={{ position: 'absolute', left: this.page.offset }}>
                    {children}
                </div>
            </div>
        );
    }

    protected scrollTo(root: HTMLDivElement, offset: number): void {
        const rows = root.getElementsByClassName('table__rows-body');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < rows.length; i++) {
            rows[i].scrollLeft = offset;
        }
    }

    protected calculateDelta(index: number): number {
        const { width } = this.model.getColumn(index);
        return width;
    }

    protected calculateDeltas(): number[] {
        const items = this.model.getColumns();
        return items.map(item => item.width);
    }

    protected calculateClientSize(): number {
        const { current } = this.rootRef;
        const body = current!.getElementsByClassName('table__rows-body')[0];
        return body.clientWidth;
    }

    protected getPageSize(): number {
        return PAGE_WIDTH;
    }

}
