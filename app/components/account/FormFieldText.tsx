import clsx from 'clsx';
import type {InputHTMLAttributes} from 'react';

type Props = {
  description?: string;
  error?: string;
  label: string;
  ref?: React.Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>;

const FormFieldText = (props: Props) => {
  const {description, error, label, ...rest} = props;

  return (
    <div className="w-full space-y-1">
      {/* Label */}
      {label && (
        <label className=" " htmlFor={props.name}>
          {label}
        </label>
      )}
      {/* Description */}
      {description && <div className=" /75">{description}</div>}
      <input
        aria-label={label}
        className={clsx([
          'w-full appearance-none rounded-xs border px-3 py-2  leading-field',
          'disabled:bg-gray/50 disabled:opacity-50',
          'focus:outline-1',
          error ? 'border-red' : 'border-darkGray/50',
        ])}
        {...rest}
      />
      {/* Field error */}
      {error && <div className=" text-red">{error}</div>}
    </div>
  );
};

export default FormFieldText;
