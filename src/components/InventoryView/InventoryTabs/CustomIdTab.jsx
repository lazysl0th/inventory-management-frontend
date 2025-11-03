import { Alert } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import CustomIdForm from "../../CustomIdForm/CustomIdForm";
import { IdGenerator, hasOrderChanged } from "../../../utils/utils";
import { PART_DEFINITIONS } from "../../../utils/constants";

export default function CustomIdTab({ customIdFormat, handlerChangeCustomIdFormat}) {

    const createNewPart = () => ({
        guid: crypto.randomUUID(),
        type: "TEXT",
        format: "",
        value: "",
        position: "prefix",
    });

    const handlerChange = (updatedParts) => {
        console.log(updatedParts)
        console.log(customIdFormat?.parts)
        handlerChangeCustomIdFormat('customIdFormat', {
            ...customIdFormat,
            parts: hasOrderChanged(customIdFormat?.parts, updatedParts) ? updatedParts.map((part, i) => ({ ...part, order: i })) : updatedParts,
            summary: IdGenerator.generateFromParts(updatedParts, PART_DEFINITIONS)
        })
    }
    
    return (
        <div className="p-3">
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
        </div>
    );
}
