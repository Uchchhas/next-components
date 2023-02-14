import {useEffect, useState} from 'react'
import FormInput from './FormInput'

const FormElement = () => {
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    useEffect(() => {
        console.log(formData)
    }, [formData])

    return (
        <>
            <FormInput
                handleChange={(value) => setFormData(prevState => ({
                    ...prevState,
                    name: value
                }))}
            />
            <FormInput
                type="textarea"
                handleChange={(value) => setFormData(prevState => ({
                    ...prevState,
                    message: value
                }))}
            />
        </>
    )
}

export default FormElement;