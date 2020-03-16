import { v4 as uuid } from 'uuid';

import { accept } from 'chaika-domain';

import { CommonEntryFieldsData } from '@domain/common';
import {
    FieldValueListItemAdded,
    FieldValueListItemDeleted,
    FieldValueListItemChanged,
    DiagnosisUpdated,
    MedicalCaseAdded,
    MedicalCaseClosed,
    MedicalCaseDeleted,
    MedicalCaseTypeChanged,
    EntryFieldUpdated,
    ComputationalFieldCommitted,
} from './events';
import { MedicalCase } from '@domain/medical-case';
import { isArray } from 'util';
import { FieldValueItem } from 'chaika-types/backend';

export class EntryAggregateData extends CommonEntryFieldsData {

    @accept(ComputationalFieldCommitted)
    @accept(EntryFieldUpdated)
    protected update({ body: { name, value } }: EntryFieldUpdated | ComputationalFieldCommitted) {
        this.fields.set(name, value);
    }

    @accept(MedicalCaseAdded)
    protected addMedicalCase({ body: { icdId, clinicalDiagnosis, id, ...otherCaseParams } }: MedicalCaseAdded) {
        const diagnosis = { icdId, clinicalDiagnosis, id: uuid() };
        this.medicalCases.add(new MedicalCase({ id, diagnosis, ...otherCaseParams }));
    }

    @accept(DiagnosisUpdated)
    protected updateDiagnosis({ body: { medicalCaseId, ...diagnosisParams } }: DiagnosisUpdated) {
        this.medicalCases.getOrFail(medicalCaseId).changeDiagnosis(diagnosisParams);
    }

    @accept(MedicalCaseDeleted)
    protected deleteMedicalCase({ body: { id } }: MedicalCaseDeleted) {
        this.medicalCases.delete(id);
    }

    @accept(MedicalCaseClosed)
    protected closeMedicalCase({ body: { id } }: MedicalCaseClosed) {
        this.medicalCases.getOrFail(id).close();
    }

    @accept(MedicalCaseTypeChanged)
    protected changeMedicalCaseType({ body: { id, type } }: MedicalCaseTypeChanged) {
        this.medicalCases.getOrFail(id).changeType(type);
    }

    @accept(FieldValueListItemAdded)
    protected addCompositeField({ body: { fieldName, ...item } }: FieldValueListItemAdded) {
        const value = this.fields.get(fieldName);

        isArray(value)
            ? this.fields.set(fieldName, [...value, item])
            : this.fields.set(fieldName, [item]);
    }

    @accept(FieldValueListItemDeleted)
    protected deleteCompositeField({ body: { id, fieldName } }: FieldValueListItemDeleted) {
        const item = this.fields.getFieldValueItem({ id, fieldName });

        item
            ? item.value = null
            : this.fields.set(fieldName, [{ id, value: null }]);
    }

    @accept(FieldValueListItemChanged)
    protected changeCompositeField({ body: { id, fieldName, value } }: FieldValueListItemChanged) {
        const item = this.fields.getFieldValueItemOrFail({ id, fieldName });
        item.value = value;
    }

}
