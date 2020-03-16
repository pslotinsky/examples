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
        return Object.fromEntries(Array.from(this.fieldMap));
    }

    public asFieldsDataList(): EntryFieldData[] {
        return Array.from(this.fieldMap).map(([name, value]) => ({ name, value }));
    }

    public getMap(): Map<FieldName, FieldValue> {
        return cloneDeep(this.fieldMap);
    }

    public get(name: string): Optional<FieldValue> {
        return this.fieldMap.get(name);
    }

    public set(name: string, value: FieldValue): void {
        this.fieldMap.set(name, value);
    }

    public getArrayValue(name: string): Optional<FieldValueItem[]> {
        const value = this.fieldMap.get(name);
        return isArray(value) ? value : undefined;
    }

    public getFieldValueItem({ fieldName, id }: ValueItemIdentity): Optional<FieldValueItem> {
        return this.getArrayValue(fieldName)?.find(it => it.id === id);
    }

    public getFieldValueItemOrFail(valueItemIdentity: ValueItemIdentity): FieldValueItem {		
        const value = this.getArrayValue(valueItemIdentity.name);
        getOrFail(value, () => new Error(`${name} value is not an array`));

        const valueItem = this.getFieldValueItem(valueItemIdentity);
        return getOrFail(valueItem, () => new ValueItemNotFound(valueItemIdentity));
    }

    private getItemsForAdding(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValue(fieldName) ?? [];

        return differenceBy(newArrayValue, currentItems, 'id');
    }

    private getChangedItems(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValueIfExists(fieldName) ?? [];
        const newItems = newArrayValue.filter(item => !isNull(item.value));

        return differenceWith(newItems, currentItems, isEqual);
    }

    private getItemsForDeletion(fieldName: string, newArrayValue: FieldValueItem[]) {
        const currentItems = this.getArrayValue(fieldName) ?? [];

        return differenceBy(currentItems, newArrayValue, 'id');
    }

}
