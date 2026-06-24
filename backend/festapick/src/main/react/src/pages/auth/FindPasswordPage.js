import React, { useState } from 'react';
import { CheckCircle, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AxiosApi from '../../api/AxiosApi';
import Styles from './FindPasswordPageCss';

// 입력 폼의 진행/오류 메시지 상태
const initialStatus = {
	visible: false,
	type: '',
	message: '',
};

// 메일 발송 성공 결과 화면 상태
const initialResult = {
	visible: false,
	type: '',
	title: '',
	message: '',
	note: '',
};

const FindPasswordPage = () => {
	// 사용자 입력값
	const [userId, setUserId] = useState('');
	const [email, setEmail] = useState('');

	// 필드별 검증 메시지
	const [userIdError, setUserIdError] = useState('');
	const [emailError, setEmailError] = useState('');

	// 요청 상태와 성공 결과
	const [status, setStatus] = useState(initialStatus);
	const [result, setResult] = useState(initialResult);

	// 중복 요청 방지 및 로딩 표시
	const [isSubmitting, setIsSubmitting] = useState(false);

	const setStatusMessage = (type, message) => {
		// 메시지가 있을 때만 상태 영역을 표시합니다.
		setStatus({ visible: Boolean(message), type, message });
	};

	const getApiMessage = (error, fallbackMessage) => {
		// 서버 오류 메시지가 없으면 기본 문구를 사용합니다.
		const serverMessage = error?.response?.data?.message;

		return serverMessage || fallbackMessage;
	};

	const validateForm = () => {
		// 입력값을 정리한 뒤 필수값과 이메일 형식을 검사합니다.
		const normalizedUserId = userId.trim();
		const normalizedEmail = email.trim().toLowerCase();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		const errors = {
			userId: '',
			email: '',
		};

		if (!normalizedUserId) {
			errors.userId = '아이디를 입력해 주세요.';
		}

		if (!normalizedEmail) {
			errors.email = '이메일 주소를 입력해 주세요.';
		} else if (!emailRegex.test(normalizedEmail)) {
			errors.email = '유효한 이메일 주소를 입력해 주세요.';
		}

		return {
			isValid: !errors.userId && !errors.email,
			// 백엔드 DTO 필드명에 맞춘 요청 데이터
			values: {
				loginId: normalizedUserId,
				email: normalizedEmail,
			},
			errors,
		};
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// 요청 중에는 다시 제출하지 않습니다.
		if (isSubmitting) {
			return;
		}

		const validation = validateForm();

		// 검증 실패 시 API를 호출하지 않고 오류를 표시합니다.
		if (!validation.isValid) {
			setUserIdError(validation.errors.userId);
			setEmailError(validation.errors.email);

			setStatus(initialStatus);
			setResult(initialResult);
			return;
		}

		setUserIdError('');
		setEmailError('');
		setResult(initialResult);

		setIsSubmitting(true);
		setStatusMessage('success', '입력하신 정보로 비밀번호 재설정 메일을 발송하고 있습니다.');

		try {
			// 비밀번호 재설정 메일 발송 API 호출
			const response = await AxiosApi.requestPasswordReset(validation.values);
			const responseData = response.data;

			// HTTP 요청은 성공했지만 응답 결과가 실패인 경우를 처리합니다.
			if (responseData?.success === false) {
				setStatusMessage(
					'error',
					responseData.message || '아이디와 이메일 주소를 다시 확인해 주세요.',
				);
				return;
			}

			setStatus(initialStatus);
			setResult({
				visible: true,
				type: 'success',
				title: '비밀번호 재설정 링크가 발송되었습니다.',
				message: responseData?.message || '이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해 주세요.',
				note: '메일이 보이지 않으면 스팸함을 확인하거나 잠시 후 다시 요청해 주세요.',
			});
		} catch (error) {
			// 서버 또는 네트워크 오류 메시지를 입력 폼에 표시합니다.
			setStatusMessage(
				'error',
				getApiMessage(error, '아이디와 이메일 주소를 다시 확인해 주세요.'),
			);
			setResult(initialResult);
		} finally {
			// 요청이 끝나면 입력과 버튼을 다시 활성화합니다.
			setIsSubmitting(false);
		}
	};

	const handleRetry = () => {
		// 성공 화면을 닫고 입력 폼을 초기화합니다.
		setUserId('');
		setEmail('');
		setUserIdError('');
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
				<Styles.GlassContainer className={result.visible ? 'result-visible' : ''}>
					<Styles.Header>
						<h2>{result.visible ? '메일 발송 완료' : '비밀번호 찾기'}</h2>
						<p>
							{result.visible
								? '비밀번호 재설정 안내를 확인해 주세요.'
								: '가입한 아이디와 이메일로 비밀번호 재설정 링크를 받아보세요.'}
						</p>
					</Styles.Header>

					{/* 메일 발송 성공 여부에 따라 결과 화면과 입력 폼을 전환합니다. */}
					{result.visible ? (
						<Styles.ResultArea id="resultArea" className={result.type}>
							<Styles.ResultBox className={result.type}>
								<Styles.ResultIcon className={result.type} aria-hidden="true">
									<CheckCircle size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultLabel>Success</Styles.ResultLabel>
								<Styles.ResultTitle>{result.title}</Styles.ResultTitle>
								<Styles.ResultDescription>{result.message}</Styles.ResultDescription>
								<Styles.ResultNote>{result.note}</Styles.ResultNote>
							</Styles.ResultBox>

							<Styles.ResultActions>
								<Styles.LoginLink as={Link} to="/login" className="result-link">
									로그인으로 돌아가기
								</Styles.LoginLink>
								<Styles.TextButton type="button" onClick={handleRetry}>
									다시 입력하기
								</Styles.TextButton>
							</Styles.ResultActions>
						</Styles.ResultArea>
					) : (
						<Styles.Form id="findPasswordForm" onSubmit={handleSubmit} noValidate>
							<Styles.Fields>
								<Styles.Field>
									<label htmlFor="userIdInput">아이디</label>
									<Styles.InputGroup>
										<Styles.Icon aria-hidden="true">
											<User size={21} strokeWidth={2} />
										</Styles.Icon>
										<Styles.Input
											id="userIdInput"
											name="userId"
											type="text"
											placeholder="아이디를 입력해 주세요."
											value={userId}
											onChange={(e) => {
												setUserId(e.target.value);

												if (userIdError) {
													setUserIdError('');
												}

												if (status.visible) {
													setStatus(initialStatus);
												}
											}}
											aria-invalid={userIdError ? 'true' : 'false'}
											aria-describedby={userIdError ? 'userIdError' : undefined}
											className={userIdError ? 'error' : ''}
											disabled={isSubmitting}
											required
										/>
									</Styles.InputGroup>
									<Styles.ErrorMessage id="userIdError" className={userIdError ? 'visible' : ''}>
										{userIdError}
									</Styles.ErrorMessage>
								</Styles.Field>

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
							</Styles.Fields>

							<Styles.StatusMessage
								id="statusMessage"
								className={`${status.visible ? 'visible' : ''} ${status.type}`}
								role={status.type === 'error' ? 'alert' : 'status'}
								aria-live="polite"
							>
								{status.message}
							</Styles.StatusMessage>

							<Styles.NeonButton id="submitBtn" type="submit" disabled={isSubmitting}>
								{isSubmitting ? '메일 발송 중...' : '비밀번호 재설정 링크 받기'}
							</Styles.NeonButton>
							<Styles.LoginLink as={Link} to="/login">
								로그인으로 돌아가기
							</Styles.LoginLink>
						</Styles.Form>
					)}
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default FindPasswordPage;
