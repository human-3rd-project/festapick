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
	padding: 80px 16px 24px;
`;

export const BackgroundPhoto = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	opacity: 0.32;
	pointer-events: none;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1);
	}
`;

export const BackgroundOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 0;
	pointer-events: none;
	background:
		radial-gradient(circle at 18% 28%, rgba(221, 183, 255, 0.16) 0%, transparent 38%),
		radial-gradient(circle at 82% 72%, rgba(255, 2, 141, 0.14) 0%, transparent 38%),
		linear-gradient(180deg, rgba(11, 19, 38, 0.24) 0%, rgba(11, 19, 38, 0.84) 100%);
`;

export const Main = styled.main`
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

export const Panel = styled.section`
	width: 100%;
	max-width: 440px;
	border-radius: 12px;
	padding: 48px;
	background: rgba(19, 27, 46, 0.72);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1px solid rgba(255, 255, 255, 0.1);
	box-shadow:
		0 0 40px rgba(221, 183, 255, 0.05),
		0 30px 70px rgba(0, 0, 0, 0.28);

	@media (max-width: 520px) {
		padding: 34px 24px;
	}
`;

export const Header = styled.div`
	text-align: center;
	margin-bottom: 24px;

	h2 {
		margin: 0 0 8px;
		color: #ddb7ff;
		font-size: 32px;
		line-height: 40px;
		font-weight: 700;
		letter-spacing: 0;
	}

	p {
		margin: 0;
		color: #cfc2d6;
		font-size: 16px;
		line-height: 24px;
		font-weight: 400;
		letter-spacing: 0;
	}
`;

export const Form = styled.form`
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
		color: #dae2fd;
		font-size: 14px;
		line-height: 20px;
		font-weight: 600;
		letter-spacing: 0;
	}
`;

export const InputGroup = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`;

export const Icon = styled.span`
	position: absolute;
	left: 16px;
	top: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	transform: translateY(-50%);
	color: rgba(207, 194, 214, 0.78);
	transition: color 0.2s ease;

	${InputGroup}:focus-within & {
		color: #ddb7ff;
	}
`;

export const Input = styled.input`
	width: 100%;
	height: 44px;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	background: #2d3449;
	padding: 10px 48px;
	color: #dae2fd;
	font-size: 16px;
	line-height: 24px;
	font-weight: 400;
	letter-spacing: 0;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;

	&::placeholder {
		color: rgba(207, 194, 214, 0.5);
	}

	&:focus {
		outline: none;
		border-color: #ddb7ff;
		box-shadow: 0 0 10px rgba(221, 183, 255, 0.4);
	}

	&.error {
		border-color: #ffb4ab;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}
`;

export const VisibilityButton = styled.button`
	position: absolute;
	right: 12px;
	top: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border: none;
	border-radius: 8px;
	background: transparent;
	color: rgba(207, 194, 214, 0.8);
	cursor: pointer;
	transform: translateY(-50%);
	transition: color 0.2s ease, background 0.2s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #ddb7ff;
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 2px;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
`;

export const ErrorMessage = styled.p`
	display: none;
	margin: 4px 0 0;
	color: #ffb4ab;
	font-size: 12px;
	line-height: 16px;
	font-weight: 500;
	letter-spacing: 0;

	&.visible {
		display: block;
	}
`;

export const StatusMessage = styled.div`
	display: none;
	border-radius: 4px;
	border: 1px solid rgba(221, 183, 255, 0.2);
	background: rgba(221, 183, 255, 0.1);
	padding: 4px 8px;
	color: #ddb7ff;
	font-size: 12px;
	line-height: 16px;
	font-weight: 500;
	letter-spacing: 0;

	&.visible {
		display: block;
	}

	&.error {
		border-color: rgba(255, 180, 171, 0.2);
		color: #ffb4ab;
	}
`;

export const NeonButton = styled.button`
	width: 100%;
	border: none;
	border-radius: 8px;
	padding: 12px;
	background: linear-gradient(135deg, #b76dff 0%, #ff028d 100%);
	box-shadow: 0 4px 15px rgba(183, 109, 255, 0.4);
	color: #fff;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	letter-spacing: 0;
	cursor: pointer;
	transition: transform 0.3s ease, box-shadow 0.3s ease;

	&:hover {
		box-shadow: 0 0 25px rgba(183, 109, 255, 0.6);
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 3px;
	}

	&:active {
		transform: scale(0.95);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.65;
		transform: none;
		box-shadow: none;
	}
`;

export const ResultArea = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	text-align: center;
`;

export const ResultBox = styled.div`
	box-sizing: border-box;
	width: 100%;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.05);
	padding: 24px;
`;

export const ResultIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	margin: 0 auto 16px;
	border-radius: 9999px;
	background: rgba(221, 183, 255, 0.1);
	border: 1px solid rgba(221, 183, 255, 0.2);
	color: #ddb7ff;

	&.error {
		border-color: rgba(255, 180, 171, 0.24);
		background: rgba(255, 180, 171, 0.1);
		color: #ffb4ab;
	}

	&.loading svg {
		animation: reset-password-spin 0.9s linear infinite;
	}

	@keyframes reset-password-spin {
		to {
			transform: rotate(360deg);
		}
	}
`;

export const ResultTitle = styled.p`
	margin: 0 0 8px;
	color: #ddb7ff;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	letter-spacing: 0;

	&.error {
		color: #ffb4ab;
	}
`;

export const ResultDescription = styled.p`
	margin: 0;
	color: #cfc2d6;
	font-size: 16px;
	line-height: 24px;
	font-weight: 400;
	letter-spacing: 0;
`;

export const GlassLink = styled.a`
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 44px;
	border-radius: 8px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	padding: 12px;
	background: rgba(255, 255, 255, 0.05);
	backdrop-filter: blur(4px);
	-webkit-backdrop-filter: blur(4px);
	color: #dae2fd;
	font-size: 14px;
	line-height: 20px;
	font-weight: 600;
	letter-spacing: 0;
	text-decoration: none;
	cursor: pointer;
	transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

	&:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.4);
	}

	&:focus-visible {
		outline: 3px solid rgba(221, 183, 255, 0.32);
		outline-offset: 3px;
	}

	&:active {
		transform: scale(0.95);
	}
`;

const Styles = {
	Page,
	BackgroundPhoto,
	BackgroundOverlay,
	Main,
	Panel,
	Header,
	Form,
	Field,
	InputGroup,
	Icon,
	Input,
	VisibilityButton,
	ErrorMessage,
	StatusMessage,
	NeonButton,
	ResultArea,
	ResultBox,
	ResultIcon,
	ResultTitle,
	ResultDescription,
	GlassLink,
};

export default Styles;
