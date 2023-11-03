import React from 'react'
import './style.css'

function RadioButton(props) {

    const { id, name, value, label, checked, className, onChange, onClick } = props;

    return (
        <div>
            <label htmlFor={id} className="radio-container">{label}
                <input
                    type="radio"
                    id={id}
                    name={name}
                    value={value}
                    checked={checked}
                    className={className}
                    onChange={onChange}
                    onClick={onClick}
                />
                <span className="checkmark"></span>
            </label>
        </div>
    )
}

export default RadioButton
