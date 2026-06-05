import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './SignupPageCss';

const SignupPage = () => {
	const navigate = useNavigate();
	const [messages, setMessages] = useState({});

	const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const isValidUserId = (userId) => /^[a-zA-Z0-9_]{4,20}$/.test(userId);
	const isValidNickname = (nickname) => /^[가-힣a-zA-Z0-9]{2,12}$/.test(nickname);
	const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,20}$/.test(password);
	const isValidVerificationCode = (code) => /^\d{6}$/.test(code);

	const getFieldMessage = (fieldName, value, form) => {
		if (fieldName === 'userId') {
			if (!value) return { type: 'error', text: '아이디를 입력해 주세요.' };
			if (!isValidUserId(value)) return { type: 'error', text: '아이디는 영문, 숫자, 밑줄(_) 4~20자로 입력해 주세요.' };
		}

		if (fieldName === 'nickname') {
			if (!value) return { type: 'error', text: '닉네임을 입력해 주세요.' };
			if (!isValidNickname(value)) return { type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' };
		}

		if (fieldName === 'email') {
			if (!value) return { type: 'error', text: '이메일을 입력해 주세요.' };
			if (!isValidEmail(value)) return { type: 'error', text: '이메일 형식에 맞게 입력해 주세요.' };
		}

		if (fieldName === 'password') {
			if (!value) return { type: 'error', text: '비밀번호를 입력해 주세요.' };
			if (!isValidPassword(value)) return { type: 'error', text: '비밀번호는 영문, 숫자, 특수문자를 포함해 8~20자로 입력해 주세요.' };
		}

		if (fieldName === 'passwordConfirm') {
			const password = form.password?.value || '';

			if (!value) return { type: 'error', text: '비밀번호를 다시 입력해 주세요.' };
			if (password && value !== password) return { type: 'error', text: '비밀번호가 일치하지 않습니다.' };
			if (password && value === password) return { type: 'success', text: '비밀번호가 일치합니다.' };
		}

		if (fieldName === 'verificationCode') {
			if (!value) return { type: 'error', text: '인증코드를 입력해 주세요.' };
			if (!isValidVerificationCode(value)) return { type: 'error', text: '인증코드는 숫자 6자리로 입력해 주세요.' };
		}

		return null;
	};

	const handleFieldBlur = (fieldName, e) => {
		const form = e.currentTarget.form;
		const value = fieldName === 'password' || fieldName === 'passwordConfirm' ? e.currentTarget.value : e.currentTarget.value.trim();
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

	const handleSubmit = (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		const userId = form.userId?.value.trim() || '';
		const nickname = form.nickname?.value.trim() || '';
		const email = form.email?.value.trim() || '';
		const verificationCode = form.verificationCode?.value.trim() || '';
		const password = form.password?.value || '';
		const passwordConfirm = form.passwordConfirm?.value || '';
		const terms = form.terms?.checked;
		const validationMessages = {};

		const userIdMessage = getFieldMessage('userId', userId, form);
		const nicknameMessage = getFieldMessage('nickname', nickname, form);
		const emailMessage = getFieldMessage('email', email, form);
		const verificationCodeMessage = getFieldMessage('verificationCode', verificationCode, form);
		const passwordMessage = getFieldMessage('password', password, form);
		const passwordConfirmMessage = getFieldMessage('passwordConfirm', passwordConfirm, form);

		if (userIdMessage) validationMessages.userId = userIdMessage;
		if (nicknameMessage) validationMessages.nickname = nicknameMessage;
		if (emailMessage) validationMessages.email = emailMessage;
		if (verificationCodeMessage) validationMessages.verificationCode = verificationCodeMessage;
		if (passwordMessage) validationMessages.password = passwordMessage;
		if (passwordConfirmMessage) validationMessages.passwordConfirm = passwordConfirmMessage;

		if (!terms) {
			validationMessages.terms = { type: 'error', text: '이용약관과 개인정보 처리방침에 동의해 주세요.' };
		}

		setMessages((prevMessages) => {
			const nextMessages = { ...prevMessages };
			const checkedFields = ['userId', 'nickname', 'email', 'verificationCode', 'password', 'passwordConfirm'];

			checkedFields.forEach((fieldName) => {
				const message = validationMessages[fieldName];

				if (message) {
					nextMessages[fieldName] = message;
					return;
				}

				if (nextMessages[fieldName]?.type === 'error') {
					delete nextMessages[fieldName];
				}
			});

			if (validationMessages.terms) {
				nextMessages.terms = validationMessages.terms;
			} else {
				delete nextMessages.terms;
			}

			return nextMessages;
		});

		if (Object.values(validationMessages).some((message) => message.type === 'error')) {
			window.alert('입력하지 않았거나 형식에 맞지 않는 항목이 있습니다.');
			return;
		}

		// TODO: 백엔드 회원가입 API 연결 후 가입 요청을 처리하세요.
		window.alert('회원가입이 완료되었습니다.');
		navigate('/login');
	};

	const handleCheck = (fieldName, label, e) => {
		const value = e.currentTarget.form[fieldName]?.value.trim() || '';

		if (!value) {
			setMessages((prevMessages) => ({
				...prevMessages,
				[fieldName]: { type: 'error', text: `${label}를 입력해 주세요.` },
			}));
			return;
		}

		if (fieldName === 'userId' && !isValidUserId(value)) {
			setMessages((prevMessages) => ({
				...prevMessages,
				userId: { type: 'error', text: '아이디는 영문, 숫자, 밑줄(_) 4~20자로 입력해 주세요.' },
			}));
			return;
		}

		if (fieldName === 'nickname' && !isValidNickname(value)) {
			setMessages((prevMessages) => ({
				...prevMessages,
				nickname: { type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' },
			}));
			return;
		}

		// TODO: 백엔드 중복 확인 API 연결 후 실제 사용 가능 여부를 반영하세요.
		setMessages((prevMessages) => ({
			...prevMessages,
			[fieldName]: { type: 'success', text: `사용 가능한 ${label}입니다.` },
		}));
	};

	const handleEmailVerification = (e) => {
		const form = e.currentTarget.form;
		const email = form.email?.value.trim() || '';

		if (!email) {
			setMessages((prevMessages) => ({ ...prevMessages, email: { type: 'error', text: '이메일을 입력해 주세요.' } }));
			return;
		}

		if (!isValidEmail(email)) {
			setMessages((prevMessages) => ({ ...prevMessages, email: { type: 'error', text: '이메일 형식에 맞게 입력해 주세요.' } }));
			return;
		}

		// TODO: 백엔드 이메일 인증 API 연결 후 인증 코드 발송 결과를 반영하세요.
		setMessages((prevMessages) => ({ ...prevMessages, email: { type: 'success', text: '인증 코드를 발송했습니다.' } }));
	};

	const handleVerificationCodeCheck = (e) => {
		const form = e.currentTarget.form;
		const verificationCode = form.verificationCode?.value.trim() || '';
		const message = getFieldMessage('verificationCode', verificationCode, form);

		if (message) {
			setMessages((prevMessages) => ({ ...prevMessages, verificationCode: message }));
			return;
		}

		// TODO: 백엔드 인증코드 확인 API 연결 후 실제 인증 성공/실패 결과를 반영하세요.
		if (verificationCode !== '123456') {
			setMessages((prevMessages) => ({
				...prevMessages,
				verificationCode: { type: 'error', text: '인증코드가 일치하지 않습니다.' },
			}));
			return;
		}

		setMessages((prevMessages) => ({
			...prevMessages,
			verificationCode: { type: 'success', text: '인증이 완료되었습니다.' },
		}));
	};

	const renderFieldMessage = (fieldName) => {
		const message = messages[fieldName];

		return (
			<Styles.FieldMessage className={`${message?.type || ''} ${message ? '' : 'empty'}`}>
				{message?.text || '메시지 영역'}
			</Styles.FieldMessage>
		);
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
									<Styles.Input id="userId" name="userId" placeholder="영문, 숫자, 밑줄(_) 4~20자" type="text" aria-invalid={messages.userId?.type === 'error'} onBlur={(e) => handleFieldBlur('userId', e)} />
								</Styles.InputGroup>
								<Styles.GlassButton type="button" onClick={(e) => handleCheck('userId', '아이디', e)}>
									중복 확인
								</Styles.GlassButton>
							</Styles.FieldWithButton>
							{renderFieldMessage('userId')}
						</Styles.Field>

						<Styles.Field>
							<label htmlFor="nickname">닉네임</label>
							<Styles.FieldWithButton>
								<Styles.InputGroup>
									<Styles.Input id="nickname" name="nickname" placeholder="한글, 영문, 숫자 2~12자" type="text" aria-invalid={messages.nickname?.type === 'error'} onBlur={(e) => handleFieldBlur('nickname', e)} />
								</Styles.InputGroup>
								<Styles.GlassButton type="button" onClick={(e) => handleCheck('nickname', '닉네임', e)}>
									중복 확인
								</Styles.GlassButton>
							</Styles.FieldWithButton>
							{renderFieldMessage('nickname')}
						</Styles.Field>

						<Styles.FieldGroup>
							<Styles.Field>
								<label htmlFor="email">이메일</label>
								<Styles.FieldWithButton>
									<Styles.InputGroup>
										<Styles.Input id="email" name="email" placeholder="example@festapick.com" type="email" inputMode="email" aria-invalid={messages.email?.type === 'error'} onBlur={(e) => handleFieldBlur('email', e)} />
									</Styles.InputGroup>
									<Styles.GlassButton type="button" onClick={handleEmailVerification}>
										인증 요청
									</Styles.GlassButton>
								</Styles.FieldWithButton>
								{renderFieldMessage('email')}
							</Styles.Field>

							<Styles.Field>
								<label htmlFor="verificationCode">인증코드</label>
								<Styles.FieldWithButton>
									<Styles.InputGroup>
										<Styles.Input id="verificationCode" name="verificationCode" placeholder="숫자 6자리" type="text" inputMode="numeric" maxLength={6} data-has-timer="true" aria-invalid={messages.verificationCode?.type === 'error'} onBlur={(e) => handleFieldBlur('verificationCode', e)} />
										<Styles.Timer>03:00</Styles.Timer>
									</Styles.InputGroup>
									<Styles.GlassButton type="button" onClick={handleVerificationCodeCheck}>
										확인
									</Styles.GlassButton>
								</Styles.FieldWithButton>
								{renderFieldMessage('verificationCode')}
							</Styles.Field>
						</Styles.FieldGroup>

						<Styles.PasswordGrid>
							<Styles.Field>
								<label htmlFor="password">비밀번호</label>
								<Styles.InputGroup>
									<Styles.Input id="password" name="password" placeholder="영문, 숫자, 특수문자 8~20자" type="password" aria-invalid={messages.password?.type === 'error'} data-no-focus-animation="true" onBlur={(e) => handleFieldBlur('password', e)} />
								</Styles.InputGroup>
								{renderFieldMessage('password')}
							</Styles.Field>

							<Styles.Field>
								<label htmlFor="passwordConfirm">비밀번호 확인</label>
								<Styles.InputGroup>
									<Styles.Input id="passwordConfirm" name="passwordConfirm" placeholder="비밀번호를 다시 입력하세요" type="password" aria-invalid={messages.passwordConfirm?.type === 'error'} data-no-focus-animation="true" onBlur={(e) => handleFieldBlur('passwordConfirm', e)} />
								</Styles.InputGroup>
								{renderFieldMessage('passwordConfirm')}
							</Styles.Field>
						</Styles.PasswordGrid>

						<Styles.Terms>
							<input id="terms" name="terms" type="checkbox" />
							<label htmlFor="terms">
								<a href="/terms">이용약관</a>과 <a href="/privacy">개인정보 처리방침</a>에 동의합니다.
							</label>
						</Styles.Terms>
						{messages.terms && <Styles.FieldMessage className={messages.terms.type}>{messages.terms.text}</Styles.FieldMessage>}

						<Styles.NeonButton type="submit">회원가입</Styles.NeonButton>
					</Styles.Form>

					<Styles.LoginPrompt>
						<p>
							이미 계정이 있으신가요? <a href="/login">로그인하기</a>
						</p>
					</Styles.LoginPrompt>
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default SignupPage;
