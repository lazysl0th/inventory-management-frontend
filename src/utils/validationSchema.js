import * as Yup from "yup";

export const searchSchema = Yup.object({
    searchQuery: Yup.string()
        .trim()
        .required('Please enter at least 1 characters')
        .max(100, 'Too long query (max 100 characters)')
        .matches( /^[\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}\s-]+$/u, 'Invalid characters in search query')
    })

export const SignupSchema = Yup.object({
    name: Yup.string().required("Enter name"),
    email: Yup.string().email("Please enter a valid email address").required("Enter email"),
    password: Yup.string().min(1, "Password must be at least 1 characters long").required("Enter password"),
});

export const SigninSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Enter email"),
    password: Yup.string().min(1, "Password must be at least 1 characters long").required("Enter password"),
});

export const InventorySchema = Yup.object({
    title: Yup.string().required("Please enter title inventory"),
    category: Yup.string().required('Select category').oneOf(['Furniture', 'Equipment', 'Book', 'Other'], 'Invalid category'),
})

export const ResetPasswordSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Enter email"),
});

export const ChangePasswordSchema = Yup.object({
    password: Yup.string().min(1, "Password must be at least 1 characters long").required("Enter password"),
});

export const ProfileSchema = Yup.object({
    name: Yup.string().required("Enter name"),
    email: Yup.string().email("Please enter a valid email address").required("Enter email"),
});