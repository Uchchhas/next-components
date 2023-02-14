import {useEffect, useRef, useState} from "react";

const FormInput = (
    {
        type = "text",
        isClear = false,
        handleChange
    }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputElement = useRef(null);

    const onChange = (e) => {
        handleChange(e.target.value)
        if (e.target.value) setIsFocused(true);
    };

    const onFocus = () => {
        setIsFocused(true);
    };

    const onBlur = (e) => {
        if (!e.target.value) setIsFocused(false);
    };

    const clearInput = () => {
        inputElement.current.value = "";
        setIsFocused(false);
    };

    useEffect(() => {
        if (isClear) {
            clearInput();
        }
    }, [isClear]);

    return (
        <div className={`form-group ${isFocused ? "focused" : ""}`}>
            {type === "text" && (
                <input
                    ref={inputElement}
                    type={type}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            )}
            {type === "textarea" && (
                <textarea
                    ref={inputElement}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                ></textarea>
            )}
        </div>
    );
};

export default FormInput;
