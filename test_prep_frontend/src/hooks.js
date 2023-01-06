import { useState } from "react";

export function useFormFields(initialData) {
    const [fields, setFields] = useState(initialData);
    return [
        fields,
        (val) => {
            setFields({...fields, ...val})
        }
    ]
}