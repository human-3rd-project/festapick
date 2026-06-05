import React, { useState } from 'react';
import { CheckCircle, Mail, User } from 'lucide-react';
import Styles from './FindPasswordPageCss';

const initialStatus = {
	visible: false,
	type: '',
	message: '',
};

const TEST_SUCCESS_USER_ID = 'test';
const TEST_SUCCESS_EMAIL = 'test@test.com';

const FindPasswordPage = () => {
	const [userId, setUserId] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [status, setStatus] = useState(initialStatus);
	const [result, setResult] = useState({ visible: false, type: '' });

	const handleSubmit = (e) => {
		e.preventDefault();

		const normalizedUserId = userId.trim();
		const normalizedEmail = email.trim().toLowerCase();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!normalizedUserId) {
			window.alert('아이디를 확인해 주세요.');
			setStatus({
				visible: true,
				type: 'error',
				message: '아이디를 입력해 주세요.',
			});
			return;
		}

		if (!emailRegex.test(normalizedEmail)) {
			window.alert('이메일 주소를 확인해 주세요.');
			setEmailError('유효한 이메일 주소를 입력해 주세요.');
			setStatus(initialStatus);
			return;
		}

		setEmailError('');
		setStatus(initialStatus);

		// TODO: 백엔드 비밀번호 재설정 링크 발송 API 연결 후 응답 결과에 따라 성공/실패 처리를 분기합니다.
		if (normalizedUserId !== TEST_SUCCESS_USER_ID || normalizedEmail !== TEST_SUCCESS_EMAIL) {
			window.alert('아이디 또는 이메일 주소를 확인해 주세요.');
			return;
		}

		setResult({ visible: true, type: 'success' });
	};

	const handleRetry = () => {
		setEmailError('');
		setStatus(initialStatus);
		setResult({ visible: false, type: '' });
	};

	const handleResend = () => {
		// TODO: 백엔드 인증번호 재발송 API 연결 후 성공 응답 시 alert를 호출합니다.
		window.alert('인증번호가 발송되었습니다.');
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
				<Styles.GlassContainer>
					<Styles.Header>
						<h2>비밀번호 찾기</h2>
						<p>이메일로 비밀번호 재설정 링크를 받아보세요.</p>
					</Styles.Header>

					{result.visible ? (
						<Styles.ResultArea id="resultArea" className={result.type}>
							<Styles.ResultBox className={result.type}>
								<Styles.ResultIcon className={result.type} aria-hidden="true">
									<CheckCircle size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultLabel>Success</Styles.ResultLabel>
								<Styles.ResultTitle>비밀번호 재설정 링크가 발송되었습니다.</Styles.ResultTitle>
								<Styles.ResultDescription>
									이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정해 주세요.
								</Styles.ResultDescription>
								<Styles.ResultNote>
									링크를 클릭하면 비밀번호를 재설정할 수 있는 페이지로 이동합니다.
								</Styles.ResultNote>
							</Styles.ResultBox>

							<Styles.LoginLink className="result-link" href="/login">
								로그인으로 돌아가기
							</Styles.LoginLink>
							<Styles.TextButton type="button" onClick={handleResend}>
								이메일 메시지 다시 보내기
							</Styles.TextButton>
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
											placeholder="아이디를 입력해 주세요"
											value={userId}
											onChange={(e) => {
												setUserId(e.target.value);
												if (status.visible) {
													setStatus(initialStatus);
												}
											}}
											required
										/>
									</Styles.InputGroup>
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
											}}
											aria-invalid={emailError ? 'true' : 'false'}
											aria-describedby={emailError ? 'emailError' : undefined}
											className={emailError ? 'error' : ''}
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
								role={status.visible ? 'alert' : undefined}
							>
								{status.message}
							</Styles.StatusMessage>

							<Styles.NeonButton id="submitBtn" type="submit">
								비밀번호 재설정 링크 받기
							</Styles.NeonButton>
							<Styles.LoginLink href="/login">로그인으로 돌아가기</Styles.LoginLink>
						</Styles.Form>
					)}
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default FindPasswordPage;
