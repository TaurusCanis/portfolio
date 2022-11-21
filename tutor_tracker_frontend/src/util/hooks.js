import { useState } from 'react';

export function useFormFields(initialState) {
    const [fields, setFields] = useState(initialState);

    return [
        fields,
        function (val) {
            setFields({...fields, ...val});
        },
    ];
}