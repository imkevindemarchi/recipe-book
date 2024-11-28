// Types
import { ErrorT } from "../types";

const EMAIL_REG_EXP = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

export function checkEmail(email: string): ErrorT {
    if (EMAIL_REG_EXP.test(email)) return { value: false };
    else
        return {
            value: true,
            message: "E-mail errata",
        };
}

export function checkFormField(field: string): ErrorT {
    if (field && field.trim() !== "") return { value: false };
    else
        return {
            value: true,
            message: "Campo obbligatorio *",
        };
}

export function checkFormFieldImage(field: File | null): ErrorT {
    if (field) return { value: false };
    else return { value: true, message: "Campo obbligatorio *" };
}
