package com.human.festapick.service;

import com.human.festapick.constant.UserStatus;
import com.human.festapick.dto.request.ProfileReqDto;
import com.human.festapick.dto.response.ProfileResDto;
import com.human.festapick.entity.Users;
import com.human.festapick.exception.CustomException;
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

        if (request.getNickname() != null
                && !request.getNickname().equals(user.getNickname())
                && userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
        }

        if (request.getNickname() != null && request.getNickname().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "닉네임은 비어 있을 수 없습니다.");
        }

        if (request.getNickname().length() > 10) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "닉네임은 20자 이하만 가능합니다.");
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
    }
}