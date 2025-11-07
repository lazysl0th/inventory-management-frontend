import { useRef } from "react";
import { Form, Image } from "react-bootstrap";

export default function FieldInput({ field, value, handlerChangeFieldInput, onShowToast, onUploadImage }) {
    const imageRef = useRef(null);

    const handleChange = async (e) => {
        const { name, value, checked } = e.target
        const newValue = field.type === "BOOLEAN"
            ? checked : field.type === "FILE"
                ? await handlerChangeImage(e.target) : field.type === "NUMBER" 
                    ? (value === "" ? null : Number(value)) 
                    : value; 
        handlerChangeFieldInput(isNaN(name) ? name : Number(name), { value: newValue });
    };

    const handlerChangeImage = async (target) => {
        if (!target.files[0]) return;
        try {
            const image = await onUploadImage(target.files[0]);
            return image.url;
        } catch (e) {
            imageRef.current.value = '';
            onShowToast('Во время загрузки изображения произошла ошибка', 'bottom-center');
        }
    };

    switch (field.type) {
        case "LONGTEXT":
            return (
                <Form.Group className="mb-1" controlId={field.id}>
                    <Form.Label>{field.title}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name={value.id}
                        placeholder="Enter text..."
                        value={value.value || ""}
                        onChange={handleChange}
                    />
                </Form.Group>
            );

        case "NUMBER":
            return (
                <Form.Group className="mb-1" controlId={field.id}>
                    <Form.Label>{field.title}</Form.Label>
                    <Form.Control
                        type="number"
                        name={value.id}
                        placeholder="Enter number..."
                        value={value.value ?? ""}
                        onChange={handleChange}
                    />
                </Form.Group>
            );

        case "FILE":
            return (
                <Form.Group className="mb-1" controlId={field.id}>
                    <Form.Label>{field.title}</Form.Label>
                    <div className="d-flex flex-column gap-2">
                        {value?.value
                            ? (
                                <Image
                                    src={value.value}
                                    alt="Preview"
                                    thumbnail
                                    style={{ maxHeight: 100, objectFit: "cover" }}
                                />)
                            : (<div
                                    className="border rounded d-flex align-items-center justify-content-center p-3 text-muted"
                                    style={{ height: 100 }}
                                >No image</div>)}
                    </div>
                    <Form.Control
                        ref={imageRef}
                        type="file"
                        placeholder="Enter file or image..."
                        name={value.id}
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Form.Group>
            );

            case "BOOLEAN":
                return (
                    <Form.Group className="mb-1" controlId={field.id}>
                    <Form.Check
                        type="checkbox"
                        name={value.id}
                        label={field.title}
                        checked={!!value.value}
                        onChange={handleChange}
                    />
                    </Form.Group>
                );

        case "TEXT":
            default:
                return (
                    <Form.Group className="mb-1" controlId={field.id}>
                        <Form.Label>{field.title}</Form.Label>
                        <Form.Control
                            type="text"
                            name={value.id}
                            placeholder="Enter value..."
                            value={value.value || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
            );
    }
}
