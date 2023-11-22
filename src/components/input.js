import React from "react";

const InputBox = (probs)=>{
    return (
        <div className="mb-3 row">
            <label htmlFor={probs.name} className="col-sm-2 col-form-label text-center">{probs.labelName}</label>
            {probs.readOnly ?
                (<div className="col-sm-10">
                    <input type={probs.type} id={probs.name} className="form-control" value={probs.value} onChange={probs.onChange} readOnly/>
                </div>)
                :
                (<div className="col-sm-10">
                    <input type={probs.type} id={probs.name} className="form-control" 
                    value={probs.value} onChange={probs.onChange} placeholder={probs.placeholder}/>
                </div>)   
            }
        </div>
    )
}

export default InputBox