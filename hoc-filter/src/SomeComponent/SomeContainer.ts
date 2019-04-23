import autobind from 'autobind-decorator';
import * as React from 'react';

import { IData, SomeComponent } from './SomeComponent';

import { withOddNumbersFilter } from '../hoc/withOddNumbersFilter';

export class SomeContainer extends React.Component<{}, IData> {

    public state: IData = {
        numbers: this.generateRandomNumbers()
    };

    public render(): JSX.Element {
        return React.createElement(withOddNumbersFilter(SomeComponent), {
            numbers: this.state.numbers,
            onClick: this.onClick
        });
    }

    @autobind
    private onClick(): void {
        this.setState({ numbers: this.generateRandomNumbers() });
    }

    private generateRandomNumbers(): number[] {
        const numbers: number[] = [];
        for (let i = 0; i < 10; i++) {
            numbers.push(Math.round(Math.random() * 10));
        }
        return numbers;
    }

}
