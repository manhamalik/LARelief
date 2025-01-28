import React from "react";

const Checkmark = () => {
	return (
		<>
			<div className="flex justify-center items-center w-24 h-24 border-2 border-egg bg-ruby rounded-full">
				<svg
					className="w-12 h-12 text-egg"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						className="checkmark-path stroke-current"
						fill="none"
						strokeWidth="3"
						d="M6 12l4 4L18 6"
					/>
				</svg>
			</div>
			<style jsx>{`
				.checkmark-path {
					stroke-dasharray: 100; /* Length of the path */
					stroke-dashoffset: 100; /* Start hidden */
					animation: draw 0.5s forwards; /* Animation properties */
				}

				@keyframes draw {
					to {
						stroke-dashoffset: 0; /* Show the path */
					}
				}
			`}</style>
		</>
	);
};

export default Checkmark;
