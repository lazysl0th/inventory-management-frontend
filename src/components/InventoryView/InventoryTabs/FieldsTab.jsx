import { useState } from "react";
import { Alert, Toast, ToastContainer } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import ItemFieldsForm from '../../ItemFieldsForm/ItemFieldsForm';
import { hasOrderChanged } from "../../../utils/utils";
import { FIELD_TYPES } from '../../../utils/constants'


export default function FieldsTab({ itemFields, handlerChangeFields }) {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const onShowToast = (message) => {
        setToastMessage(message)
        setShowToast(true);
    }
    const onClose = () => {
        setShowToast(false);
        setToastMessage('')
    }

    function createNewField(fields, type = "TEXT") {
        const countOfType = fields.filter(field => field.type === type).length;
        if (countOfType >= FIELD_TYPES[type]?.limit) {
            onShowToast(`Нельзя добавить больше полей типа "${FIELD_TYPES[type].label}" (лимит ${FIELD_TYPES[type]?.limit})`);
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
                        addLabel="Добавить поле"
                        renderItem={({ field, index, total, onUpdate, onMove }) => {
                            return (
                                <DndFormField id={field.guid || field.id}>
                                    <ItemFieldsForm field={field} index={index} total={total} onUpdate={onUpdate} onMove={onMove} />
                                </DndFormField>);
                        }}
                    />)}
            <ToastContainer position="bottom-center" className="p-3">
                <Toast
                    show={showToast}
                    onClose={onClose}
                    delay={3000}
                    autohide
                    bg="warning"
                >
                <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
      </ToastContainer>
        </div>
    );
}
