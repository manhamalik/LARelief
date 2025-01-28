import React, { forwardRef } from "react";

const TextArea = forwardRef(
	(
		{
			type = "text",
			label,
			placeholder = "",
			value,
			onChange = () => {},
			extraInputClasses = "",
			extraLabelClasses = "",
			required,
			...rest
		},
		ref
	) => {
		return (
			<div className="relative flex flex-col h-full">
				<label
					className={`text-egg text-xs box-border align-text-bottom font-bold mb-2 ${extraLabelClasses}`}
					htmlFor={label}
				>
					{label}
				</label>
				<textarea
					id={label}
					placeholder={placeholder}
					type={type}
					value={value}
					ref={ref}
					className={`w-full h-full bg-transparent ps-1 box-border text-egg border-egg border-2 rounded-sm focus:outline-none ${extraInputClasses} resize-none`}
					onChange={onChange}
					{...rest}
				/>
				{required && (
					<span className="absolute top-0 right-0 font-siz text-ruby font-bold select-none text-lg">
						*
					</span>
				)}
			</div>
		);
	}
);

TextArea.displayName = "TextArea";
export default TextArea;
