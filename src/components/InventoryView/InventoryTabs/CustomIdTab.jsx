import { Alert } from "react-bootstrap";
import DndForm from "../../DndForm/DndForm";
import DndFormField from "../../DndForm/DndFormField/DndFormField";
import CustomIdForm from "../../CustomIdForm/CustomIdForm";
import { IdGenerator, hasOrderChanged } from "../../../utils/utils";
import { PART_DEFINITIONS } from "../../../utils/constants";

export default function CustomIdTab({ customIdFormat, handlerChangeCustomIdFormat}) {

    //console.log(customIdFormat)
    const addPart = () => ({
        guid: crypto.randomUUID(),
        type: "TEXT",
        format: "",
        value: "",
        position: "prefix",
    });

    //const summary = useMemo(() => { (IdGenerator.generateFromParts(customIdFormat?.parts)) }, [customIdFormat?.parts]);



    const handlerChange = (updatedParts) => {
        //console.log(updatedParts)
        //console.log(customIdFormat.parts)
        handlerChangeCustomIdFormat('customIdFormat', {
            ...customIdFormat,
            parts: hasOrderChanged(customIdFormat.parts, updatedParts) ? updatedParts.map((part, i) => ({ ...part, order: i })) : updatedParts,
            summary: IdGenerator.generateFromParts(updatedParts, PART_DEFINITIONS)
        })
        //console.log(customIdFormat)
    }

    //console.log(customIdFormat)
    return (
        <div className="p-3">
            {customIdFormat?.part?.length === 0 
                ? ( <Alert variant="light" className="border"> No parts defined for this Custom ID. </Alert>)
                : ( <DndForm
                        title="Формат идентификатора"
                        fields={customIdFormat?.parts}
                        fullId={customIdFormat?.summary}
                        createNewItem={addPart}
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
