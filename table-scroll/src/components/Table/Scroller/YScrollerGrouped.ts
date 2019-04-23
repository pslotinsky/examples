import { YScroller } from './YScroller';


export class YScrollerGrouped extends YScroller {

    protected calculateDelta(index: number): number {
        const row = this.model.getRow(index);
        return row.isLast() ? row.height * 2 : row.height;
    }

    protected calculateDeltas(): number[] {
        const rows = this.model.getRows();
        return rows.map((_, index) => this.calculateDelta(index));
    }

    protected calculateClientSize(): number {
        const { current } = this.rootRef;
        const body = current!.getElementsByClassName('table__body')[0];
        return body.clientHeight || current!.clientHeight;
    }

}
