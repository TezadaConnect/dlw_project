import React from "react";

export const InputComponent = ({ placeholder, name, label, formik }) => {
  const { handleChange, errors, touched } = formik;
  return (
    <React.Fragment>
      <div className="mb-3 w-full flex flex-col">
        <label className="text-md" htmlFor={name}>
          {label ?? "Label"}
        </label>
        <input
          className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600"
          id={name}
          placeholder={placeholder ?? "label"}
          name={name ?? "label"}
          onChange={handleChange}
        />
        {touched[name] && errors[name] ? <span className="text-red-500 text-sm">{errors[name]}</span> : null}
      </div>
    </React.Fragment>
  );
};

export const TextAreaComponent = ({ placeholder, name, label, formik }) => {
  const { handleChange, errors, touched } = formik;
  return (
    <React.Fragment>
      <label htmlFor={name}>{label ?? "Label"}</label>
      <textarea id={name} placeholder={placeholder ?? "label"} name={name ?? "label"} onChange={handleChange} />
      {touched[name] && errors[name] ? <span className="text-red-500">{errors[name]}</span> : null}
    </React.Fragment>
  );
};
