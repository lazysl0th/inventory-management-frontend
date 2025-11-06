import { useState } from "react";
import { Form } from "react-bootstrap";

export default function FieldInput({ field, value, handlerChangeFieldInput }) {
    const [preview, setPreview] = useState(null);
    //console.log(field);

    const handleChange = (e) => {
        const { name, value, checked} = e.target
        const newValue = field.type === "BOOLEAN" 
            ? checked : field.type === "NUMBER" 
                ? (value === "" ? null : Number(value)) 
                : value; 
        handlerChangeFieldInput(isNaN(name) ? name : Number(name), { value: newValue });
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
                        {preview ? (
                            <Image
                                ref={imageRef}
                                src={preview}
                                alt="Preview"
                                thumbnail
                                style={{ maxHeight: 100, objectFit: "cover" }}

                            />
                        ) : (
                            <div
                                className="border rounded d-flex align-items-center justify-content-center p-3 text-muted"
                                style={{ height: 100 }}
                            >No image</div>)}
                    </div>
                    <Form.Control
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
