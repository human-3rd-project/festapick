import React, { useState } from 'react';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Styles from './ResetPasswordPageCss';

const initialStatus = {
	visible: false,
	type: '',
	message: '',
};

const ResetPasswordPage = () => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [status, setStatus] = useState(initialStatus);
	const [isCompleted, setIsCompleted] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();

		const normalizedPassword = password.trim();
		const normalizedConfirmPassword = confirmPassword.trim();
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

		// TODO: 백엔드 연결 후 reset token이 없거나 만료된 경우 유효하지 않은 링크로 처리합니다.

		if (!passwordRegex.test(normalizedPassword)) {
			setPasswordError('영문과 숫자를 포함해 8자 이상 입력해 주세요.');
			setConfirmPasswordError('');
			setStatus(initialStatus);
			return;
		}

		if (normalizedPassword !== normalizedConfirmPassword) {
			setPasswordError('');
			setConfirmPasswordError('새 비밀번호가 일치하지 않습니다.');
			setStatus(initialStatus);
			return;
		}

		setPasswordError('');
		setConfirmPasswordError('');
		setStatus(initialStatus);

		// TODO: reset token과 normalizedPassword를 사용해 비밀번호 재설정 API를 연결합니다.
		// TODO: API 실패 시 응답 사유에 맞춰 status.type='error'와 status.message를 설정합니다.
		setIsCompleted(true);
	};

	return (
		<Styles.Page>
			<Styles.BackgroundPhoto aria-hidden="true">
				<img
					alt=""
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIj15k-ljVdcr_iF9_MAF0i6UfyVlHxlbV0FGb-qfnh-wnhNY4Afn8-L6Hs5znPNOBHGiJ6V5WGdrx55qqUOFLC29ZRK3tR9dy4LXulOkRQWIPgUE3Yt9lVRu_-nPDoy21dfA3DdYtIu9auk5AQp6x_lh_Oci6P9dyWclv2GyjcupQvflq5WZhe0x-zMJOfP2MKbcHLP3RjNqmfADYfCnASQ_D_9FXRWJZCiV7vefM8wf4woe_de4tfVvY-HG770NHuR66QpoLJC1d"
				/>
			</Styles.BackgroundPhoto>
			<Styles.BackgroundOverlay />

			<Styles.Main>
				<Styles.Panel>
					<Styles.Header>
						<h2>비밀번호 재설정</h2>
						<p>새 비밀번호를 설정해 주세요.</p>
					</Styles.Header>

					{isCompleted ? (
						<Styles.ResultArea>
							<Styles.ResultBox>
								<Styles.ResultIcon aria-hidden="true">
									<CheckCircle size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultTitle>비밀번호가 변경되었습니다.</Styles.ResultTitle>
								<Styles.ResultDescription>
									새 비밀번호로 로그인하여 Festa Pick을 계속 이용해 주세요.
								</Styles.ResultDescription>
							</Styles.ResultBox>
							<Styles.GlassLink as={Link} to="/login">로그인으로 돌아가기</Styles.GlassLink>
						</Styles.ResultArea>
					) : (
						<Styles.Form onSubmit={handleSubmit} noValidate>
							<Styles.Field>
								<label htmlFor="passwordInput">새 비밀번호</label>
								<Styles.InputGroup>
									<Styles.Icon aria-hidden="true">
										<Lock size={21} strokeWidth={2} />
									</Styles.Icon>
									<Styles.Input
										id="passwordInput"
										name="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="영문, 숫자 포함 8자 이상"
										value={password}
										onChange={(e) => {
											setPassword(e.target.value);
											if (passwordError) {
												setPasswordError('');
											}
											if (status.visible) {
												setStatus(initialStatus);
											}
										}}
										aria-invalid={passwordError ? 'true' : 'false'}
										aria-describedby={passwordError ? 'passwordError' : undefined}
										className={passwordError ? 'error' : ''}
										required
									/>
									<Styles.VisibilityButton
										type="button"
										aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
										onClick={() => setShowPassword((value) => !value)}
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</Styles.VisibilityButton>
								</Styles.InputGroup>
								<Styles.ErrorMessage id="passwordError" className={passwordError ? 'visible' : ''}>
									{passwordError}
								</Styles.ErrorMessage>
							</Styles.Field>

							<Styles.Field>
								<label htmlFor="confirmPasswordInput">새 비밀번호 확인</label>
								<Styles.InputGroup>
									<Styles.Icon aria-hidden="true">
										<Lock size={21} strokeWidth={2} />
									</Styles.Icon>
									<Styles.Input
										id="confirmPasswordInput"
										name="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder="새 비밀번호를 한 번 더 입력"
										value={confirmPassword}
										onChange={(e) => {
											setConfirmPassword(e.target.value);
											if (confirmPasswordError) {
												setConfirmPasswordError('');
											}
											if (status.visible) {
												setStatus(initialStatus);
											}
										}}
										aria-invalid={confirmPasswordError ? 'true' : 'false'}
										aria-describedby={confirmPasswordError ? 'confirmPasswordError' : undefined}
										className={confirmPasswordError ? 'error' : ''}
										required
									/>
									<Styles.VisibilityButton
										type="button"
										aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
										onClick={() => setShowConfirmPassword((value) => !value)}
									>
										{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</Styles.VisibilityButton>
								</Styles.InputGroup>
								<Styles.ErrorMessage
									id="confirmPasswordError"
									className={confirmPasswordError ? 'visible' : ''}
								>
									{confirmPasswordError}
								</Styles.ErrorMessage>
							</Styles.Field>

							<Styles.StatusMessage
								className={`${status.visible ? 'visible' : ''} ${status.type}`}
								role={status.visible ? 'alert' : undefined}
							>
								{status.message}
							</Styles.StatusMessage>

							<Styles.NeonButton type="submit">비밀번호 변경하기</Styles.NeonButton>
						</Styles.Form>
					)}
				</Styles.Panel>
			</Styles.Main>
		</Styles.Page>
	);
};

export default ResetPasswordPage;
