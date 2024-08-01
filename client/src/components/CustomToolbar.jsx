import React, {useState} from "react";
import formats from './ToolbarOptions.js'

const renderSingle = (formatData) => {
    const {className,value} = formatData;
    return (
        <button className = {className} value = {value}></button>
    )
}

const CustomToolbar = () => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const renderOptions = (formatData) => {
        const {className, options} = formatData;
        return (
            <select className={className} value={selectedOption} onChange={handleSelectChange}>
                {
                    options.map(value => {
                        return (
                            <option key={value} value={value}></option>
                        )
                    })
                }
            </select>
        );
    };

    return (
        <div id="toolbar">
            {   
                formats.map(classes => {
                    return (
                        <span className = "ql-formats">
                            {
                                classes.map(formatData => {
                                    return formatData.options?renderOptions(formatData):renderSingle(formatData)
                                })
                            }
                        </span>
                    )
                })
            }
        </div>
    )
}

export default CustomToolbar;