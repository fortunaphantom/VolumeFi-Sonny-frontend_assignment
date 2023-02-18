import React from 'react';

interface ITokenInputProps {
  value: string;
  symbol: string;
  readonly?: boolean;
  onChange?: (arg: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TokenInput = (props: ITokenInputProps) => {
  const { value, symbol, onChange, readonly } = props;

  return (
    <div className="token-input">
      <input
        value={value}
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(evt)
        }
        placeholder="Token amount"
        readOnly={readonly}
      />
      <span>{symbol}</span>
    </div>
  );
};
