import styled, { keyframes } from 'styled-components';

export const Page = styled.div`
	position: relative;
	width: 100%;
	min-height: 100vh;
	overflow-x: hidden;
	background: #0b1326;
	color: #dae2fd;
	font-family: 'Plus Jakarta Sans', sans-serif;
`;

export const BackgroundGradient = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	background:
		radial-gradient(circle at 20% 30%, rgba(183, 109, 255, 0.15) 0%, transparent 40%),
		radial-gradient(circle at 80% 70%, rgba(170, 2, 102, 0.15) 0%, transparent 40%);
`;

export const BackgroundPhoto = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	opacity: 0.2;
	pointer-events: none;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1);
	}
`;

export const Main = styled.main`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	padding: 48px 16px;
`;

export const GlassPanel = styled.section`
	position: relative;
	width: 100%;
	max-width: 480px;
	overflow: hidden;
	border-radius: 12px;
	padding: 48px;
	background: rgba(19, 27, 46, 0.7);
	border: 1px solid rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	box-shadow: 0 25px 70px rgba(0, 0, 0, 0.38);

	@media (max-width: 520px) {
		padding: 32px 24px;
	}
`;

export const Heading = styled.div`
	margin-bottom: 48px;
	text-align: center;

	h1 {
		margin: 0 0 8px;
		color: #ddb7ff;
		font-size: 48px;
		line-height: 56px;
		font-weight: 800;
		font-style: italic;
		letter-spacing: 0;
		text-shadow: 0 0 24px rgba(221, 183, 255, 0.32);
	}

	h2 {
		margin: 0;
		color: #dae2fd;
		font-size: 24px;
		line-height: 32px;
		font-weight: 600;
		letter-spacing: 0;
	}

	p {
		margin: 4px 0 0;
		color: #cfc2d6;
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;
	}
`;

export const Form = styled.form`
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	label {
		margin-left: 4px;
		color: #cfc2d6;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		letter-spacing: 0;
	}
`;

export const FieldWithButton = styled.div`
	display: flex;
	gap: 8px;

	@media (max-width: 420px) {
		flex-direction: column;
	}
`;

export const InputGroup = styled.div`
	position: relative;
	display: flex;
	flex: 1;
	align-items: center;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	transition: border-color 0.3s ease, box-shadow 0.3s ease;

	&:focus-within {
		border-color: #ddb7ff;
		box-shadow: 0 0 15px rgba(221, 183, 255, 0.4);
	}
`;

export const Input = styled.input`
	width: 100%;
	border: 1px solid rgba(255, 255, 255, 0.05);
	border-radius: 8px;
	background: rgba(45, 52, 73, 0.3);
	padding: 14px 16px;
	color: #dae2fd;
	font-size: 16px;
	line-height: 24px;
	font-weight: 400;
	transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

	${InputGroup} & {
		border: none;
		background: transparent;
	}

	&::placeholder {
		color: rgba(207, 194, 214, 0.4);
	}

	&:focus {
		outline: none;
	}

	&:disabled {
		cursor: not-allowed;
		color: rgba(207, 194, 214, 0.85);
		opacity: 0.7;
	}

	&[aria-invalid='true'] {
		border-color: rgba(255, 180, 171, 0.5);
	}
`;

export const GlassButton = styled.button`
	flex-shrink: 0;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	background: #222a3d;
	padding: 14px 20px;
	color: #ddb7ff;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	cursor: pointer;
	transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

	&:hover {
		background: #31394d;
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 3px;
	}

	&:active {
		transform: scale(0.95);
	}
`;

export const HelpText = styled.p`
	margin: 0 0 0 4px;
	color: rgba(207, 194, 214, 0.6);
	font-size: 12px;
	line-height: 16px;
	font-weight: 500;
`;

export const FieldMessage = styled.p`
	min-height: 18px;
	margin: 2px 0 0 4px;
	font-size: 12px;
	line-height: 16px;
	font-weight: 500;

	&.empty {
		visibility: hidden;
	}

	&.error {
		color: #ffb4ab;
	}

	&.success {
		color: #ddb7ff;
	}
`;

export const Divider = styled.div`
	width: 100%;
	height: 1px;
	margin: 0;
	background: rgba(255, 255, 255, 0.05);
`;

