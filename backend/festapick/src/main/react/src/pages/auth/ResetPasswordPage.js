import React, { useEffect, useState } from 'react';
import { CircleAlert, CheckCircle, Eye, EyeOff, LoaderCircle, Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AxiosApi from '../../api/AxiosApi';
import Styles from './ResetPasswordPageCss';

const initialStatus = {
	visible: false,
	type: '',
	message: '',
};

const getApiMessage = (error, fallbackMessage) => {
	// GlobalExceptionHandler의 { success, message, data } 응답에서 사용자 안내 문구를 가져옵니다.
	// 네트워크 단절처럼 서버 응답이 없는 경우에는 화면의 기본 문구를 사용합니다.
	return error?.response?.data?.message || fallbackMessage;
};

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token')?.trim() || '';

	// 새 비밀번호와 확인값은 화면에서 각각 관리합니다.
	// 백엔드 PasswordResetRequestDto에는 확인값이 없으므로 두 값의 일치 여부는 프론트에서 검증합니다.
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// 필드 오류와 API 진행/실패 메시지를 분리해 사용자가 수정할 위치를 명확히 알 수 있게 합니다.
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [status, setStatus] = useState(initialStatus);

	// 메일 링크로 진입하면 토큰을 먼저 검증합니다.
	// validating 동안 폼을 노출하지 않고, invalid이면 새 링크를 요청할 수 있는 안내 화면을 보여줍니다.
	const [tokenState, setTokenState] = useState('validating');
	const [tokenMessage, setTokenMessage] = useState('비밀번호 재설정 링크를 확인하고 있습니다.');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [completionMessage, setCompletionMessage] = useState('');

	const setStatusMessage = (type, message) => {
		setStatus({ visible: Boolean(message), type, message });
	};

	useEffect(() => {
		let isActive = true;

		const validateToken = async () => {
			if (!token) {
				setTokenState('invalid');
				setTokenMessage('비밀번호 재설정 토큰이 없습니다. 이메일의 링크를 다시 확인해 주세요.');
				return;
			}

			setTokenState('validating');
			setTokenMessage('비밀번호 재설정 링크를 확인하고 있습니다.');

			try {
				// GET /auth/account/password-reset/validate?token=... 호출로
				// 토큰의 존재 여부, 30분 만료 여부, 이미 사용했는지를 서버에서 확인합니다.
				const response = await AxiosApi.validatePasswordResetToken(token);

				if (!isActive) {
					return;
				}

				if (response.data?.success === false) {
					setTokenState('invalid');
					setTokenMessage(response.data.message || '유효하지 않은 비밀번호 재설정 링크입니다.');
					return;
				}

				setTokenState('valid');
				setTokenMessage('');
			} catch (error) {
				if (!isActive) {
					return;
				}

				setTokenState('invalid');
				setTokenMessage(
					getApiMessage(error, '링크가 만료되었거나 유효하지 않습니다. 재설정 링크를 다시 요청해 주세요.'),
				);
			}
		};

		validateToken();

		// 페이지를 벗어난 뒤 완료된 요청이 더 이상 state를 변경하지 않도록 막습니다.
		return () => {
			isActive = false;
		};
	}, [token]);

	const validateForm = () => {
		// 회원가입 페이지와 동일하게 영문, 숫자, 허용 특수문자를 모두 포함한 8~20자를 적용합니다.
		// 비밀번호는 실제 값의 일부가 될 수 있는 공백을 임의로 제거하지 않고 입력값 그대로 검사합니다.
		const passwordRegex =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,20}$/;
		const errors = {
			password: '',
			confirmPassword: '',
		};

		if (!password) {
			errors.password = '새 비밀번호를 입력해 주세요.';
		} else if (!passwordRegex.test(password)) {
			errors.password = '영문, 숫자, 특수문자를 포함해 8~20자로 입력해 주세요.';
		}

		if (!confirmPassword) {
			errors.confirmPassword = '새 비밀번호를 다시 입력해 주세요.';
		} else if (password !== confirmPassword) {
			errors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
		}

		return {
			isValid: !errors.password && !errors.confirmPassword,
			errors,
		};
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// 유효한 링크가 아니거나 요청 중이면 API를 중복 호출하지 않습니다.
		if (tokenState !== 'valid' || isSubmitting) {
			return;
		}

		const validation = validateForm();

		if (!validation.isValid) {
			setPasswordError(validation.errors.password);
			setConfirmPasswordError(validation.errors.confirmPassword);
			setStatus(initialStatus);
			return;
		}

		setPasswordError('');
		setConfirmPasswordError('');
		setIsSubmitting(true);
		setStatusMessage('success', '새 비밀번호로 변경하고 있습니다.');

		try {
			// PasswordResetRequestDto 필드명에 맞춰 token과 newPassword를 전달합니다.
			const response = await AxiosApi.resetPassword({
				token,
				newPassword: password,
			});
			const responseData = response.data;

			if (responseData?.success === false) {
				setStatusMessage('error', responseData.message || '비밀번호를 변경하지 못했습니다.');
				return;
			}

			setStatus(initialStatus);
			setCompletionMessage(responseData?.message || '비밀번호 재설정이 완료되었습니다.');
			setIsCompleted(true);
		} catch (error) {
			// 제출 시점에 토큰이 만료되거나 이미 사용된 경우도 서버 메시지로 안내합니다.
			setStatusMessage(
				'error',
				getApiMessage(error, '비밀번호를 변경하지 못했습니다. 링크를 확인한 뒤 다시 시도해 주세요.'),
			);
		} finally {
			setIsSubmitting(false);
		}
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

					{tokenState === 'validating' ? (
						<Styles.ResultArea aria-live="polite">
							<Styles.ResultBox>
								<Styles.ResultIcon className="loading" aria-hidden="true">
									<LoaderCircle size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultTitle>링크 확인 중</Styles.ResultTitle>
								<Styles.ResultDescription>{tokenMessage}</Styles.ResultDescription>
							</Styles.ResultBox>
						</Styles.ResultArea>
					) : tokenState === 'invalid' ? (
						<Styles.ResultArea role="alert">
							<Styles.ResultBox>
								<Styles.ResultIcon className="error" aria-hidden="true">
									<CircleAlert size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultTitle className="error">링크를 사용할 수 없습니다.</Styles.ResultTitle>
								<Styles.ResultDescription>{tokenMessage}</Styles.ResultDescription>
							</Styles.ResultBox>
							<Styles.GlassLink as={Link} to="/find-password">
								재설정 링크 다시 받기
							</Styles.GlassLink>
						</Styles.ResultArea>
					) : isCompleted ? (
						<Styles.ResultArea>
							<Styles.ResultBox>
								<Styles.ResultIcon aria-hidden="true">
									<CheckCircle size={30} strokeWidth={1.9} />
								</Styles.ResultIcon>
								<Styles.ResultTitle>비밀번호가 변경되었습니다.</Styles.ResultTitle>
								<Styles.ResultDescription>
									{completionMessage} 새 비밀번호로 로그인해 주세요.
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
										placeholder="영문, 숫자, 특수문자 포함 8~20자"
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
										autoComplete="new-password"
										disabled={isSubmitting}
										required
									/>
									<Styles.VisibilityButton
										type="button"
										aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
										onClick={() => setShowPassword((value) => !value)}
										disabled={isSubmitting}
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
										autoComplete="new-password"
										disabled={isSubmitting}
										required
									/>
									<Styles.VisibilityButton
										type="button"
										aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
										onClick={() => setShowConfirmPassword((value) => !value)}
										disabled={isSubmitting}
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
								role={status.type === 'error' ? 'alert' : 'status'}
								aria-live="polite"
							>
								{status.message}
							</Styles.StatusMessage>

							<Styles.NeonButton type="submit" disabled={isSubmitting}>
								{isSubmitting ? '비밀번호 변경 중...' : '비밀번호 변경하기'}
							</Styles.NeonButton>
						</Styles.Form>
					)}
				</Styles.Panel>
			</Styles.Main>
		</Styles.Page>
	);
};

export default ResetPasswordPage;
