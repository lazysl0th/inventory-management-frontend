import { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function InfoToast({ isShow, onClose, position, message}) {
    return (
        <ToastContainer position={position} className="p-3">
            <Toast
                show={isShow}
                onClose={onClose}
                delay={3000}
                autohide
                bg="warning"
            >
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}
