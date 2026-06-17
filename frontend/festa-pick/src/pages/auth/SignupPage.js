import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosApi from '../../api/AxiosApi';
import Styles from './SignupPageCss';

const EMAIL_VERIFICATION_SECONDS = 5 * 60;

/*
 * 회원가입 페이지 전체 흐름
 * 1. 사용자가 각 입력값을 작성합니다.
 * 2. 아이디와 닉네임은 각각 중복 확인 API를 먼저 통과해야 합니다.
 * 3. 이메일은 중복 확인 후 인증코드 발송 API를 호출합니다.
 * 4. 사용자가 받은 인증코드를 입력하면 verifyEmail API로 서버 인증 상태를 true로 만듭니다.
 * 5. 최종 회원가입 시 백엔드는 "이미 이메일 인증이 완료된 주소인지"를 다시 확인합니다.
 * 6. 따라서 프론트는 UX를 위해 미리 막고, 백엔드는 최종 안전장치 역할을 합니다.
 */
const SignupPage = () => {
	const navigate = useNavigate();

	// 각 입력칸 아래에 보여줄 메시지를 필드명 기준으로 저장합니다.
	// 예: messages.userId = { type: 'error', text: '...' }
	const [messages, setMessages] = useState({});

	// 중복 확인과 이메일 인증을 완료한 값을 저장합니다. 입력값이 바뀌면 다시 확인해야 합니다.
	// 예: checkedFields.userId가 'abc123'인데 현재 입력값이 'abc1234'라면 확인이 무효입니다.
	const [checkedFields, setCheckedFields] = useState({
		userId: '',
		nickname: '',
		email: '',
	});

	// 백엔드는 인증 성공 여부를 서버에 저장하고, 프론트는 현재 이메일이 인증된 값인지 추적합니다.
	// 사용자가 이메일을 수정하면 verifiedEmail을 비워서 이전 인증 결과를 재사용하지 못하게 합니다.
	const [verifiedEmail, setVerifiedEmail] = useState('');

	// 인증코드는 백엔드에서 5분 후 만료되므로, 프론트 타이머도 같은 기준으로 보여줍니다.
	const [verificationExpiresAt, setVerificationExpiresAt] = useState(null);
	const [remainingSeconds, setRemainingSeconds] = useState(0);

	// 버튼별 로딩 상태를 분리해서 같은 API가 중복 호출되지 않도록 막습니다.
	const [loading, setLoading] = useState({
		userId: false,
		nickname: false,
		emailSend: false,
		emailVerify: false,
		submit: false,
	});

	const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const isValidUserId = (userId) => /^[a-zA-Z0-9_]{4,20}$/.test(userId);
	const isValidNickname = (nickname) => /^[가-힣a-zA-Z0-9]{2,12}$/.test(nickname);
	const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,20}$/.test(password);
	const isValidVerificationCode = (code) => /^\d{6}$/.test(code);

	// 인증 요청 시점에 계산한 만료 시간을 기준으로 화면 타이머를 갱신합니다.
	useEffect(() => {
		if (!verificationExpiresAt) {
			setRemainingSeconds(0);
			return undefined;
		}

		const tick = () => {
			setRemainingSeconds(Math.max(0, Math.ceil((verificationExpiresAt - Date.now()) / 1000)));
		};

		tick();
		const timerId = window.setInterval(tick, 1000);

		return () => window.clearInterval(timerId);
	}, [verificationExpiresAt]);

	// 시간이 끝나면 기존 인증코드 입력을 막고 다시 요청하도록 안내합니다.
	useEffect(() => {
		if (!verificationExpiresAt || remainingSeconds !== 0 || verifiedEmail) {
			return;
		}

		setVerificationExpiresAt(null);
		setMessages((prevMessages) => ({
			...prevMessages,
			verificationCode: { type: 'error', text: '인증 시간이 만료되었습니다. 인증을 다시 요청해 주세요.' },
		}));
	}, [remainingSeconds, verificationExpiresAt, verifiedEmail]);

	// 백엔드 메시지가 인코딩 문제로 깨져 오면 프론트의 기본 문구를 보여줍니다.
	const getApiMessage = (error, fallbackMessage) => {
		const serverMessage = error?.response?.data?.message;
		return serverMessage && !serverMessage.includes('�') && !serverMessage.includes('?') ? serverMessage : fallbackMessage;
	};

	// 화면 입력 규칙을 먼저 검증하고, 통과한 값만 API 요청으로 넘깁니다.
	const getFieldMessage = (fieldName, value, form) => {
		if (fieldName === 'userId') {
			// 백엔드에서도 빈 값은 거절하지만, 프론트에서 먼저 알려주면 불필요한 API 호출을 줄일 수 있습니다.
			if (!value) return { type: 'error', text: '아이디를 입력해 주세요.' };
			if (!isValidUserId(value)) return { type: 'error', text: '아이디는 영문, 숫자, 밑줄(_) 4~20자로 입력해 주세요.' };
		}

		if (fieldName === 'nickname') {
			// 닉네임 중복 확인 전에 최소 형식을 먼저 맞춥니다.
			if (!value) return { type: 'error', text: '닉네임을 입력해 주세요.' };
			if (!isValidNickname(value)) return { type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' };
		}

		if (fieldName === 'email') {
			// 이메일 인증 API는 이메일 형식이 맞는 주소만 의미가 있으므로 여기서 1차 차단합니다.
			if (!value) return { type: 'error', text: '이메일을 입력해 주세요.' };
			if (!isValidEmail(value)) return { type: 'error', text: '이메일 형식에 맞게 입력해 주세요.' };
		}

		if (fieldName === 'password') {
			// 서버는 NotBlank만 보지만, 화면에서는 서비스 정책에 맞춰 더 강한 비밀번호 규칙을 안내합니다.
			if (!value) return { type: 'error', text: '비밀번호를 입력해 주세요.' };
			if (!isValidPassword(value)) return { type: 'error', text: '비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로 입력해 주세요.' };
		}

		if (fieldName === 'passwordConfirm') {
			const password = form.password?.value || '';

			// 비밀번호 확인은 백엔드 DTO에 없는 화면 전용 필드라 프론트에서만 검사합니다.
			if (!value) return { type: 'error', text: '비밀번호를 다시 입력해 주세요.' };
			if (password && value !== password) return { type: 'error', text: '비밀번호가 일치하지 않습니다.' };
			if (password && value === password) return { type: 'success', text: '비밀번호가 일치합니다.' };
		}

		if (fieldName === 'verificationCode') {
			// 인증코드는 백엔드 생성 규칙과 맞춰 숫자 6자리만 허용합니다.
			if (!value) return { type: 'error', text: '인증코드를 입력해 주세요.' };
			if (!isValidVerificationCode(value)) return { type: 'error', text: '인증코드는 숫자 6자리로 입력해 주세요.' };
		}

		return null;
	};

	const setFieldMessage = (fieldName, message) => {
		setMessages((prevMessages) => {
			const nextMessages = { ...prevMessages };

			if (message) {
				nextMessages[fieldName] = message;
			} else {
				delete nextMessages[fieldName];
			}

			return nextMessages;
		});
	};

	// 비밀번호는 공백도 문자로 취급하고, 나머지 필드는 앞뒤 공백을 제거합니다.
	const getNormalizedValue = (fieldName, value) => {
		if (fieldName === 'password' || fieldName === 'passwordConfirm') {
			return value;
		}

		return value.trim();
	};

	const handleInputChange = (fieldName, e) => {
		const value = getNormalizedValue(fieldName, e.currentTarget.value);

		// 사용자가 다시 입력하면 이전 메시지와 연관된 확인 상태를 무효화합니다.
		setMessages((prevMessages) => {
			const nextMessages = { ...prevMessages };
			delete nextMessages[fieldName];

			if (fieldName === 'password') {
				const form = e.currentTarget.form;
				const passwordConfirm = form.passwordConfirm?.value || '';

				if (passwordConfirm) {
					nextMessages.passwordConfirm = getFieldMessage('passwordConfirm', passwordConfirm, form);
				}
			}

			if (fieldName === 'email') {
				delete nextMessages.verificationCode;
			}

			return nextMessages;
		});

		if (fieldName === 'userId' || fieldName === 'nickname') {
			setCheckedFields((prevCheckedFields) => ({
				...prevCheckedFields,
				[fieldName]: prevCheckedFields[fieldName] === value ? prevCheckedFields[fieldName] : '',
			}));
		}

		if (fieldName === 'email') {
			setCheckedFields((prevCheckedFields) => ({
				...prevCheckedFields,
				email: prevCheckedFields.email === value ? prevCheckedFields.email : '',
			}));

			if (verifiedEmail && verifiedEmail !== value) {
				setVerifiedEmail('');
			}

			if (verificationExpiresAt) {
				setVerificationExpiresAt(null);
			}
		}
	};

	const handleFieldBlur = (fieldName, e) => {
		const form = e.currentTarget.form;
		const value = getNormalizedValue(fieldName, e.currentTarget.value);
		const message = getFieldMessage(fieldName, value, form);

		setMessages((prevMessages) => {
			const nextMessages = { ...prevMessages };

			if (message) {
				nextMessages[fieldName] = message;
			} else {
				delete nextMessages[fieldName];
			}

			if (fieldName === 'password') {
				const passwordConfirm = form.passwordConfirm?.value || '';
				const passwordConfirmMessage = getFieldMessage('passwordConfirm', passwordConfirm, form);

				if (passwordConfirm || prevMessages.passwordConfirm) {
					if (passwordConfirmMessage) {
						nextMessages.passwordConfirm = passwordConfirmMessage;
					} else {
						delete nextMessages.passwordConfirm;
					}
				}
			}

			return nextMessages;
		});
	};

	// 아이디/닉네임 중복 확인 API는 data=true일 때 이미 존재한다는 뜻입니다.
	const handleCheck = async (fieldName, label, e) => {
		const form = e.currentTarget.form;
		const value = form[fieldName]?.value.trim() || '';
		const message = getFieldMessage(fieldName, value, form);

		if (message) {
			setFieldMessage(fieldName, message);
			return;
		}

		const checkApi = fieldName === 'userId' ? AxiosApi.checkLoginId : AxiosApi.checkNickname;

		setLoading((prevLoading) => ({ ...prevLoading, [fieldName]: true }));

		try {
			const response = await checkApi(value);
			const isDuplicated = response.data?.data === true;

			// 요청을 보낸 뒤 사용자가 값을 바꿨다면, 늦게 도착한 응답을 현재 입력값에 적용하지 않습니다.
			if (form[fieldName]?.value.trim() !== value) {
				return;
			}

			if (isDuplicated) {
				// 중복이면 "확인 완료 값"을 비워서 최종 제출 단계에서도 막히게 합니다.
				setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, [fieldName]: '' }));
				setFieldMessage(fieldName, { type: 'error', text: `이미 사용 중인 ${label}입니다.` });
				return;
			}

			// 사용 가능한 값이면 현재 값을 확인 완료 값으로 저장합니다.
			setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, [fieldName]: value }));
			setFieldMessage(fieldName, { type: 'success', text: `사용 가능한 ${label}입니다.` });
		} catch (error) {
			// 네트워크 오류나 서버 오류가 있으면 확인 완료로 볼 수 없으므로 상태를 비웁니다.
			setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, [fieldName]: '' }));
			setFieldMessage(fieldName, { type: 'error', text: getApiMessage(error, `${label} 중복 확인에 실패했습니다.`) });
		} finally {
			setLoading((prevLoading) => ({ ...prevLoading, [fieldName]: false }));
		}
	};

	// 이메일은 중복 확인을 먼저 통과한 뒤 인증코드 발송 API를 호출합니다.
	const handleEmailVerification = async (e) => {
		const form = e.currentTarget.form;
		const email = form.email?.value.trim() || '';
		const emailMessage = getFieldMessage('email', email, form);

		if (emailMessage) {
			setFieldMessage('email', emailMessage);
			return;
		}

		setLoading((prevLoading) => ({ ...prevLoading, emailSend: true }));

		try {
			// 이메일 인증 메일을 보내기 전에, 같은 이메일로 가입한 계정이 있는지 먼저 확인합니다.
			const duplicateResponse = await AxiosApi.checkEmail(email);
			const isDuplicated = duplicateResponse.data?.data === true;

			// 중복 확인 응답이 돌아오는 동안 이메일을 바꾼 경우, 이전 이메일 결과를 버립니다.
			if (form.email?.value.trim() !== email) {
				return;
			}

			if (isDuplicated) {
				// 이미 가입된 이메일이면 인증 절차 자체를 시작하지 않습니다.
				setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, email: '' }));
				setVerifiedEmail('');
				setVerificationExpiresAt(null);
				setFieldMessage('email', { type: 'error', text: '이미 사용 중인 이메일입니다.' });
				return;
			}

			// 백엔드가 인증코드를 생성하고 메일을 발송합니다.
			await AxiosApi.sendEmailVerification(email);

			// 메일 발송 응답이 늦게 왔는데 입력값이 바뀌었다면 타이머를 시작하지 않습니다.
			if (form.email?.value.trim() !== email) {
				return;
			}

			// 인증 요청에 성공한 이메일을 저장하고, 이 이메일에 대해서만 인증코드 확인을 허용합니다.
			setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, email }));
			setVerifiedEmail('');
			setVerificationExpiresAt(Date.now() + EMAIL_VERIFICATION_SECONDS * 1000);
			setFieldMessage('email', { type: 'success', text: '인증코드를 발송했습니다. 메일함을 확인해 주세요.' });
			setFieldMessage('verificationCode', { type: 'success', text: '메일로 받은 6자리 인증코드를 입력해 주세요.' });
		} catch (error) {
			// 인증 메일 발송에 실패하면 이전 인증 상태와 타이머를 모두 초기화합니다.
			setCheckedFields((prevCheckedFields) => ({ ...prevCheckedFields, email: '' }));
			setVerifiedEmail('');
			setVerificationExpiresAt(null);
			setFieldMessage('email', { type: 'error', text: getApiMessage(error, '인증코드 발송에 실패했습니다.') });
		} finally {
			setLoading((prevLoading) => ({ ...prevLoading, emailSend: false }));
		}
	};

	// 인증코드는 백엔드에서 email + verificationCode 조합으로 최종 검증합니다.
	const handleVerificationCodeCheck = async (e) => {
		const form = e.currentTarget.form;
		const email = form.email?.value.trim() || '';
		const verificationCode = form.verificationCode?.value.trim() || '';
		const emailMessage = getFieldMessage('email', email, form);
		const codeMessage = getFieldMessage('verificationCode', verificationCode, form);

		if (emailMessage) {
			setFieldMessage('email', emailMessage);
			return;
		}

		if (codeMessage) {
			setFieldMessage('verificationCode', codeMessage);
			return;
		}

		if (checkedFields.email !== email) {
			// 인증 요청을 보낸 이메일과 현재 입력 이메일이 다르면 같은 코드로 검증할 수 없습니다.
			setFieldMessage('verificationCode', { type: 'error', text: '현재 이메일로 인증을 먼저 요청해 주세요.' });
			return;
		}

		if (!verificationExpiresAt || remainingSeconds <= 0) {
			// 프론트 타이머가 만료된 경우 백엔드 코드도 만료됐다고 보고 재요청을 유도합니다.
			setFieldMessage('verificationCode', { type: 'error', text: '인증 시간이 만료되었습니다. 인증을 다시 요청해 주세요.' });
			return;
		}

		setLoading((prevLoading) => ({ ...prevLoading, emailVerify: true }));

		try {
			// 성공하면 백엔드 EmailVerifications 테이블의 verified 값이 true로 바뀝니다.
			await AxiosApi.verifyEmail({ email, verificationCode });

			// 확인 요청 중 이메일이나 코드가 바뀌었다면 이전 응답을 화면에 반영하지 않습니다.
			if (form.email?.value.trim() !== email || form.verificationCode?.value.trim() !== verificationCode) {
				return;
			}

			// 회원가입 제출 때 현재 이메일이 인증 완료된 이메일인지 비교하기 위해 저장합니다.
			setVerifiedEmail(email);
			setVerificationExpiresAt(null);
			setFieldMessage('verificationCode', { type: 'success', text: '이메일 인증이 완료되었습니다.' });
		} catch (error) {
			// 인증 실패 시에는 회원가입 제출을 막기 위해 verifiedEmail을 비웁니다.
			setVerifiedEmail('');
			setFieldMessage('verificationCode', { type: 'error', text: getApiMessage(error, '인증코드가 일치하지 않습니다.') });
		} finally {
			setLoading((prevLoading) => ({ ...prevLoading, emailVerify: false }));
		}
	};

	// 최종 제출 전 형식, 중복 확인, 이메일 인증, 약관 동의를 한 번에 검사합니다.
	const validateSubmit = (form) => {
		const userId = form.userId?.value.trim() || '';
		const nickname = form.nickname?.value.trim() || '';
		const email = form.email?.value.trim() || '';
		const verificationCode = form.verificationCode?.value.trim() || '';
		const password = form.password?.value || '';
		const passwordConfirm = form.passwordConfirm?.value || '';
		const terms = form.terms?.checked;
		const validationMessages = {};

		const fieldMessages = {
			userId: getFieldMessage('userId', userId, form),
			nickname: getFieldMessage('nickname', nickname, form),
			email: getFieldMessage('email', email, form),
			verificationCode: getFieldMessage('verificationCode', verificationCode, form),
			password: getFieldMessage('password', password, form),
			passwordConfirm: getFieldMessage('passwordConfirm', passwordConfirm, form),
		};

		// 각 필드의 기본 형식 오류를 validationMessages 하나로 모아 한 번에 화면에 반영합니다.
		Object.entries(fieldMessages).forEach(([fieldName, message]) => {
			if (message) {
				validationMessages[fieldName] = message;
			}
		});

		if (!validationMessages.userId && checkedFields.userId !== userId) {
			// 형식이 맞아도 중복 확인을 누르지 않았거나, 확인 후 값이 바뀌었으면 제출을 막습니다.
			validationMessages.userId = { type: 'error', text: '아이디 중복 확인을 완료해 주세요.' };
		}

		if (!validationMessages.nickname && checkedFields.nickname !== nickname) {
			// 닉네임도 아이디와 같은 방식으로 "확인 완료 값"과 현재 값을 비교합니다.
			validationMessages.nickname = { type: 'error', text: '닉네임 중복 확인을 완료해 주세요.' };
		}

		if (!validationMessages.verificationCode && verifiedEmail !== email) {
			// 백엔드 가입 API가 이메일 인증 여부를 다시 확인하지만, 프론트에서도 먼저 안내합니다.
			validationMessages.verificationCode = { type: 'error', text: '이메일 인증을 완료해 주세요.' };
		}

		if (!terms) {
			// 약관 동의는 백엔드 DTO에는 없지만 화면에서 가입 전 필수 동작으로 처리합니다.
			validationMessages.terms = { type: 'error', text: '이용약관과 개인정보 처리방침에 동의해 주세요.' };
		}

		return {
			values: { userId, nickname, email, password },
			validationMessages,
		};
	};

	// SignupRequestDto는 loginId, email, nickname, password만 받으므로 userId를 loginId로 매핑합니다.
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (loading.submit) {
			return;
		}

		const form = e.currentTarget;
		const { values, validationMessages } = validateSubmit(form);
		const hasError = Object.values(validationMessages).some((message) => message.type === 'error');

		setMessages((prevMessages) => ({
			...prevMessages,
			...validationMessages,
		}));

		if (hasError) {
			// 필드별 메시지는 이미 화면에 표시되므로 alert는 전체 안내 용도로만 사용합니다.
			window.alert('입력하지 않았거나 확인이 필요한 항목이 있습니다.');
			return;
		}

		setLoading((prevLoading) => ({ ...prevLoading, submit: true }));

		try {
			// 화면 필드명은 userId지만, 백엔드 SignupRequestDto 필드명은 loginId입니다.
			await AxiosApi.signup({
				loginId: values.userId,
				email: values.email,
				nickname: values.nickname,
				password: values.password,
			});

			window.alert('회원가입이 완료되었습니다.');
			navigate('/login', { replace: true });
		} catch (error) {
			// 최종 가입 단계에서도 백엔드가 중복/이메일 인증 여부를 다시 검증하므로 실패할 수 있습니다.
			const fallbackMessage = '회원가입에 실패했습니다. 입력값과 이메일 인증 상태를 확인해 주세요.';
			const errorMessage = getApiMessage(error, fallbackMessage);

			window.alert(errorMessage);
			setFieldMessage('terms', { type: 'error', text: errorMessage });
		} finally {
			setLoading((prevLoading) => ({ ...prevLoading, submit: false }));
		}
	};

	const renderFieldMessage = (fieldName) => {
		const message = messages[fieldName];

		return (
			<Styles.FieldMessage className={`${message?.type || ''} ${message ? '' : 'empty'}`}>
				{message?.text || '메시지 영역'}
			</Styles.FieldMessage>
		);
	};

	// 타이머 시작 전에도 같은 폭의 05:00을 보여 레이아웃 흔들림을 줄입니다.
	const formatRemainingTime = () => {
		const seconds = verificationExpiresAt ? remainingSeconds : EMAIL_VERIFICATION_SECONDS;
		const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
		const restSeconds = String(seconds % 60).padStart(2, '0');

		return `${minutes}:${restSeconds}`;
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
					<Styles.Heading>
						<h2>회원가입</h2>
						<p>페스타픽과 함께 축제의 리듬을 느껴보세요</p>
					</Styles.Heading>

					<Styles.Form onSubmit={handleSubmit} noValidate>
						<Styles.Field>
							<label htmlFor="userId">아이디</label>
							<Styles.FieldWithButton>
								<Styles.InputGroup>
									<Styles.Input
										id="userId"
										name="userId"
										placeholder="영문, 숫자, 밑줄(_) 4~20자"
										type="text"
										aria-invalid={messages.userId?.type === 'error'}
										onChange={(e) => handleInputChange('userId', e)}
										onBlur={(e) => handleFieldBlur('userId', e)}
									/>
								</Styles.InputGroup>
								<Styles.GlassButton type="button" disabled={loading.userId} onClick={(e) => handleCheck('userId', '아이디', e)}>
									{loading.userId ? '확인 중' : '중복 확인'}
								</Styles.GlassButton>
							</Styles.FieldWithButton>
							{renderFieldMessage('userId')}
						</Styles.Field>

						<Styles.Field>
							<label htmlFor="nickname">닉네임</label>
							<Styles.FieldWithButton>
								<Styles.InputGroup>
									<Styles.Input
										id="nickname"
										name="nickname"
										placeholder="한글, 영문, 숫자 2~12자"
										type="text"
										aria-invalid={messages.nickname?.type === 'error'}
										onChange={(e) => handleInputChange('nickname', e)}
										onBlur={(e) => handleFieldBlur('nickname', e)}
									/>
								</Styles.InputGroup>
								<Styles.GlassButton type="button" disabled={loading.nickname} onClick={(e) => handleCheck('nickname', '닉네임', e)}>
									{loading.nickname ? '확인 중' : '중복 확인'}
								</Styles.GlassButton>
							</Styles.FieldWithButton>
							{renderFieldMessage('nickname')}
						</Styles.Field>

						<Styles.FieldGroup>
							<Styles.Field>
								<label htmlFor="email">이메일</label>
								<Styles.FieldWithButton>
									<Styles.InputGroup>
										<Styles.Input
											id="email"
											name="email"
											placeholder="example@festapick.com"
											type="email"
											inputMode="email"
											aria-invalid={messages.email?.type === 'error'}
											onChange={(e) => handleInputChange('email', e)}
											onBlur={(e) => handleFieldBlur('email', e)}
										/>
									</Styles.InputGroup>
									<Styles.GlassButton type="button" disabled={loading.emailSend} onClick={handleEmailVerification}>
										{loading.emailSend ? '발송 중' : '인증 요청'}
									</Styles.GlassButton>
								</Styles.FieldWithButton>
								{renderFieldMessage('email')}
							</Styles.Field>

							<Styles.Field>
								<label htmlFor="verificationCode">인증코드</label>
								<Styles.FieldWithButton>
									<Styles.InputGroup>
										<Styles.Input
											id="verificationCode"
											name="verificationCode"
											placeholder="숫자 6자리"
											type="text"
											inputMode="numeric"
											maxLength={6}
											data-has-timer="true"
											aria-invalid={messages.verificationCode?.type === 'error'}
											onChange={(e) => handleInputChange('verificationCode', e)}
											onBlur={(e) => handleFieldBlur('verificationCode', e)}
										/>
										<Styles.Timer>{formatRemainingTime()}</Styles.Timer>
									</Styles.InputGroup>
									<Styles.GlassButton type="button" disabled={loading.emailVerify} onClick={handleVerificationCodeCheck}>
										{loading.emailVerify ? '확인 중' : '확인'}
									</Styles.GlassButton>
								</Styles.FieldWithButton>
								{renderFieldMessage('verificationCode')}
							</Styles.Field>
						</Styles.FieldGroup>

						<Styles.PasswordGrid>
							<Styles.Field>
								<label htmlFor="password">비밀번호</label>
								<Styles.InputGroup>
									<Styles.Input
										id="password"
										name="password"
										placeholder="영문, 숫자, 특수문자 8~20자"
										type="password"
										aria-invalid={messages.password?.type === 'error'}
										data-no-focus-animation="true"
										onChange={(e) => handleInputChange('password', e)}
										onBlur={(e) => handleFieldBlur('password', e)}
									/>
								</Styles.InputGroup>
								{renderFieldMessage('password')}
							</Styles.Field>

							<Styles.Field>
								<label htmlFor="passwordConfirm">비밀번호 확인</label>
								<Styles.InputGroup>
									<Styles.Input
										id="passwordConfirm"
										name="passwordConfirm"
										placeholder="비밀번호를 다시 입력하세요"
										type="password"
										aria-invalid={messages.passwordConfirm?.type === 'error'}
										data-no-focus-animation="true"
										onChange={(e) => handleInputChange('passwordConfirm', e)}
										onBlur={(e) => handleFieldBlur('passwordConfirm', e)}
									/>
								</Styles.InputGroup>
								{renderFieldMessage('passwordConfirm')}
							</Styles.Field>
						</Styles.PasswordGrid>

						<Styles.Terms>
							<input
								id="terms"
								name="terms"
								type="checkbox"
								onChange={() => {
									setFieldMessage('terms', null);
								}}
							/>
							<label htmlFor="terms">
								<Link to="/">이용약관</Link>과 <Link to="/">개인정보 처리방침</Link>에 동의합니다.
							</label>
						</Styles.Terms>
						{messages.terms && <Styles.FieldMessage className={messages.terms.type}>{messages.terms.text}</Styles.FieldMessage>}

						<Styles.NeonButton type="submit" disabled={loading.submit}>
							{loading.submit ? '가입 처리 중' : '회원가입'}
						</Styles.NeonButton>
					</Styles.Form>

					<Styles.LoginPrompt>
						<p>
							이미 계정이 있으신가요? <Link to="/login">로그인하기</Link>
						</p>
					</Styles.LoginPrompt>
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default SignupPage;
