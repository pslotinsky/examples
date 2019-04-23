import * as React from 'react';

import { Table } from '@models/Table';

import { GroupedState } from './GroupedState';
import { PlainState } from './PlainState';
import { State, StateName } from './State';


interface IParams {
    model: Table;
    rootRef: React.RefObject<HTMLDivElement>;
}

export class Renderer {

    private state: State;

    private model: Table;

    private rootRef: React.RefObject<HTMLDivElement>;

    constructor({
        model,
        rootRef
    }: IParams) {
        this.model = model;
        this.rootRef = rootRef;
        this.state = this.createState(StateName.Plain);
    }

    public update(): void {
        this.state.update();
    }

    public setGrouping(grouping: boolean): void {
        const name = grouping ? StateName.Grouped : StateName.Plain;
        this.setState(name);
    }

    public scrollLeft(): void {
        this.state.scrollLeft();
    }

    public scrollRight(): void {
        this.state.scrollRight();
    }

    public scrollUp(): void {
        this.state.scrollUp();
    }

    public scrollDown(): void {
        this.state.scrollDown();
    }

    public isPageChanged(): boolean {
        return this.state.isPageChanged();
    }

    public render(): React.ReactNode {
        return this.state.render();
    }

    protected setState(name: StateName): void {
        if (this.state.name !== name) {
            this.state = this.createState(name);
            this.state.update();
            // tslint:disable-next-line:no-console
            console.log(this.state);
        }
    }

    protected createState(name: StateName): State {
        const ctors = {
            [StateName.Plain]: PlainState,
            [StateName.Grouped]: GroupedState
        };

        return new ctors[name]({
            model: this.model,
            rootRef: this.rootRef
        });
    }

}
