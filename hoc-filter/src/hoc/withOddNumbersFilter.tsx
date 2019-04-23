import * as React from "react";

export interface IData {
    numbers: number[];
}

export function withOddNumbersFilter<T extends IData>(Child: React.ComponentType<T>) {
    return class Filter extends React.Component<T> {

        public static displayName = `withOddNumbersFilter(${Child.displayName || Child.name})`;

        public render(): JSX.Element {
            const numbers = this.filter(this.props.numbers);
            return <Child {...this.props} numbers={numbers} />;
        }

        private filter(numbers: number[]): number[] {
            return numbers.filter(item => item % 2 === 1);
        }

    };
}
