import React from "react";

const InputBox = (probs)=>{
    return (
        <div class="mb-3 row">
            <label for={probs.name} class="col-sm-2 col-form-label text-center">{probs.labelName}</label>
            {probs.readOnly ?
                (<div class="col-sm-10">
                    <input type={probs.type} id={probs.name} class="form-control" value={probs.value} onChange={probs.onChange} readonly/>
                </div>)
                :
                (<div class="col-sm-10">
                    <input type={probs.type} id={probs.name} class="form-control" 
                    value={probs.value} onChange={probs.onChange} placeholder={probs.placeholder}/>
                </div>)   
            }
        </div>
    )
}

export default InputBox