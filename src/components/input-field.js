import React from 'react';
import styled from 'styled-components';

var Styles = styled.div`
    .input-field-container {
        flex-direction: column;
        border-bottom: 1px solid #4d4900;
        display: inline-flex;
        position: relative;
        left: 8px;
        height: 44px;
        background-color: #EE6211;
    }

    .input-field-container.focused {
        border-bottom-width: 2px;
        border-bottom-color: #4d4900;
    }

    .input-label {
        display: inline;
        position: absolute;
        /* transform: translateY(-10px) scale(0.75); */
        opacity: 1;
        top: 14px;
        left: 2px;
        color: #4d4900;
        transition: 0.1s ease-in;
    }

    .input-label--notched {
        transform: translateY(-10px) scale(0.75);
        left: -2px;
        top: 10px;
    }

    .input-field {
        color: #FFFFFF;
        padding: 16px 0px 0px 8px;
        border: none;
        outline: none;
        height: 100%;
        background-color: transparent;
    }
`

export default function InputField({ inputProps, label, className }) {
    var containerRef = React.useRef();

    function fieldFocus(e) {
        var [label, input] = Array.from(containerRef.current.children);
        containerRef.current.classList.add("focused");
        label.classList.add("input-label--notched");
    }

    function fieldBlur() {
        var [label, input] = Array.from(containerRef.current.children);
        containerRef.current.classList.remove("focused");
        if (input.value.length == 0) {
            label.classList.remove("input-label--notched");
        }
    }

    return (
        <Styles>
            <div ref={containerRef} className={`input-field-container ${className}`}>
                <label className="input-label" htmlFor={inputProps.id}>{label}</label>
                <input onFocus={fieldFocus} onBlur={fieldBlur} className='input-field' {...inputProps} />
            </div>
        </Styles>
    )
}