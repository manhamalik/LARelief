import React, { forwardRef } from "react";
import { log } from "@/util/logger";

/*
USAGE:
const [name, setName] = useState(""); //control the state of the input so it is easy for form submission
	return (
			<TextInput
				label="Name"
				value={name}
				placeholder="John Doe"
				onChange={(e) => setName(e.target.value)}
        extraInputClasses={"w-44"}
			/>
	);

-------------------------------------
CHANGE TYPE
			<TextInput
				label="Name"
				value={name}
				placeholder="John Doe"
				onChange={(e) => setName(e.target.value)}
				type="number"
				min={0} // accepts regular input attributes
				max={5}
			/>

-------------------------------------
ADD EXTRA CLASSES
        <TextInput
					label="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					extraInputClasses={"bg-black"}
					extraLabelClasses={"text-ruby"}
				/>
*/

const TextInput = forwardRef(
	(
		{
			type = "text",
			label,
			value,
			onChange = () => {},
			extraInputClasses = "",
			extraLabelClasses = "",
			required = false,
			...rest
		},
		ref
	) => {
		return (
			<>
				<div className="grid relative">
					<label
						className={`${
							!extraLabelClasses.includes("text-") && "text-egg"
						} text-xs box-border align-text-bottom font-bold ${extraLabelClasses} ${
							type !== "date" ? "hidden" : ""
						}`}
						htmlFor={label}
					>
						{label}
					</label>
					{type === "date" && log("date value", !value)}
					<input
						id={label}
						placeholder={label}
						type={type}
						value={value}
						ref={ref}
						className={`w-full ${
							!extraInputClasses.includes("text-charcoal") && " border-egg"
						}  bg-transparent border-b-2 h-8 ps-1 box-border focus:outline-none ${extraInputClasses} ${
							type === "date" && !value
								? "text-[#949aa6]"
								: !extraInputClasses.includes("text-charcoal")
								? "text-egg"
								: ""
						} `}
						onChange={onChange}
						{...rest}
					/>
					{required && (
						<span className="absolute top-0 right-0 font-siz text-ruby font-bold select-none text-lg">
							*
						</span>
					)}
				</div>
				<style jsx>{`
					.datepicker-icon {
						appearance: none;
						position: relative;
						background-image: url("data:image/svg+xml;base64,...");
						background-repeat: no-repeat;
						background-position: right 10px center;
					}

					input[type="date"]::-webkit-calendar-picker-indicator {
						filter: brightness(0) saturate(100%) invert(99%) sepia(28%)
							saturate(561%) hue-rotate(307deg) brightness(98%) contrast(90%);
						opacity: 0.7; /* Adjust the color using filter or opacity */
					}
				`}</style>
			</>
		);
	}
);

TextInput.displayName = "TextInput";
export default TextInput;
