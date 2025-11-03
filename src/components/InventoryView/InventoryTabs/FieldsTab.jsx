import { Alert } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import ItemFieldsForm from '../../ItemFieldsForm/ItemFieldsForm';
import { hasOrderChanged } from "../../../utils/utils";
import { FIELD_TYPES } from '../../../utils/constants'

export default function FieldsTab({ itemFields, handlerChangeFields }) {

    function createNewField(fields, type = "TEXT") {
        const countOfType = fields.filter(field => field.type === type).length;
        const limit = FIELD_TYPES[type]?.limit ?? Infinity;
        if (countOfType >= limit) {
            alert(`Нельзя добавить больше полей типа "${FIELD_TYPES[type].label}" (лимит ${limit}).`);
        return null;
        }

        return {
            guid: crypto.randomUUID(),
            id: null,
            type,
            title: '',
            description: '',
            showInTable: false,
            order: fields.length,
        };
    }

    const handlerChange = (updatedFields) => {
        handlerChangeFields('fields', hasOrderChanged(itemFields, updatedFields) ? updatedFields.map((field, i) => ({ ...field, order: i })) : updatedFields )
    }


    return (
        <div className="p-3">
            { false
                ? <Alert variant="secondary" className="m-3">No custom fields defined for this inventory.</Alert>
                : ( <DndForm
                        title="Настраиваемые поля"
                        fields={itemFields}
                        onChange={handlerChange}
                        createNewItem={createNewField}
                        addLabel="Добавить поле"
                        renderItem={({ field, index, total, onUpdate, onMove }) => {
                            return (
                                <DndFormField id={field.guid || field.id}>
                                    <ItemFieldsForm field={field} index={index} total={total} onUpdate={onUpdate} onMove={onMove} />
                                </DndFormField>);
                        }}
                    />)}
        </div>
    );
}
