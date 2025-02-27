import { RadioButtonsProps } from '@/lib/definitions/ui';
import { handleKeyPress } from '@/lib/utils';

export const RadioButtons = ({ options, title, defaultValue, changeValue }: RadioButtonsProps) => {
  return (
    <div className="flex flex-col mt-4">
      <h3 className="text-lg font-medium mb-2" id="radio-group-title">
        {title}
      </h3>
      <div className="w-full flex gap-5" role="radiogroup" aria-labelledby="radio-group-title">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center"
            role="radio"
            aria-checked={option.value === defaultValue}
          >
            <input
              type="radio"
              name="radio"
              onClick={() => changeValue(option.value)}
              defaultChecked={option.value === defaultValue}
              className="form-radio h-5 w-5 text-blue-600"
              aria-label={option.label}
              onKeyDown={(event) => handleKeyPress(event, () => changeValue(option.value))}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
