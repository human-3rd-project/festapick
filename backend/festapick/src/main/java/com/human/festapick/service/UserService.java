package com.human.festapick.service;

import com.human.festapick.constant.OAuthProvider;
import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.MyRegionReqDto;
import com.human.festapick.dto.request.ProfileReqDto;
import com.human.festapick.dto.response.MyRegionResDto;
import com.human.festapick.dto.response.ProfileResDto;
import com.human.festapick.entity.LegalDongCodes;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
import com.human.festapick.repository.LegalDongCodeRepository;
import com.human.festapick.repository.RefreshTokenRepository;
import com.human.festapick.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LegalDongCodeRepository legalDongCodeRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 내 프로필 조회
     */
    @Transactional(readOnly = true)
    public ProfileResDto getMyProfile(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "탈퇴한 회원입니다.");
        }

        return new ProfileResDto(
                user.getUserId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getRole()
        );
    }

    /**
     * 내 프로필 수정
     */
    public ProfileResDto updateMyProfile(
            Long userId,
            ProfileReqDto request
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "탈퇴한 회원입니다.");
        }

        if (request.getNickname() != null) {
            if (request.getNickname().isBlank()) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "닉네임은 비어 있을 수 없습니다.");
            }

            if (request.getNickname().length() > 50) {
                throw new CustomException(HttpStatus.BAD_REQUEST, "닉네임은 50자 이하만 가능합니다.");
            }

            if (!request.getNickname().equals(user.getNickname())
                    && userRepository.existsByNickname(request.getNickname())) {
                throw new CustomException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(request.getNickname());
        }

        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        return new ProfileResDto(
                user.getUserId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getRole()
        );
    }

    /**
     * 마이페이지 비밀번호 변경
     */
    public void changeMyPassword(
            Long userId,
            String currentPassword,
            String newPassword
    ) {

        // userId로 현재 로그인 사용자를 조회합니다.
        Users user = userRepository.findById(userId)
                // 조회되는 사용자가 없으면 404 예외를 발생시킵니다.
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        // 탈퇴 처리된 회원은 마이페이지 기능을 사용할 수 없도록 차단합니다.
        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "탈퇴한 회원입니다.");
        }

        // 소셜 로그인 계정은 서비스가 관리하는 로컬 비밀번호가 없으므로 변경을 막습니다.
        if (user.getProvider() != OAuthProvider.LOCAL) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
        }

        // 로컬 계정인데도 저장된 비밀번호가 없으면 변경 대상이 아니므로 차단합니다.
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "비밀번호 변경이 가능한 로컬 계정이 아닙니다.");
        }

        // 현재 비밀번호 입력값이 없으면 검증을 진행하지 않습니다.
        if (currentPassword == null || currentPassword.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "현재 비밀번호를 입력해주세요.");
        }

        // 새 비밀번호 입력값이 없으면 변경을 진행하지 않습니다.
        if (newPassword == null || newPassword.isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "새 비밀번호를 입력해주세요.");
        }

        // 입력한 현재 비밀번호가 DB에 저장된 암호화 비밀번호와 일치하는지 확인합니다.
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "현재 비밀번호가 일치하지 않습니다.");
        }

        // 새 비밀번호가 현재 비밀번호와 같으면 변경하지 않습니다.
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "새 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }

        // 새 비밀번호는 원문이 아니라 암호화된 값으로 저장합니다.
        user.setPassword(passwordEncoder.encode(newPassword));
    }

    /**
     * 회원 탈퇴
     *
     * 실제 DELETE가 아니라 status만 DELETED로 변경
     */
    public void deleteMyAccount(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이미 탈퇴한 회원입니다.");
        }

        refreshTokenRepository.deleteByUsers(user);
        userRepository.delete(user);
    }

    /**
     * 내 관심지역 조회
     */
    @Transactional(readOnly = true)
    public MyRegionResDto getMyRegion(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "탈퇴한 회원입니다.");
        }

        if (user.getLdongRegnCd() == null
                || user.getLdongRegnCd().isBlank()
                || user.getLdongSignguCd() == null
                || user.getLdongSignguCd().isBlank()) {
            return new MyRegionResDto(
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        LegalDongCodes region = legalDongCodeRepository.findByLdongRegnCdAndLdongSignguCdAndActiveTrue(
                        user.getLdongRegnCd(),
                        user.getLdongSignguCd()
                )
                .orElseThrow(() ->
                        new CustomException(HttpStatus.BAD_REQUEST, "사용할 수 없는 지역 코드입니다.")
                );

        return new MyRegionResDto(
                region.getLdongRegnCd(),
                region.getLdongSignguCd(),
                region.getSidoName(),
                region.getSigunguName(),
                region.getFullName()
        );
    }

    /**
     * 내 관심지역 수정
     */
    public MyRegionResDto updateMyRegion(
            Long userId,
            MyRegionReqDto request
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.")
                );

        if (user.getStatus() == UserStatus.DELETED) {
            throw new CustomException(HttpStatus.FORBIDDEN, "탈퇴한 회원입니다.");
        }

        LegalDongCodes region = legalDongCodeRepository.findByLdongRegnCdAndLdongSignguCdAndActiveTrue(
                        request.getLdongRegnCd(),
                        request.getLdongSignguCd()
                )
                .orElseThrow(() ->
                        new CustomException(HttpStatus.BAD_REQUEST, "사용할 수 없는 지역 코드입니다.")
                );

        user.setLdongRegnCd(region.getLdongRegnCd());
        user.setLdongSignguCd(region.getLdongSignguCd());

        return new MyRegionResDto(
                region.getLdongRegnCd(),
                region.getLdongSignguCd(),
                region.getSidoName(),
                region.getSigunguName(),
                region.getFullName()
        );
    }
}
