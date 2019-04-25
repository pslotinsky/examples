import { Table as TableModel } from '@models/Table';

import { PageChangedHandler, Scroller } from '../Scroller';


export interface IStateParams {
    model: TableModel;
    rootRef: React.RefObject<HTMLDivElement>;
    onPageChanged: PageChangedHandler;
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

    protected onPageChanged: PageChangedHandler;

    constructor({
        model,
        rootRef,
        onPageChanged,
    }: IStateParams) {
        this.model = model;
        this.rootRef = rootRef;
        this.onPageChanged = onPageChanged;
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
