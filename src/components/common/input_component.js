import React from "react";

export const InputComponent = ({
  placeholder,
  name,
  label,
  formik,
  type = "",
}) => {
  const { values, handleChange, errors, touched } = formik;
  return (
    <React.Fragment>
      <div className="mb-3 w-full flex flex-col items-start object-contain">
        <label className="text-md" htmlFor={name}>
          {label ?? "Label"}
        </label>
        <input
          type={type}
          value={values[name]}
          className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain w-full"
          id={name}
          placeholder={placeholder ?? "label"}
          name={name ?? "label"}
          onChange={handleChange}
        />
        {touched[name] && errors[name] ? (
          <span className="text-red-500 text-sm">{errors[name]}</span>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export const TextAreaComponent = ({ placeholder, name, label, formik }) => {
  const { values, handleChange, errors, touched } = formik;
  return (
    <React.Fragment>
      <div className="mb-3 w-full flex flex-col items-start object-contain">
        <label htmlFor={name}>{label ?? "Label"}</label>
        <textarea
          id={name}
          value={values[name]}
          className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain w-full"
          placeholder={placeholder ?? "label"}
          name={name ?? "label"}
          onChange={handleChange}
        />
        {touched[name] && errors[name] ? (
          <span className="text-red-500 text-sm">{errors[name]}</span>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export const SelectComponent = ({
  list = [],
  placeholder,
  name,
  label,
  formik,
}) => {
  const { values, handleChange, errors, touched } = formik;
  return (
    <React.Fragment>
      <div className="mb-3 w-full flex flex-col items-start object-contain">
        <label className="text-md" htmlFor={name}>
          {label ?? "Label"}
        </label>
        <select
          name={name}
          value={values[name]}
          onChange={handleChange}
          className="appearance-none p-3 bg-gray-100 box-border border border-gray-300 rounded focus:outline-none focus:border-gray-600 object-contain w-full"
        >
          <option value="">{placeholder}</option>
          {list?.map((item, key) => {
            return (
              <option key={key} value={item?.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        {touched[name] && errors[name] ? (
          <span className="text-red-500 text-sm">{errors[name]}</span>
        ) : null}
      </div>
    </React.Fragment>
  );
};