export const TermsGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const CheckboxInput = styled.input`
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
`;

export const CustomCheckbox = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 20px;
	height: 20px;
	margin-top: 4px;
	border: 2px solid #4d4354;
	border-radius: 4px;
	color: #490080;
	transition: background 0.2s ease, border-color 0.2s ease;

	svg {
		transform: scale(0);
		transition: transform 0.2s ease;
	}
`;

export const MasterTerm = styled.label`
	position: relative;
	display: flex;
	align-items: flex-start;
	gap: 12px;
	cursor: pointer;

	span:last-child {
		color: #dae2fd;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	&:hover span:last-child {
		color: #ddb7ff;
	}

	${CheckboxInput}:checked + ${CustomCheckbox} {
		border-color: #ddb7ff;
		background: #ddb7ff;
	}

	${CheckboxInput}:checked + ${CustomCheckbox} svg {
		transform: scale(1);
	}
`;

export const TermList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding-left: 32px;
`;

export const TermItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	span {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	label {
		color: #cfc2d6;
		font-size: 12px;
		line-height: 16px;
		font-weight: 500;
		cursor: pointer;
	}
`;

export const SmallCheckbox = styled.input`
	width: 16px;
	height: 16px;
	margin: 0;
	accent-color: #ddb7ff;
	cursor: pointer;
`;

export const TermLink = styled.a`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 22px;
	height: 22px;
	color: rgba(207, 194, 214, 0.4);
	transition: color 0.2s ease, transform 0.2s ease;

	&:hover {
		color: #ddb7ff;
		transform: translateX(1px);
	}

	&:focus-visible {
		outline: 2px solid rgba(221, 183, 255, 0.34);
		outline-offset: 2px;
		border-radius: 4px;
	}
`;

const spin = keyframes`
	to {
		transform: rotate(360deg);
	}
`;

export const SubmitButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	width: 100%;
	border: none;
	border-radius: 9999px;
	margin-top: 16px;
	padding: 16px;
	background: linear-gradient(135deg, #b76dff 0%, #aa0266 100%);
	color: #fff;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 12px 26px rgba(0, 0, 0, 0.2);
	transition: box-shadow 0.3s ease, transform 0.3s ease, opacity 0.2s ease;

	svg {
		animation: ${spin} 0.9s linear infinite;
	}

	&:hover:not(:disabled) {
		box-shadow: 0 0 25px rgba(183, 109, 255, 0.6);
		transform: translateY(-1px);
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 3px;
	}

	&:disabled {
		cursor: wait;
		opacity: 0.82;
	}
`;

export const BackButton = styled.button`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	align-self: center;
	gap: 4px;
	border: none;
	background: transparent;
	padding: 0;
	color: #cfc2d6;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	cursor: pointer;
	transition: color 0.2s ease;

	svg {
		transition: transform 0.2s ease;
	}

	&:hover {
		color: #ddb7ff;
	}

	&:hover svg {
		transform: translateX(-4px);
	}

	&:focus-visible {
		outline: 2px solid rgba(221, 183, 255, 0.34);
		outline-offset: 4px;
		border-radius: 4px;
	}
`;

export const CardGlowTop = styled.div`
	position: absolute;
	top: -80px;
	right: -80px;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	background: rgba(221, 183, 255, 0.1);
	filter: blur(80px);
	pointer-events: none;
`;

export const CardGlowBottom = styled.div`
	position: absolute;
	bottom: -80px;
	left: -80px;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	background: rgba(255, 176, 205, 0.1);
	filter: blur(80px);
	pointer-events: none;
`;

const Styles = {
	Page,
	BackgroundGradient,
	BackgroundPhoto,
	Main,
	GlassPanel,
	Heading,
	Form,
	Field,
	FieldWithButton,
	InputGroup,
	Input,
	GlassButton,
	HelpText,
	FieldMessage,
	Divider,
	TermsGroup,
	CheckboxInput,
	CustomCheckbox,
	MasterTerm,
	TermList,
	TermItem,
	SmallCheckbox,
	TermLink,
	SubmitButton,
	BackButton,
	CardGlowTop,
	CardGlowBottom,
};

export default Styles;
