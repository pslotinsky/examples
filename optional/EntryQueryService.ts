import Optional from 'optional-js';
import { isEmpty, isArray, isNil, isEqual, compact } from 'lodash';
import { EntityManager } from 'typeorm';

import {
    EntryData as CommonEntryData,
    EntryDataListItem,
    EntryFieldData,
    EntryTypeFieldName,
    FieldValueItemData,
    Optional as OptionalType,
    ReferralData,
    FieldValueItem,
    FieldValueData,
} from 'chaika-types/backend';

import { QueryService, FindIdentifiableCommand } from 'chaika-infrastructure';
import { NotFoundError } from 'chaika-domain-errors';
import { DomainEvent } from 'chaika-domain';
import { not } from 'chaika-utils';

import { EntryModel } from './EntryModel';
import { IEntryQueryService, EntryDataFindOption } from '@domain/entry';
import { EntryAggregateData } from '@domain/entry/EntryAggregateData';
import { createMedicalCaseData } from '@utils/createMedicalCaseData';
import { inject } from '@application/configuration';
import { EhrEventStore } from '@infrastructure/event-store/EhrEventStore';
import { ehrFactory } from '@infrastructure/ehr/EhrFactory';
import { EhrAggregateData } from '@domain/ehr';
import { getActualEntryEvents } from './getActualEntryEvents';
import { FindEntryDataCommand } from './FindEntryDataCommand';
import { ReferralQueryService } from '@infrastructure/referral';

type Id = CommonEntryData['id'];
type SerialNumber = CommonEntryData['serialNumber'];
type AdditionalParams = { events?: DomainEvent[], referrals?: ReferralData[] };

export type EntryData = Omit<CommonEntryData, 'fields'> & { fields?: EntryFieldData[]; };
export const specialFields: string[] = [EntryTypeFieldName.MedicalCases, EntryTypeFieldName.Referrals];

export class EntryQueryService extends QueryService<EntryData, EntryModel, EntryDataFindOption> implements IEntryQueryService {

    @inject protected ehrEventStore!: EhrEventStore;
    @inject protected referralQueryService!: ReferralQueryService;

    public async getOrFail(id: Id, manager = this.manager): Promise<CommonEntryData> {
        const [model, events, referrals] = await Promise.all([
            this.getModelOrFail(id, manager),
            this.ehrEventStore.getEhrEventsForCurrentAndLateEntries(id, manager),
            this.referralQueryService.find({ entryId: id }, manager),
        ]);

        if (!model) {
            throw this.createNotFoundError(id);
        }

        return this.create(model, { events, referrals });
    }

    public async getBySerialNumberOrFail(serialNumber: SerialNumber, manager = this.manager): Promise<CommonEntryData> {
        const uuid = await this.getUuidBy(serialNumber, manager);

        if (isNil(uuid)) {
            throw new NotFoundError({ serialNumber, entityName: this.getEntityName() });
        }

        return this.getOrFail(uuid, manager);
    }

    public async getVersionsOrFail(id: Id, manager = this.manager): Promise<CommonEntryData[]> {
        const findOptions: EntryDataFindOption = { id, hasMaxUpdateTime: false };

        const [models, events] = await Promise.all([
            this.findModels(findOptions, manager),
            this.ehrEventStore.getEhrEventsForCurrentAndLateEntries(id, manager),
        ]);

        if (isEmpty(models)) {
            throw this.createNotFoundError(id);
        }

        return this.createList(models, events);
    }

    public async getVersionsBySerialNumberOrFail(serialNumber: SerialNumber, manager = this.manager): Promise<CommonEntryData[]> {
        const uuid = await this.getUuidBy(serialNumber, manager);

        if (isNil(uuid)) {
            throw new NotFoundError({ serialNumber, entityName: this.getEntityName() });
        }

        return this.getVersionsOrFail(uuid, manager);

    }

    public async find(findOption: EntryDataFindOption = {}, manager = this.manager): Promise<EntryDataListItem[]> {
        const fo = { ...findOption, hasMaxUpdateTime: true };

        if (findOption.withFields) {
            return super.find(fo, manager);
        }

        const entryDataList = await super.find(fo, manager);

        return this.removeFields(entryDataList);
    }

