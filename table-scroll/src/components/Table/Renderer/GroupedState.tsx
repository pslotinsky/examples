import * as React from 'react';

import { Group } from '@models/Group';
import { Row } from '@models/Row';

import { Scroller, XScrollerGrouped, YScrollerGrouped } from '../Scroller';
import { TableGroup } from '../TableGroup';
import { State, StateName } from './State';


const ROW_HEIGHT = 40;
const GROUP_PADDING = 40;

export class GroupedState extends State {

    public name: StateName = StateName.Grouped;

    public render(): JSX.Element {
        return this.scrollerY.render(
            <React.Fragment>
                {this.getGroups().map(item =>
                    <TableGroup key={item.id} model={item} scroller={this.scrollerX} />
                )}
            </React.Fragment>
        );
    }

    public getScrollHeight(): number {
        return this.model.getGroups()
            .map(item => ROW_HEIGHT * item.getRows().length + GROUP_PADDING)
            .reduce((acc, cur) => acc + cur);
    }

    protected createScrollerX(): Scroller {
        return new XScrollerGrouped({
            model: this.model,
            rootRef: this.rootRef
        });
    }

    protected createScrollerY(): Scroller {
        return new YScrollerGrouped({
            model: this.model,
            rootRef: this.rootRef
        });
    }

    protected getGroups(): Group[] {
        const { start, end } = this.scrollerX.page;

        const rows = this.model.getRows()
            .slice(this.scrollerY.page.start, this.scrollerY.page.end)
            .map(item => {
                const row = new Row();
                row.id = item.id;
                row.cells = item.cells.slice(start, end);
                row.group = item.group;
                return row;
            });

        const groupsRows = rows.reduce((acc, row) => {
            const { group } = row;
            const groupRows: Row[] = acc[group.id] || [];
            return {
                ...acc,
                [group.id]: [...groupRows, row]
            };
        }, {});

        return Object.keys(groupsRows).map(key => {
            const id = Number(key);
            return new Group(id, groupsRows[key])
        });
    }

}
