import { forwardRef, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const IndeterminateCheckbox = forwardRef(( { indeterminate, ...rest }, ref ) => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => { if (resolvedRef.current) resolvedRef.current.indeterminate = indeterminate; }, [resolvedRef, indeterminate]);

        return <Form> <Form.Check type='checkbox' ref={resolvedRef} {...rest} /></Form>
    }
);

export default IndeterminateCheckbox;