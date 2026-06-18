import React, { useState } from 'react';
import { CircleCheck, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AxiosApi from '../../api/AxiosApi';
import Styles from './FindIdPageCss';

const initialResult = {
	visible: false,
	type: '',
	foundId: '',
	message: '',
};

const initialStatus = {
	visible: false,
	type: '',
	message: '',
};

const FindIdPage = () => {
	// 아이디 찾기 화면은 이메일 하나만 입력받습니다.
	// input value와 state를 연결해 사용자가 입력한 값이 검증과 API 요청에 그대로 사용되도록 합니다.
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [status, setStatus] = useState(initialStatus);
	const [result, setResult] = useState(initialResult);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const setStatusMessage = (type, message) => {
		// visible은 실제 표시할 문구가 있을 때만 true로 둡니다.
		// 이렇게 하면 이전 API 실패 메시지가 새 입력 흐름에 남아 있지 않습니다.
		setStatus({ visible: Boolean(message), type, message });
	};

	const getApiMessage = (error, fallbackMessage) => {
		// 백엔드 GlobalExceptionHandler는 실패 시 { success:false, message, data:null } 구조를 내려줍니다.
		// 응답이 없는 네트워크 오류나 메시지가 비어 있는 경우에는 화면 기본 문구를 사용합니다.
		const serverMessage = error?.response?.data?.message;

		return serverMessage || fallbackMessage;
	};

	const validateEmail = () => {
		// 앞뒤 공백은 실수 입력으로 보고 제거합니다.
		// 백엔드 AccountController는 RequestParam email을 받으므로 검증을 통과한 문자열만 전달합니다.
		const normalizedEmail = email.trim().toLowerCase();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!normalizedEmail) {
			return {
				isValid: false,
				message: '이메일 주소를 입력해 주세요.',
			};
		}

		if (!emailRegex.test(normalizedEmail)) {
			return {
				isValid: false,
				message: '유효한 이메일 주소를 입력해 주세요.',
			};
		}

		return {
			isValid: true,
			email: normalizedEmail,
		};
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// 요청 중 중복 제출을 막아 같은 이메일 조회가 여러 번 전송되지 않게 합니다.
		if (isSubmitting) {
			return;
		}

		const validation = validateEmail();

		if (!validation.isValid) {
			setEmailError(validation.message);
			setStatus(initialStatus);
			setResult(initialResult);
			return;
		}

		setEmailError('');
		setResult(initialResult);
		setIsSubmitting(true);
		setStatusMessage('success', '입력하신 이메일로 가입된 아이디를 확인하고 있습니다.');

		try {
			// 기존 AxiosApi.findLoginId는 GET /auth/account/login-id?email=...을 호출합니다.
			// 백엔드는 ApiResponse<String>의 data 필드에 마스킹된 로그인 ID를 담아 반환합니다.
			const response = await AxiosApi.findLoginId(validation.email);
			const foundId = response.data?.data;

			if (!response.data?.success || !foundId) {
				setStatusMessage(
					'error',
					response.data?.message || '입력하신 이메일로 가입된 아이디를 찾을 수 없습니다.',
				);
				return;
			}

			setStatus(initialStatus);
			setResult({
				visible: true,
				type: 'success',
				foundId,
				message: '가입하신 이메일로 아이디를 찾았습니다.',
			});
		} catch (error) {
			setStatusMessage(
				'error',
				getApiMessage(error, '입력하신 이메일로 가입된 아이디를 찾을 수 없습니다.'),
			);
			setResult(initialResult);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRetry = () => {
		setEmail('');
		setEmailError('');
		setStatus(initialStatus);
		setResult(initialResult);
	};

	return (
		<Styles.Page>
			<Styles.BackgroundGradient />
			<Styles.BackgroundPhoto aria-hidden="true">
				<img
					alt=""
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIj15k-ljVdcr_iF9_MAF0i6UfyVlHxlbV0FGb-qfnh-wnhNY4Afn8-L6Hs5znPNOBHGiJ6V5WGdrx55qqUOFLC29ZRK3tR9dy4LXulOkRQWIPgUE3Yt9lVRu_-nPDoy21dfA3DdYtIu9auk5AQp6x_lh_Oci6P9dyWclv2GyjcupQvflq5WZhe0x-zMJOfP2MKbcHLP3RjNqmfADYfCnASQ_D_9FXRWJZCiV7vefM8wf4woe_de4tfVvY-HG770NHuR66QpoLJC1d"
				/>
			</Styles.BackgroundPhoto>

			<Styles.Main>
				<Styles.GlassContainer className={result.visible ? result.type : ''}>
					<Styles.Header>
						<h2>{result.visible ? '아이디 찾기 완료' : '아이디 찾기'}</h2>
						<p>{result.visible ? result.message : '가입한 이메일로 아이디를 찾아보세요.'}</p>
					</Styles.Header>

					{result.visible ? (
						<Styles.ResultArea className={result.type}>
							<Styles.ResultBox className={result.type}>
								<Styles.ResultIcon className={result.type} aria-hidden="true">
									<CircleCheck size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultLabel>Success</Styles.ResultLabel>
								<Styles.ResultTitle>아이디를 찾았습니다</Styles.ResultTitle>
								{result.foundId ? (
									<Styles.FoundId>
										<User size={18} strokeWidth={2} />
										<strong>{result.foundId}</strong>
									</Styles.FoundId>
								) : (
									<Styles.ResultDescription>이메일 주소를 다시 확인한 뒤 재시도해주세요.</Styles.ResultDescription>
								)}
							</Styles.ResultBox>
							<Styles.GlassButton type="button" onClick={handleRetry}>
								다시 찾기
							</Styles.GlassButton>
							<Styles.LoginLink as={Link} to="/login">로그인으로 돌아가기</Styles.LoginLink>
						</Styles.ResultArea>
					) : (
						<Styles.Form id="findIdForm" onSubmit={handleSubmit} noValidate>
							<Styles.Field>
								<label htmlFor="emailInput">이메일 주소</label>
								<Styles.InputGroup>
									<Styles.Icon aria-hidden="true">
										<Mail size={21} strokeWidth={2} />
									</Styles.Icon>
									<Styles.Input
										id="emailInput"
										name="email"
										type="email"
										placeholder="example@festapick.com"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (emailError) {
												setEmailError('');
											}
											if (status.visible) {
												setStatus(initialStatus);
											}
										}}
										aria-invalid={emailError ? 'true' : 'false'}
										aria-describedby={emailError ? 'emailError' : undefined}
										className={emailError ? 'error' : ''}
										disabled={isSubmitting}
										required
									/>
								</Styles.InputGroup>
								<Styles.ErrorMessage id="emailError" className={emailError ? 'visible' : ''}>
									{emailError}
								</Styles.ErrorMessage>
							</Styles.Field>

							<Styles.StatusMessage
								id="statusMessage"
								className={`${status.visible ? 'visible' : ''} ${status.type}`}
								role={status.type === 'error' ? 'alert' : 'status'}
								aria-live="polite"
							>
								{status.message}
							</Styles.StatusMessage>

							<Styles.NeonButton type="submit" disabled={isSubmitting}>
								{isSubmitting ? '아이디 확인 중' : '아이디 찾기'}
							</Styles.NeonButton>
							<Styles.LoginLink as={Link} to="/login">로그인으로 돌아가기</Styles.LoginLink>
						</Styles.Form>
					)}
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default FindIdPage;
