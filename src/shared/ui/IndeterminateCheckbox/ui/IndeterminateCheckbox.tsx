import { forwardRef, useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import './IndeterminateCheckbox.scss'
import type { IIndeterminateCheckboxProps } from '../model/types'

const IndeterminateCheckbox = forwardRef<
    HTMLInputElement,
    IIndeterminateCheckboxProps
>(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (ref || defaultRef) as React.RefObject<HTMLInputElement>

    useEffect(() => {
        if (resolvedRef.current)
            resolvedRef.current.indeterminate = !!indeterminate
    }, [resolvedRef, indeterminate])

    return (
        <Form.Check
            type='checkbox'
            className='indeterminate-checkbox'
            ref={resolvedRef}
            {...rest}
        />
    )
})

export default IndeterminateCheckbox
