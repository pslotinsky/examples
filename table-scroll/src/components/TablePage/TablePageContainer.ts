import autobind from 'autobind-decorator';
import * as React from 'react';

import { Table as TableModel } from '@models/Table';

import { TablePage } from './TablePage';


// tslint:disable-next-line:no-empty-interface
interface IParams {
}

interface IState {
    grouping: boolean;
}

export class TablePageContainer extends React.Component<IParams, IState> {

    private model: TableModel;

    constructor(params: IParams) {
        super(params);

        this.model = new TableModel({
            columnNames: [
                'Комментарий', 'id план', 'id исполнение', 'ЦА/ТБ', 'Название активности', 'Направление', 'Инструмент', 'Комментарий для SAP', 'Блок', 'МВЗ', 'Номер МВЗ', 'Наименование ЦЗ', 'Код ЦЗ', 'Тип активности', 'Канал', 'Код Канала', 'Драйвер аллокации описание', 'Драйвер аллокации код', 'Статья', 'Ресурс', 'Руководитель проекта', 'Сегмент', 'Код сегмента', 'Продукт', 'Код продукта', 'Территория код', 'Территория описание', 'Дата старта', 'Дата окончания', 'Факт предыдщий год', 'План Январь', 'Резерв Январь', 'Факт Январь', 'План Февраль', 'Резерв Февраль', 'Факт Февраль', 'План Март', 'Резерв Март', 'Факт Март', 'План 1 квартал', 'Резерв 1 квартал', 'Факт 1 квартал', 'Резерв', 'Факт', 'Апрель', 'Резерв', 'Май', 'Резерв', 'Июнь', 'Резерв', '2 квартал', 'Резерв', 'Июль', 'Резерв', 'Август', 'Резерв', 'Сентябрь', 'Резерв', '3 квартал', 'Резерв', 'Октябрь', 'Резерв', 'Ноябрь', 'Резерв', 'Декабрь', 'Резерв', '4 квартал', 'ИТОГО план тек год', 'Итого резерв тек год', 'Итого факт тек год', 'номер ЗНС из САП', 'Номер корректировки из САП', 'ИФКВ', 'Порядок использования ресурсов', 'Направление затрат', 'Подкатегория', 'Задача', 'Остаток по активности (план - резерв) январь', 'Остаток свободного резерва (резерв - факт) январь', 'Остаток по факту (план - факт) январь', 'Остаток по активности (план - резерв) 1 квартал', 'Остаток свободного резерва (резерв - факт) 1 квартал', 'Остаток по факту (план - факт) 1 квартал', 'Остаток по активности (план - резерв) год', 'Остаток свободного резерва (резерв - факт) год', 'Остаток по факту (план - факт) год']
        });

        this.model.generateRandomRows(200);

        this.state = { grouping: false };
    }

    public render(): JSX.Element {
        const { model, groupingOn, groupingOff } = this;

        return React.createElement(TablePage, { ...this.state, model, groupingOff, groupingOn });
    }

    @autobind
    protected groupingOn(): void {
        this.setState({ grouping: true });
    }

    @autobind
    protected groupingOff(): void {
        this.setState({ grouping: false });
    }

}
