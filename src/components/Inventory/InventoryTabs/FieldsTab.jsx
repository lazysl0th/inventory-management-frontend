import { Alert } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import ItemFieldsForm from '../../ItemFieldsForm/ItemFieldsForm';
import { hasOrderChanged } from "../../../utils/utils";
import { FIELD_TYPES, DND_FORM } from '../../../utils/constants'
import { useTranslation } from "react-i18next";


export default function FieldsTab({ itemFields, handlerChangeFields, onShowToast, disabled }) {
    const { t } = useTranslation("inventory");

    function createNewField(fields, type = "TEXT") {
        const countOfType = fields.filter(field => field.type === type).length;
        if (countOfType >= FIELD_TYPES[type]?.limit) {
            onShowToast(t('toasts.field', { fieldTypeLabel: t(`fieldsTypes.${FIELD_TYPES[type].label}`), fieldTypeLimit: FIELD_TYPES[type]?.limit }), 'bottom-center');
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
                ? <Alert variant="secondary" className="m-3">{t("texts.noFields")}</Alert>
                : ( <DndForm
                        title={DND_FORM.CUSTOM_FIELDS.TITLE}
                        fields={itemFields}
                        onChange={handlerChange}
                        createNewItem={createNewField}
                        disabled={disabled}
                        addLabel={DND_FORM.CUSTOM_FIELDS.ADD_FIELD}
                        renderItem={({ field, index, total, onUpdate, onMove, disabled }) => {
                            return (
                                <DndFormField id={field.guid || field.id}>
                                    <ItemFieldsForm field={field} index={index} total={total} onUpdate={onUpdate} onMove={onMove} disabled={disabled} />
                                </DndFormField>);
                        }}
                    />)}
        </div>
        
    );
}
