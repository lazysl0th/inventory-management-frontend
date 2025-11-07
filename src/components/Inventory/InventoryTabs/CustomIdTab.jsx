import { Alert, Spinner, } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import CustomIdForm from "../../CustomIdForm/CustomIdForm";
import { IdGenerator, hasOrderChanged } from "../../../utils/utils";
import { PART_DEFINITIONS } from "../../../utils/constants";

export default function CustomIdTab({ customIdFormat, handlerChangeCustomIdFormat, loading, error}) {

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
                        ? ( <Alert variant="light" className="border"> No parts defined for this Custom ID. </Alert>)
                        : ( <DndForm
                                title="Формат идентификатора"
                                fields={customIdFormat?.parts}
                                fullId={customIdFormat?.summary}
                                createNewItem={createNewPart}
                                addLabel="Добавить элемент"
                                onChange={handlerChange}
                                renderItem={({ field, index, total, onUpdate, onMove }) => {
                                    return (
                                        <DndFormField id={field.guid}>
                                            <CustomIdForm
                                                part={field}
                                                index={index}
                                                total={total}
                                                onUpdate={onUpdate}
                                                onMove={onMove}/>
                                        </DndFormField>
                                    );
                                }}
                            />)}
                </div>)
    );
}
