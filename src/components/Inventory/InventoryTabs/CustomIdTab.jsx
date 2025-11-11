import { Alert, Spinner, } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import CustomIdForm from "../../CustomIdForm/CustomIdForm";
import { useTranslation } from 'react-i18next';
import { IdGenerator, hasOrderChanged } from "../../../utils/utils";
import { PART_DEFINITIONS, DND_FORM } from "../../../utils/constants";

export default function CustomIdTab({ customIdFormat, handlerChangeCustomIdFormat, loading, error, disabled}) {
    const { t } = useTranslation("inventory");
    const createNewPart = () => ({
        guid: crypto.randomUUID(),
        type: 'TEXT',
        format: '',
        separator: '',
        currentSequence: '',
        value: '',
        position: 'prefix',
    });

    const handlerChange = (updatedParts) => {
        handlerChangeCustomIdFormat('customIdFormat', {
            ...customIdFormat,
            parts: hasOrderChanged(customIdFormat?.parts, updatedParts) ? updatedParts.map((part, i) => ({ ...part, order: i })) : updatedParts,
            summary: IdGenerator.generateFromParts(updatedParts, PART_DEFINITIONS)
        })
    }
    
    return (
        loading
            ? (<div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" className="align-self-center"/>
            </div>)
            : error
                ? (<div className="d-flex justify-content-center align-items-center">
                    <Alert variant="danger">{error.message}</Alert>
                    </div>)
                :(<div className="p-3">
                    {customIdFormat?.part?.length === 0 
                        ? ( <Alert variant="light" className="border">{t("texts.noPartsCustomID")}</Alert>)
                        : ( <DndForm
                                title={DND_FORM.CUSTOM_ID.TITLE}
                                fields={customIdFormat?.parts}
                                fullId={customIdFormat?.summary}
                                createNewItem={createNewPart}
                                addLabel={DND_FORM.CUSTOM_ID.ADD_PART}
                                onChange={handlerChange}
                                disabled={disabled}
                                renderItem={({ field, index, total, onUpdate, onMove, disabled}) => {
                                    return (
                                        <DndFormField id={field.guid} disabled={disabled}>

                                                <CustomIdForm
                                                    part={field}
                                                    index={index}
                                                    total={total}
                                                    onUpdate={onUpdate}
                                                    onMove={onMove}
                                                    disabled={disabled}
                                                />
                                        </DndFormField>
                                    );
                                }}
                            />)}
                </div>)
    );
}
