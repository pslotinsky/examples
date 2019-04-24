import autobind from 'autobind-decorator';
import * as React from 'react';

import { Table as TableModel } from '@models/Table';

import { Table } from './Table';

import { Renderer } from './Renderer';


interface IParams {
    model: TableModel;
    grouping: boolean;
}

enum Key {
    Left = 37,
    Right = 39,
    Up = 38,
    Down = 40
}

export class TableScrollContainer extends React.Component<IParams> {

    private rootRef: React.RefObject<HTMLDivElement> = React.createRef();

    private renderer: Renderer;

    constructor(props: IParams) {
        super(props);

        this.renderer = new Renderer({
            model: props.model,
            rootRef: this.rootRef
        });
    }

    public componentDidMount(): void {
        this.rootRef.current!.addEventListener('wheel', this.onWheel);
        window.addEventListener('keydown', this.onKeyDown);
        this.forceUpdate();
        this.renderer.update();
    }

    public componentWillUnmount(): void {
        this.rootRef.current!.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('keypress', this.onKeyDown);
    }

    public render(): JSX.Element {
        const { rootRef, renderer } = this;
        const { model } = this.props;

        renderer.setGrouping(this.props.grouping);

        return React.createElement(Table, { rootRef, renderer, model });
    }

    @autobind
    protected onWheel({ deltaX, deltaY }: WheelEvent): void {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            (deltaX > 0) ? this.renderer.scrollRight() : this.renderer.scrollLeft();
        } else {
            (deltaY > 0) ? this.renderer.scrollDown() : this.renderer.scrollUp();
        }

        if (this.renderer.isPageChanged()) {
            this.forceUpdate();
        }
    }

    @autobind
    protected onKeyDown({ keyCode }: KeyboardEvent): void {
        switch (keyCode) {
            case Key.Left:
                this.renderer.scrollLeft();
                break;
            case Key.Right:
                this.renderer.scrollRight();
                break;
            case Key.Up:
                this.renderer.scrollUp();
                break;
            case Key.Down:
                this.renderer.scrollDown();
                break;
        }

        if (this.renderer.isPageChanged()) {
            this.forceUpdate();
        }
    }

}
