import React, { useState } from 'react';
import { Lock, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Styles from './LoginPageCss';

const MOCK_LOGIN_ACCOUNT = {
	userId: 'test',
	password: '1234',
};

const LoginPage = () => {
	const navigate = useNavigate();
	const [status, setStatus] = useState({ visible: false, type: '', text: '' });

	const handleSubmit = (e) => {
		e.preventDefault();
		const userId = e.target.userId?.value || '';
		const pass = e.target.password?.value || '';

		if (!userId || !pass) {
			setStatus({ visible: true, type: 'error', text: '아이디와 비밀번호를 입력해주세요.' });
			return;
		}

		// TODO: 백엔드 로그인 API 연결 후 실제 응답에 따라 성공/실패 처리를 분기하세요.
		const isLoginSuccess = userId === MOCK_LOGIN_ACCOUNT.userId && pass === MOCK_LOGIN_ACCOUNT.password;

		if (isLoginSuccess) {
			setStatus({ visible: false, type: '', text: '' });
			navigate('/', { replace: true });
		} else {
			setStatus({ visible: true, type: 'error', text: '아이디와 비밀번호를 확인해주세요.' });
		}
	};

	const handleSocialLogin = (provider) => {
		// TODO: 백엔드 소셜 로그인 API 연결 후 신규 가입자일 때 추가정보 입력 페이지로 이동하세요.
		navigate('/social-login', { state: { provider } });
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
				<Styles.LogoArea>
					<h1>FestaPick</h1>
					<p>Feel the rhythm of the night.</p>
				</Styles.LogoArea>

				<Styles.GlassContainer>
					<Styles.Form id="loginForm" onSubmit={handleSubmit} noValidate>
						<Styles.Field>
							<label htmlFor="userId">아이디</label>
							<Styles.InputGroup>
								<Styles.Icon aria-hidden="true">
									<User size={22} strokeWidth={2} />
								</Styles.Icon>
								<Styles.Input id="userId" name="userId" placeholder="아이디를 입력하세요" type="text" required />
							</Styles.InputGroup>
						</Styles.Field>

						<Styles.Field>
							<label htmlFor="password">비밀번호</label>
							<Styles.InputGroup>
								<Styles.Icon aria-hidden="true">
									<Lock size={22} strokeWidth={2} />
								</Styles.Icon>
								<Styles.Input id="password" name="password" placeholder="비밀번호를 입력하세요" type="password" required />
							</Styles.InputGroup>
						</Styles.Field>

						<Styles.StatusMessage className={`${status.visible ? 'visible' : ''} ${status.type === 'error' ? 'error' : ''} ${status.type === 'success' ? 'success' : ''}`} id="statusMessage">
							{status.text}
						</Styles.StatusMessage>

						<Styles.NeonButton type="submit">로그인</Styles.NeonButton>

						<Styles.LinksRow>
							<Styles.RecoveryLinks>
								<a href="/find-id">아이디 찾기</a>
								<a href="/find-password">비밀번호 찾기</a>
							</Styles.RecoveryLinks>
							<Styles.SignupLink href="/signup">회원가입</Styles.SignupLink>
						</Styles.LinksRow>
					</Styles.Form>

					<Styles.Divider>
						<span>or continue with</span>
					</Styles.Divider>

					<Styles.Socials>
						<Styles.KakaoButton type="button" onClick={() => handleSocialLogin('kakao')}>
							<Styles.FilledIcon aria-hidden="true">
								<MessageCircle size={20} strokeWidth={2.4} />
							</Styles.FilledIcon>
							<span>카카오톡으로 로그인</span>
						</Styles.KakaoButton>
						<Styles.NaverButton type="button" onClick={() => handleSocialLogin('naver')}>
							<Styles.NaverMark>N</Styles.NaverMark>
							<span>네이버로 로그인</span>
						</Styles.NaverButton>
					</Styles.Socials>
				</Styles.GlassContainer>
			</Styles.Main>
		</Styles.Page>
	);
};

export default LoginPage;

