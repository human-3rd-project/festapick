import React, { useState } from 'react';
import { CircleAlert, CircleCheck, Mail, User } from 'lucide-react';
import Styles from './FindIdPageCss';

const initialResult = {
	visible: false,
	type: '',
	foundId: '',
	message: '',
};

const TEST_SUCCESS_EMAIL = 'test@test.com';

const FindIdPage = () => {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [result, setResult] = useState(initialResult);

	const handleSubmit = (e) => {
		e.preventDefault();
		const normalizedEmail = email.trim().toLowerCase();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!normalizedEmail) {
			setEmailError('이메일 주소를 입력해주세요.');
			setResult(initialResult);
			return;
		}

		if (!emailRegex.test(normalizedEmail)) {
			setEmailError('유효한 이메일 주소를 입력해주세요.');
			setResult(initialResult);
			return;
		}

		setEmailError('');

		// TODO: 백엔드 아이디 찾기 API 연결 후 응답값으로 성공/실패 결과를 설정합니다.
		if (normalizedEmail !== TEST_SUCCESS_EMAIL) {
			setResult({
				visible: true,
				type: 'error',
				foundId: '',
				message: '입력하신 이메일로 가입된 아이디를 찾을 수 없습니다.',
			});
			return;
		}

		setResult({
			visible: true,
			type: 'success',
			foundId: 'test',
			message: '가입하신 이메일로 아이디를 찾았습니다.',
		});
	};

	const handleRetry = () => {
		setEmail('');
		setEmailError('');
		setResult(initialResult);
	};

	const isSuccess = result.type === 'success';

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
						<h2>{result.visible ? (isSuccess ? '아이디 찾기 완료' : '아이디 찾기 실패') : '아이디 찾기'}</h2>
						<p>{result.visible ? result.message : '가입한 이메일로 아이디를 찾아보세요.'}</p>
					</Styles.Header>

					{result.visible ? (
						<Styles.ResultArea className={result.type}>
							<Styles.ResultBox className={result.type}>
								<Styles.ResultIcon className={result.type} aria-hidden="true">
									{isSuccess ? <CircleCheck size={30} strokeWidth={1.9} /> : <CircleAlert size={30} strokeWidth={1.9} />}
								</Styles.ResultIcon>
								<Styles.ResultLabel>{isSuccess ? 'Success' : 'Failed'}</Styles.ResultLabel>
								<Styles.ResultTitle>{isSuccess ? '아이디를 찾았습니다' : '일치하는 계정이 없습니다'}</Styles.ResultTitle>
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
							<Styles.LoginLink href="/login">로그인으로 돌아가기</Styles.LoginLink>
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

							<Styles.NeonButton type="submit">아이디 찾기</Styles.NeonButton>
							<Styles.LoginLink href="/login">로그인으로 돌아가기</Styles.LoginLink>
						</Styles.Form>
					)}
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default FindIdPage;
