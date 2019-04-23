import { Table as TableModel } from '@models/Table';

import { Scroller } from '../Scroller';


interface IParams {
    model: TableModel;
    rootRef: React.RefObject<HTMLDivElement>;
}

export enum StateName {
    Plain,
    Grouped
}

export const ROW_HEIGHT = 40;

export const MIN_RENDERED_ROWS_COUNT = 30;

export const MIN_RENDERED_COLUMNS_COUNT = 9;

export class State {

    public name: StateName;

    protected model: TableModel;

    protected rootRef: React.RefObject<HTMLDivElement>;

    protected scrollerX: Scroller;

    protected scrollerY: Scroller;

    constructor({
        model,
        rootRef
    }: IParams) {
        this.model = model;
        this.rootRef = rootRef;
        this.scrollerX = this.createScrollerX();
        this.scrollerY = this.createScrollerY();
    }

    public update(): void {
        this.scrollerX.update();
        this.scrollerY.update();
    }

    public scrollLeft(): void {
        this.scrollerX.dec();
    }

    public scrollRight(): void {
        this.scrollerX.inc();
    }

    public scrollUp(): void {
        this.scrollerY.dec();
    }

    public scrollDown(): void {
        this.scrollerY.inc();
    }

    public isPageChanged(): boolean {
        return (this.scrollerX.isPageChanged() || this.scrollerY.isPageChanged());
    }

    public render(): JSX.Element {
        throw new Error('render not defined');
    }

    protected createScrollerX(): Scroller {
        throw new Error('createScrollerX not defined');
    }

    protected createScrollerY(): Scroller {
        throw new Error('createScrollerY not defined');
    }

}
