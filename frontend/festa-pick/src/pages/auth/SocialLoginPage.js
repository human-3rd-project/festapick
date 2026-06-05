import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Styles from './SocialLoginPageCss';

const SocialLoginPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const socialEmail = useMemo(() => {
		const searchParams = new URLSearchParams(location.search);

		return location.state?.email || searchParams.get('email') || 'festa_lover@social.com';
	}, [location.search, location.state]);
	const [nickname, setNickname] = useState('');
	const [agreements, setAgreements] = useState({
		all: false,
		terms: false,
		privacy: false,
	});
	const [message, setMessage] = useState({ type: '', text: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isValidNickname = (value) => /^[가-힣a-zA-Z0-9]{2,12}$/.test(value);

	const handleAgreementAll = (e) => {
		const checked = e.currentTarget.checked;

		setAgreements({
			all: checked,
			terms: checked,
			privacy: checked,
		});
	};

	const handleAgreementChange = (name, e) => {
		const checked = e.currentTarget.checked;

		setAgreements((prevAgreements) => {
			const nextAgreements = {
				...prevAgreements,
				[name]: checked,
			};

			return {
				...nextAgreements,
				all: nextAgreements.terms && nextAgreements.privacy,
			};
		});
	};

	const handleNicknameCheck = () => {
		const trimmedNickname = nickname.trim();

		if (!trimmedNickname) {
			setMessage({ type: 'error', text: '닉네임을 입력해 주세요.' });
			return;
		}

		if (!isValidNickname(trimmedNickname)) {
			setMessage({ type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' });
			return;
		}

		// TODO: 백엔드 닉네임 중복 확인 API 연결 후 실제 사용 가능 여부를 반영하세요.
		setMessage({ type: 'success', text: '사용 가능한 닉네임입니다.' });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmedNickname = nickname.trim();

		if (!isValidNickname(trimmedNickname)) {
			setMessage({ type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' });
			return;
		}

		if (!agreements.terms || !agreements.privacy) {
			setMessage({ type: 'error', text: '필수 약관에 모두 동의해 주세요.' });
			return;
		}

		setIsSubmitting(true);
		setMessage({ type: 'success', text: '가입 정보를 확인하고 있습니다.' });

		window.setTimeout(() => {
			// TODO: 백엔드 소셜 로그인 추가정보 저장 API 연결 후 완료 경로를 처리하세요.
			setIsSubmitting(false);
			window.alert('가입이 완료되었습니다.');
			navigate('/login');
		}, 800);
	};

	return (
		<Styles.Page>
			<Styles.BackgroundGradient />
			<Styles.BackgroundPhoto aria-hidden="true">
				<img
					alt=""
					src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6tJxnaSyQkuN2w9yVUxnuI1qb8jb35DWeQhgfe8JHrbzJ96E4-xTkx8uSZ71jEr0OOpblNIyOXPSpMzHt7ATD_c30FzrJc8Xyg9IvoNctBf9nD3Mqnn7nWFENWTIpcUfhB1mdRxwPHJMzGJ42zbvqy2R980BO7ggO9evbmW-XlaEBXs2M7daXYldXtDPUL4xNNjSvZOcPuYfn30s-uBX3UySWIRSoTuzXCup_gHcO4erA36E4hkDQCUtvMA9KtccNmJkKEU6I4JvV"
				/>
			</Styles.BackgroundPhoto>

			<Styles.Main>
				<Styles.GlassPanel>
					<Styles.Heading>
						<h1>FestaPick</h1>
						<h2>추가 정보 입력</h2>
						<p>FestaPick 가입을 위해 추가 정보를 입력해주세요.</p>
					</Styles.Heading>

					<Styles.Form onSubmit={handleSubmit} noValidate>
						<Styles.Field>
							<label htmlFor="socialEmail">연결된 이메일</label>
							<Styles.Input id="socialEmail" name="socialEmail" type="email" value={socialEmail} disabled readOnly />
						</Styles.Field>

						<Styles.Field>
							<label htmlFor="nickname">닉네임</label>
							<Styles.FieldWithButton>
								<Styles.InputGroup>
									<Styles.Input
										id="nickname"
										name="nickname"
										placeholder="닉네임을 입력해주세요"
										type="text"
										value={nickname}
										aria-invalid={message.type === 'error'}
										onChange={(e) => setNickname(e.currentTarget.value)}
										onBlur={() => {
											if (nickname.trim() && !isValidNickname(nickname.trim())) {
												setMessage({ type: 'error', text: '닉네임은 한글, 영문, 숫자 2~12자로 입력해 주세요.' });
											}
										}}
									/>
								</Styles.InputGroup>
								<Styles.GlassButton type="button" onClick={handleNicknameCheck}>
									중복 확인
								</Styles.GlassButton>
							</Styles.FieldWithButton>
							<Styles.HelpText>한글, 영문, 숫자만 사용 가능 (2~12자 내)</Styles.HelpText>
							<Styles.FieldMessage className={`${message.type || ''} ${message.text ? '' : 'empty'}`}>
								{message.text || '메시지 영역'}
							</Styles.FieldMessage>
						</Styles.Field>

						<Styles.Divider />

						<Styles.TermsGroup>
							<Styles.MasterTerm>
								<Styles.CheckboxInput id="allTerms" type="checkbox" checked={agreements.all} onChange={handleAgreementAll} />
								<Styles.CustomCheckbox aria-hidden="true">
									<Check size={16} strokeWidth={3} />
								</Styles.CustomCheckbox>
								<span>이용 약관</span>
							</Styles.MasterTerm>

							<Styles.TermList>
								<Styles.TermItem>
									<span>
										<Styles.SmallCheckbox id="terms" name="terms" type="checkbox" checked={agreements.terms} onChange={(e) => handleAgreementChange('terms', e)} />
										<label htmlFor="terms">[필수] 이용 약관</label>
									</span>
									<Styles.TermLink href="/terms" aria-label="이용 약관 보기">
										<ChevronRight size={18} />
									</Styles.TermLink>
								</Styles.TermItem>

								<Styles.TermItem>
									<span>
										<Styles.SmallCheckbox id="privacy" name="privacy" type="checkbox" checked={agreements.privacy} onChange={(e) => handleAgreementChange('privacy', e)} />
										<label htmlFor="privacy">[필수] 개인 정보 수집 및 이용 동의</label>
									</span>
									<Styles.TermLink href="/privacy" aria-label="개인 정보 수집 및 이용 동의 보기">
										<ChevronRight size={18} />
									</Styles.TermLink>
								</Styles.TermItem>
							</Styles.TermList>
						</Styles.TermsGroup>

						<Styles.SubmitButton type="submit" disabled={isSubmitting}>
							{isSubmitting && <Loader2 size={18} aria-hidden="true" />}
							{isSubmitting ? '처리 중...' : '가입 완료'}
						</Styles.SubmitButton>

						<Styles.BackButton type="button" onClick={() => navigate(-1)}>
							<ArrowLeft size={18} aria-hidden="true" />
							이전 페이지로 돌아가기
						</Styles.BackButton>
					</Styles.Form>

					<Styles.CardGlowTop />
					<Styles.CardGlowBottom />
				</Styles.GlassPanel>
			</Styles.Main>
		</Styles.Page>
	);
};

export default SocialLoginPage;
