package com.human.festapick.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LegalDongCodeRepository legalDongCodeRepository;

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
                user.getProfileImageUrl()
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
                user.getProfileImageUrl()
        );
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