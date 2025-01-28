import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import toast from "react-hot-toast";
import { log } from "@/util/logger";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);
	const [page, setPage] = useState(0); //0 is chat page 1 is email page
	const [userEmail, setUserEmail] = useState("");
	const [userMessage, setUserMessage] = useState("");
	const [hasOpened, setHasOpened] = useState(false); //has the button been opened ever
	const [chatHeight, setChatHeight] = useState(350);
	const [chatWidth, setChatWidth] = useState(320);
	const [isButtonOpen, setButtonOpen] = useState(true);

	const [messages, setMessages] = useState([
		{
			sender: "bot",
			buttons: true, // Include the buttons in this message
			text: (
				<p>
					Hi! Here are some frequently asked questions. If your question
					isn&apos;t answered here, please click the button below and send us an
					email!
				</p>
			),
		},
	]);
	const [typing, setTyping] = useState(false); // State to indicate if the bot is typing
	const [dots, setDots] = useState("");

	const [faqs, setFaqs] = useState([]);

	const [faqsFetched, setFaqsFetched] = useState(false);
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		function resizeWidth() {
			log(window.innerWidth);
			if (window.innerWidth <= 1024) {
				setChatWidth(320);
				setChatHeight(window.innerHeight * 0.8);
			} else {
				setChatWidth(400);
				setChatHeight(window.innerHeight * 0.8);
			}
		}

		resizeWidth();

		window.addEventListener("resize", resizeWidth);

		return () => {
			window.removeEventListener("resize", resizeWidth);
		};
	}, []);

	// Check localStorage for FAQs when the component mounts
	useEffect(() => {
		const storedFaqs = sessionStorage.getItem("faqs");
		if (storedFaqs) {
			setFaqs(JSON.parse(storedFaqs));
			setFaqsFetched(true);
		}
	}, []);

	const handleChatbotOpen = () => {
		setButtonOpen(false);
		if (!hasOpened) {
			setHasOpened(true);
		} else {
			setTimeout(() => {
				setHasOpened(false);
			}, 2500);
		}
		setIsOpen(true);

		if (!faqsFetched) {
			fetchFaqs();
		}
	};

	const fetchFaqs = async () => {
		try {
			log(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/faqs`);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/faqs`
			);

			log(response);
			const data = await response.json();
			setFaqs(data.data);
			setFaqsFetched(true);
			sessionStorage.setItem("faqs", JSON.stringify(data.data)); // Save to localStorage
		} catch (error) {
			console.error("Error fetching FAQs:", error);
		}
	};

	const messagesEndRef = useRef(null); // Ref to the end of the messages container

	// Automatically scroll to the bottom when messages update
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleButtonClick = (question) => {
		// Add user message immediately
		setMessages((prev) => [
			...prev,
			{
				sender: "user",
				text: question.Question,
			},
		]);

		// Simulate bot typing
		setTyping(true);
		setTimeout(() => {
			setTyping(false);
			setMessages((prev) => [
				...prev,
				{
					sender: "bot",
					text: question.Answer,
				},
			]);
		}, 700); // 1 second delay for the bot response
	};

	useEffect(() => {
		let interval;
		if (typing) {
			interval = setInterval(() => {
				setDots((prev) => (prev.length < 3 ? prev + "." : ""));
			}, 200);
		} else {
			setDots("");
		}

		return () => clearInterval(interval); // Cleanup on unmount or when typing ends
	}, [typing]);

	async function sendEmailNode() {
		const mailOption = {
			from: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
			to: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
			subject: "User Question/Message from Chatbot",
			html: `
					<div>
						<h1 className='font-bold'>
							${userEmail} asked
						</h1> 
						
						<p className='italic'>
							${userMessage}
						</p>
					</div>
					`,
		};

		const res = await fetch("/api/send-mail", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ mailOption: mailOption }),
		});
		const resObj = await res.json();

		if (res.ok) {
			log(resObj);
			toast.success("Email has been sent! We'll contact you soon");
		} else {
			console.log(error);
			toast.error("Something went wrong. Please try again.");
		}
	}

	return (
		<div className="fixed bottom-2 right-0 z-[9999]">
			{/* Chatbot Icon */}
			<AnimatePresence>
				{!isOpen && (
					<motion.div
						initial={{
							scale: isButtonOpen ? 1 : 0,
						}}
						animate={{
							scale: isButtonOpen ? 1 : [0, 1.2, 1],
						}}
						whileHover={{
							scale: 1.2,
						}}
						exit={{
							scale: [1, 1.5, 0],
							transition: {
								scale: { duration: 0.2 },
								ease: "easeInOut",
							},
						}}
						transition={{
							scale: {
								duration: 0.3,
								delay: isButtonOpen ? 0 : 1,
							},
							ease: "easeInOut",
						}}
						className="absolute bottom-0 right-2 w-20 h-20 cursor-pointer"
						onClick={handleChatbotOpen}
					>
						<Image
							src="/images/ChatbotIMG.png"
							alt="Chatbot"
							width={80}
							height={80}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Chat Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, width: "0px", height: "60px", y: -20 }}
						animate={{
							opacity: 1,
							width: `${chatWidth}px`,
							height: `${chatHeight}px`,
						}}
						layout
						exit={{
							width: "0%",
							opacity: 0,
							height: "0px",
							transition: {
								width: { duration: 0.5, delay: 0.5 },
								height: { duration: 0.5 },
								opacity: {
									duration: 0.3,
									delay: 0.7,
								},
								ease: "easeInOut",
							},
						}}
						transition={{
							opacity: { duration: 0.3, delay: 0.5 },
							width: { duration: 0.5, delay: 0.3 },
							height: { duration: 0.5, delay: 1 },
							left: { duration: 0.5 },
							ease: "easeInOut",
						}}
						className="relative px-4 flex flex-col border-charcoalLight border-solid border-2 bg-charcoal text-white p-3 rounded-lg shadow-lg"
					>
						{/* Can click anywhere on top section to close */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								transition: {
									duration: 0.5,
								},
							}}
							transition={{
								duration: 0.5,
								delay: 1.5,
							}}
							className="flex justify-between items-center mb-3 cursor-pointer"
							onClick={() => {
								setIsOpen(false);
								setPage(0);
								setTimeout(() => {
									setButtonOpen(true);
									console.log("buttonLcose");
								}, 1300);
							}}
						>
							<h2 className="font-bold text-md sm:text-xs md:text-sm lg:text-base">
								{page === 0 ? "Chat" : "Send us an email!"}
							</h2>
							<span className="text-sm w-3 h-3 sm:text-xs md:text-sm lg:text-base hover:text-ruby">
								<FontAwesomeIcon icon={faTimes} size="lg" />
							</span>
						</motion.div>

						{/* Message Display */}
						{page === 0 ? (
							<>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.5,
										},
									}}
									transition={{
										duration: 0.5,
										delay: 1,
									}}
									className="bg-Charcoal pt-2 pr-3 pb-3 pl-1 rounded mb-3 h-50vh sm:h-50vw md:h-40vw lg:h-30vw mobile:h-90vw overflow-y-auto border border-charcoalLight scrollbar"
								>
									{messages.map((message, index) => (
										<div
											key={index}
											className={`mb-2 flex items-start ${
												message.sender === "bot"
													? "justify-start"
													: "justify-end"
											}`}
										>
											{message.sender === "bot" && (
												<Image
													src="/images/ChatbotIMG.png"
													alt="Bot Avatar"
													className="rounded-full"
													width={56}
													height={40}
												/>
											)}
											<div
												className={`inline-block p-2 rounded max-w-xs text-sm sm:text-xs md:text-sm lg:text-base ${
													message.sender === "bot"
														? "bg-Charcoal text-white"
														: "bg-charcoalLight text-white"
												}`}
											>
												{message.text}
												{message.buttons &&
													faqs.length &&
													faqs.map((question, i) => (
														<button
															key={i}
															className="bg-ruby my-1 py-2 px-3 text-left rounded hover:opacity-70 transition-opacity"
															onClick={() => handleButtonClick(question)}
														>
															{question.Question}
														</button>
													))}
											</div>
										</div>
									))}
									{/* Show "bot is typing..." if typing */}
									{typing && (
										<div className="mb-2 flex items-start justify-start">
											<Image
												src="/images/ChatbotIMG.png"
												alt="Bot Avatar"
												className="w-13 h-10 rounded-full"
												width={56}
												height={40}
											/>
											<div className="inline-block animate-pulse p-2 rounded max-w-xs text-sm bg-Charcoal text-white">
												<span className="text-2xl">{dots}</span>
											</div>
										</div>
									)}
									{/* Dummy div to keep at the bottom of the chat */}
									<div ref={messagesEndRef} />
								</motion.div>

								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.2,
										},
									}}
									transition={{
										duration: 0.5,
										delay: 1.5,
									}}
									className="flex justify-center items-center"
								>
									<button
										className="bg-ruby rounded font-bold text-lg py-2 px-4 hover:opacity-70 transition-opacity"
										onClick={() => setPage(1)}
									>
										EMAIL US
									</button>
								</motion.div>
							</>
						) : (
							<>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.5,
										},
									}}
									transition={{
										duration: 0.5,
										delay: 1,
									}}
									className="bg-Charcoal pt-2 pr-3 pb-3 pl-1 rounded mb-3 h-50vw sm:h-50vw md:h-40vw lg:h-30vw lg:max-h-96 mobile:h-90vw border border-charcoalLight text-charcoal flex flex-col gap-4"
								>
									{" "}
									<TextInput
										label="Your Email"
										value={userEmail}
										onChange={(e) => setUserEmail(e.target.value)}
									/>
									<div className="flex-1">
										<TextArea
											label="Message"
											placeholder="Type your message..."
											value={userMessage}
											onChange={(e) => setUserMessage(e.target.value)}
										/>
									</div>
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: {
											duration: 0.2,
										},
									}}
									transition={{
										duration: 0.5,
									}}
									className="flex justify-between p-2 items-center"
								>
									<button
										className="bg-ruby rounded font-bold text-lg py-2 px-4 hover:opacity-70 transition-opacity"
										onClick={() => setPage(0)}
									>
										Back
									</button>
									{/* <button
										className="bg-ruby rounded font-bold text-lg py-2 px-4 hover:opacity-70 transition-opacity"
										onClick={() => sendEmailNode()}
									>
										Send
									</button> */}
								</motion.div>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
