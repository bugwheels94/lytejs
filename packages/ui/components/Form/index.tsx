import React, { useEffect, useContext, useRef, useState, ReactElement } from "react";

export const useForm = () => {
  const [state, setState] = useState({});
  const ref = useRef({
    list: {} as Record<string, any>, // {string: setStateItem}
    updaterList: {} as Record<string, Function> // {string: setStateItem}
  });
  return ref;
};
const defaultContext: ReturnType<typeof useForm> = {
  current: { list: {}, updaterList: {} }
};
export const FormContext = React.createContext(defaultContext);

export const Form = ({
  formInstance,
  ...props
}: { formInstance?: ReturnType<typeof useForm> } & React.HTMLProps<
  HTMLFormElement
>) => {
  const ctx = useForm();

  return (
    <FormContext.Provider value={formInstance || ctx}>
      <form {...props}></form>
    </FormContext.Provider>
  );
};
interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  name: string; // my custom prop
  dependencies?: string[]
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function cool(props, ref) {
    return <input {...props} ref={ref} />;
  }
);

interface FormItemProps extends React.ComponentPropsWithoutRef<"label"> {
  name: string; // my custom prop
  dependencies?: string[]
  label?: string
}

export const FormItem = ({ name, children, initialValue }: { name: string, children?: ReactElement | Function, initialValue?: any }) => {
  const [value, setValue] = useState(initialValue);
  const ctx = useContext(FormContext);
  ctx.current.updaterList[name] = setValue;
  const finalValue = value
  useEffect(() => {
    ctx.current.list[name] = finalValue;
    console.log(ctx.current.list);
  }, [finalValue, ctx, name]);
  let child;
  const f = <input
    name={name}
    value={finalValue}
    onChange={(e) => {
      if (props.onChange) props.onChange(e);
      setValue(e.target.value);
    }}
  />
  if (typeof children === 'function') {
    child = children(ctx.current)
  } else if (React.isValidElement(children)) {
    child = React.cloneElement(children, {
      value: finalValue,
      onChange: (
        ev: React.ChangeEvent<HTMLInputElement>,
      ) => {
        setValue(ev.target.value);
      }
    })

  } else {
    child = <input
      name={name}
      value={finalValue}
      onChange={(e) => {
        if (props.onChange) props.onChange(e);
        setValue(e.target.value);
      }}
    />

  }
  return (
    <label ref={ref}
      {...props}
    >
      {props.label}
    </label>
  );
}

