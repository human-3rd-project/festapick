import styled from 'styled-components';

export const Page = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
	background: #0b1326;
	color: #dae2fd;
	font-family: 'Plus Jakarta Sans', sans-serif;
	padding: 36px 16px 12px;

	@media (max-height: 760px) {
		padding-top: 18px;
	}
`;

export const BackgroundGradient = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	background:
		radial-gradient(circle at 20% 30%, rgba(221, 183, 255, 0.15) 0%, transparent 40%),
		radial-gradient(circle at 80% 70%, rgba(170, 2, 102, 0.15) 0%, transparent 40%);
`;

export const BackgroundPhoto = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	opacity: 0.3;
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
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: calc(100vh - 48px);
	z-index: 1;
	overflow-y: auto;
`;

export const GlassContainer = styled.section`
	width: 100%;
	max-width: 512px;
	border-radius: 12px;
	padding: 16px 24px;
	background: rgba(11, 19, 38, 0.6);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
	animation: signupFadeIn 0.7s ease both;

	@keyframes signupFadeIn {
		from {
			opacity: 0;
			transform: scale(0.98);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@media (max-height: 760px) {
		padding: 12px 20px;
	}

	@media (max-width: 520px) {
		padding: 14px 18px;
	}
`;

export const Heading = styled.div`
	text-align: center;
	margin-bottom: 10px;

	h2 {
		margin: 0 0 4px;
		color: #ddb7ff;
		font-size: 26px;
		line-height: 30px;
		font-weight: 700;
		letter-spacing: 0;
	}

	p {
		margin: 0;
		color: #cfc2d6;
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}

	@media (max-height: 760px) {
		margin-bottom: 8px;
	}
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 5px;

	@media (max-height: 760px) {
		gap: 4px;
	}
`;

export const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;

	label {
		display: block;
		margin-left: 4px;
		color: #cfc2d6;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		letter-spacing: 0;
		transition: color 0.2s ease;
	}

	&:focus-within label {
		color: #ddb7ff;
	}
`;

export const FieldGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

export const FieldWithButton = styled.div`
	display: flex;
	gap: 8px;
`;

export const InputGroup = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
`;

export const Input = styled.input`
	width: 100%;
	min-width: 0;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	background: #222a3d;
	padding: 8px 14px;
	color: #dae2fd;
	font-size: 16px;
	line-height: 24px;
	font-weight: 400;
	transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

	&::placeholder {
		color: rgba(207, 194, 214, 0.58);
	}

	&:focus {
		outline: none;
		border-color: #ddb7ff;
		background: #2d3449;
		box-shadow: 0 0 10px rgba(221, 183, 255, 0.4);
	}

	&[aria-invalid='true'] {
		border-color: #ffb4ab;
		box-shadow: 0 0 0 2px rgba(255, 180, 171, 0.12);
	}

	&[data-has-timer='true'] {
		padding-right: 70px;
	}

	&[data-no-focus-animation='true'] {
		transition: none;
	}

	&[data-no-focus-animation='true']:focus {
		border-color: rgba(255, 255, 255, 0.1);
		background: #222a3d;
		box-shadow: none;
	}

	&[data-no-focus-animation='true'][aria-invalid='true']:focus {
		border-color: #ffb4ab;
	}
`;

export const FieldMessage = styled.p`
	margin: -3px 0 0 4px;
	min-height: 26px;
	font-size: 11px;
	line-height: 13px;
	font-weight: 500;
	word-break: keep-all;
	overflow-wrap: anywhere;

	&.empty {
		visibility: hidden;
	}

	&.error {
		color: #ffb4ab;
	}

	&.success {
		color: #8ee6a8;
	}
`;

export const GlassButton = styled.button`
	flex-shrink: 0;
	min-width: 82px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	padding: 8px 14px;
	color: #ddb7ff;
	font-size: 12px;
	line-height: 16px;
	font-weight: 600;
	white-space: nowrap;
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.4);
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 2px;
	}

	&:active {
		transform: scale(0.95);
	}

	&:disabled {
		opacity: 0.55;
		cursor: not-allowed;
		transform: none;
	}

	&:disabled:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 380px) {
		padding-inline: 12px;
	}
`;

export const Timer = styled.span`
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	color: #ffb0cd;
	font-size: 12px;
	line-height: 16px;
	font-weight: 700;
	pointer-events: none;
`;

export const PasswordGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 14px;
	}
`;

export const Terms = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	padding-top: 0;

	input {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
		margin: 0;
		accent-color: #b76dff;
		cursor: pointer;
	}

	label {
		color: #cfc2d6;
		font-size: 12px;
		line-height: 18px;
		font-weight: 500;
		cursor: pointer;
	}

	a {
		color: #ddb7ff;
		text-decoration: none;
		font-weight: 700;
	}

	a:hover {
		text-decoration: underline;
	}
`;

export const NeonButton = styled.button`
	width: 100%;
	border: none;
	border-radius: 12px;
	background: linear-gradient(135deg, #b76dff 0%, #aa0266 100%);
	box-shadow: 0 4px 15px rgba(183, 109, 255, 0.3);
	padding: 9px 16px;
	margin-top: 4px;
	color: #fff;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	cursor: pointer;
	transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

	&:hover {
		filter: brightness(1.05);
		box-shadow: 0 4px 15px rgba(183, 109, 255, 0.3);
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 3px;
	}

	&:active {
		transform: scale(0.98);
	}

	&:disabled {
		opacity: 0.65;
		cursor: not-allowed;
		transform: none;
		filter: grayscale(0.15);
	}

	&:disabled:hover {
		box-shadow: 0 4px 15px rgba(183, 109, 255, 0.3);
		filter: grayscale(0.15);
	}
`;

export const LoginPrompt = styled.div`
	margin-top: 10px;
	padding-top: 10px;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	text-align: center;

	p {
		margin: 0;
		color: #cfc2d6;
		font-size: 14px;
		line-height: 20px;
		font-weight: 400;
	}

	a {
		margin-left: 8px;
		color: #ddb7ff;
		font-weight: 700;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}
`;

const Styles = {
	Page,
	BackgroundGradient,
	BackgroundPhoto,
	Main,
	GlassContainer,
	Heading,
	Form,
	Field,
	FieldGroup,
	FieldWithButton,
	InputGroup,
	Input,
	FieldMessage,
	GlassButton,
	Timer,
	PasswordGrid,
	Terms,
	NeonButton,
	LoginPrompt,
};

export default Styles;
