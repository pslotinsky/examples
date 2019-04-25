import * as React from 'react';

import { Cell } from '@models/Cell';
import { DataType } from '@models/Column';

export class CellContentFactory {

    public create({ type, name }: Cell): React.ReactNode {
        let result: React.ReactNode = null;

        switch (type) {

            case DataType.String:
                result = name;
                break;

            case DataType.Number:
                result = name;
                break;

            case DataType.Date:
                result = this.createDate(name);
                break;

            case DataType.Money:
                result = this.createMoney(name);
                break;

        }

        return result;
    }

    private createDate(value: string): string {
        const date = new Date(Number(value));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate() + 1;

        return `${year}-${this.pad(month, 2)}-${this.pad(day, 2)}`;
    }

    private createMoney(value: string): string {
        return `${value} руб`;
    }

    private pad(value: number, count: number): string {
        let result = value.toString();
        while (result.length < count) {
            result = '0' + result;
        }
        return result;
    }

}
