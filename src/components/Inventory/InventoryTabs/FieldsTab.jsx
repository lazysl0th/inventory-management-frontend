import { Alert } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import ItemFieldsForm from '../../ItemFieldsForm/ItemFieldsForm';
import { hasOrderChanged } from "../../../utils/utils";
import { FIELD_TYPES } from '../../../utils/constants'


export default function FieldsTab({ itemFields, handlerChangeFields, onShowToast, disabled }) {

    function createNewField(fields, type = "TEXT") {
        const countOfType = fields.filter(field => field.type === type).length;
        if (countOfType >= FIELD_TYPES[type]?.limit) {
            onShowToast(`Нельзя добавить больше полей типа "${FIELD_TYPES[type].label}" (лимит ${FIELD_TYPES[type]?.limit})`, 'bottom-center');
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
        handlerChangeFields('fields', updatedFields.map((field, i) => hasOrderChanged(itemFields, updatedFields) ? { ...field, order: i } : { ...field }) )
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
                        disabled={disabled}
                        addLabel="Добавить поле"
                        renderItem={({ field, index, total, onUpdate, onMove }) => {
                            return (
                                <DndFormField id={field.guid || field.id}>
                                    <ItemFieldsForm field={field} index={index} total={total} onUpdate={onUpdate} onMove={onMove} disabled={disabled} />
                                </DndFormField>);
                        }}
                    />)}
        </div>
        
    );
}
