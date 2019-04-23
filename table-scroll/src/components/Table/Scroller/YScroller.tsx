import * as React from 'react';

import { Scroller } from './Scroller';


const PAGE_HEIGHT = 850;

export class YScroller extends Scroller {

    public render(children: React.ReactNode): JSX.Element {
        return (
            <div style={{ position: 'relative', height: this.size }}>
                <div style={{ position: 'absolute', top: this.page.offset, left: 0, right: 0 }}>
                    {children}
                </div>
            </div>
        );
    }

    protected scrollTo(root: HTMLDivElement, offset: number): void {
        const rows = root.getElementsByClassName('table__body');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < rows.length; i++) {
            rows[i].scrollTop = offset;
        }
    }

    protected calculateDelta(index: number): number {
        const { height } = this.model.getRow(index);
        return height;
    }

    protected calculateDeltas(): number[] {
        const items = this.model.getRows();
        return items.map(item => item.height);
    }

    protected calculateClientSize(): number {
        const { current } = this.rootRef;
        const body = current!.getElementsByClassName('table__body')[0];
        return body.clientHeight || current!.clientHeight;
    }

    protected getPageSize(): number {
        return PAGE_HEIGHT;
    }

}
