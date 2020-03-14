// Many imports here

export class Fields {

    private fieldMap: Map<FieldName, FieldValue>;

    constructor(fields: Map<FieldName, FieldValue> = new Map()) {
        this.fieldMap = new Map(fields.entries());
    }

    public get isEmpty(): boolean {
        return this.fieldMap.size === 0;
    }

    public geValueItemDifference(name: string, newValue: FieldValue): ValueItemDifference {
        const newItems = isArray(newValue) ? newValue : [];
        const itemsForAdding = this.getItemsForAdding(name, newItems);
        const changedItems = this.getChangedItems(name, newItems);
        const itemsForDeletion = this.getItemsForDeletion(name, newItems);

        return { itemsForAdding, changedItems, itemsForDeletion };
    }

    public asObjectLiteral(): EntryFields {
        return fromPairs([...this.fieldMap.entries()]);
    }

    public asFieldsDataList(): EntryFieldData[] {
        return [...this.fieldMap.entries()].map(([name, value]) => ({ name, value }));
    }

    public getMap(): Map<FieldName, FieldValue> {
        return cloneDeep(this.fieldMap);
    }

    public get(name: string): Optional<FieldValue> {
        return Optional.ofNullable(this.fieldMap.get(name));
    }

    public set(name: string, value: FieldValue): void {
        this.fieldMap.set(name, value);
    }

    public getArrayValueIfExists(name: string): Optional<FieldValueItem[]> {
        return this.get(name).filter(value => isArray(value)) as Optional<FieldValueItem[]>;
    }

    public getFieldValueItem({ id, fieldName }: ValueItemIdentity): Optional<FieldValueItem> {
        return this.getArrayValueIfExists(fieldName).map(it => (it as FieldValueItem[]).find(it => it.id === id));
    }

    public getFieldValueItemOrFail({ id, fieldName }: ValueItemIdentity): FieldValueItem {
        const fieldValueIsNotArray = () => new Error(`${fieldName} value is not an array`);
        const itemNotExists = () => new NotFoundError({ id, entityName: 'item', endOfMessage: `not found in field: ${fieldName} values list` });
        const value = this.getArrayValueIfExists(fieldName).orElseThrow(fieldValueIsNotArray) as FieldValueItem[];

        return Optional.ofNullable(value.find(it => it.id === id)).orElseThrow(itemNotExists);
    }

    private getItemsForAdding(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValueIfExists(fieldName).orElse([]);
        const isCurrentItemWithEqualIdNotExists = ({ id }: FieldValueItem) => !idsOf(currentItems).includes(id);

        return newArrayValue.filter(item => isCurrentItemWithEqualIdNotExists(item));
    }

    private getChangedItems(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValueIfExists(fieldName).orElse([]);

        const isCurrentItemWithEqualIdHasDifferentValue = (item: FieldValueItem) => {
            const currentItem = currentItems.find(({ id }) => id === item.id);

            return isDefined(currentItem) && !isEqual(currentItem, item) && !isNull(item.value);
        };

        return newArrayValue.filter(item => isCurrentItemWithEqualIdHasDifferentValue(item));
    }

    private getItemsForDeletion(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValueIfExists(fieldName).orElse([]);

        const isNewItemWithEqualIdHasEmptyValue = (item: FieldValueItem) => {
            const newItem = newArrayValue.find(({ id }) => id === item.id);

            return isNil(newItem) || isNull(newItem.value);
        };

        return currentItems.filter(item => isNewItemWithEqualIdHasEmptyValue(item));
    }

}