    public createList(models: EntryModel[], events: DomainEvent[] = []): CommonEntryData[] {
        return models.map(model => this.create(model, { events: this.filterVersionEvents(events, model) }), this);
    }

    public create(model: EntryModel,  { events = [], referrals }: AdditionalParams = {}): CommonEntryData {

        const entryEvents: DomainEvent[] = [];
        const ehrEvents: DomainEvent[] = [];
        events.forEach(event => event.entityId === model.id ? entryEvents.push(event) : ehrEvents.push(event));
        const ehrData = ehrFactory.createEhrAggregateData(ehrEvents);

        const {
            updateTime,
            creationTime,
            data,
            isDeleted: unused,
            ...otherParams
        } = model;

        const aggregateData = new EntryAggregateData();
        aggregateData.mutate(...getActualEntryEvents(entryEvents));
        const medicalCasesValue = createMedicalCaseData(aggregateData.medicalCases);

        const fieldsData = [
            ...aggregateData.fields.asFieldsDataList(),
            {
                name: EntryTypeFieldName.MedicalCases,
                value: medicalCasesValue,
            },
        ];

        if (!isEmpty(referrals)) {
            fieldsData.push({ name: EntryTypeFieldName.Referrals, value: referrals! });
        }

        const fieldsView = this.createFieldsView(fieldsData, ehrData);

        return {
            ...otherParams,
            updateTime,
            creationTime,
            fields: fieldsView,
        };
    }

    protected createFieldsView(fields: EntryFieldData[], ehrData: EhrAggregateData): EntryFieldData[] {
        return fields
            .map(({ name, value }) => createFieldView(name, value, ehrData))
            .filter(it => it.value);
    }

    protected filterVersionEvents(events: DomainEvent[], model: EntryModel) {
        return events.filter(event => (
            event.entityId !== model.id
            || event.occurredOn.getTime() <= model.updateTime.getTime()
        ));
    }

    protected getFindOptionForSearchById(id: Id): EntryDataFindOption {
        return { id, hasMaxUpdateTime: true };
    }

    protected removeFields(entryDataList: EntryData[]): EntryDataListItem[] {
        return entryDataList.map(({ fields, ...otherParams }) => ({ ...otherParams }));
    }

    protected createFindCommand(findOption: EntryDataFindOption, manager: EntityManager): FindIdentifiableCommand<EntryModel, EntryDataFindOption> {
        return new FindEntryDataCommand(manager, findOption);
    }

    protected async getUuidBy(serialNumber: number, manager: EntityManager): Promise<OptionalType<string>> {
        const queryResult = await manager.createQueryBuilder()
            .select('entry_id as id')
            .from(EntryModel, 'entry')
            .where({ serialNumber })
            .getRawOne();

        return queryResult ? (queryResult as unknown as { id: string }).id : undefined;
    }

}

function createFieldView(name: string, value: FieldValueData, ehrData: EhrAggregateData): EntryFieldData {
    let newValue = value;

    if (
        isArray(value)
        && not(specialFields.includes(name))
    ) {
        newValue = createArrayValueView(name, value, ehrData);
    }

    if (isNil(value)) {
        const ehrValue = ehrData.fields.get(name);

        ehrValue.ifPresentOrElse(
            it => newValue = { name, value: it, isDeleted: true },
            () => newValue = value,
        );
    }

    return { name, value: newValue };
}

function createArrayValueView(fieldName: string, fieldValue: FieldValueItemData[], ehrData: EhrAggregateData) {
    return compact((fieldValue).map(({ id, value }) => {
        const ehrItemValue = ehrData.fields.getFieldValueItem({ id, fieldName });

        return createFieldValueItemView({ id, value, ehrItemValue });
    }));
}

function createFieldValueItemView({ id, value, ehrItemValue }: { id: string, value: any, ehrItemValue: Optional<FieldValueItem>  }) {
    const isValueSetAndEquals = ehrItemValue.filter(it => isEqual(it.value, value)).isPresent();

    if (isValueSetAndEquals) {
        return;
    }

    const result: FieldValueItemData = { id, value };

    if (isNil(value)) {
        ehrItemValue.ifPresentOrElse(
            ehrValue => {
                result.value = ehrValue;
                result.isDeleted = true;
            },
            () => result.value = value,
        );
    }

    return result;
}
