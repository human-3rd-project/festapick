package com.human.festapick.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Bucket;
import com.human.festapick.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private final Bucket firebaseStorageBucket;

    @Value("${firebase.upload-base-path:uploads}")
    private String uploadBasePath;

    public String uploadImage(Long userId, MultipartFile file) {
        validateUserId(userId);
        validateImageFile(file);

        String contentType = file.getContentType();
        String storagePath = buildStoragePath(userId, file.getOriginalFilename(), contentType);
        String downloadToken = UUID.randomUUID().toString();

        try {
            BlobInfo blobInfo = BlobInfo.newBuilder(firebaseStorageBucket.getName(), storagePath)
                    .setContentType(contentType)
                    .setMetadata(Map.of("firebaseStorageDownloadTokens", downloadToken))
                    .build();

            firebaseStorageBucket.getStorage().create(blobInfo, file.getBytes());
        } catch (IOException e) {
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 파일을 읽는 중 오류가 발생했습니다.");
        } catch (RuntimeException e) {
            throw new CustomException(HttpStatus.BAD_GATEWAY, "이미지 업로드에 실패했습니다.");
        }

        return buildDownloadUrl(storagePath, downloadToken);
    }

    private void validateUserId(Long userId) {
        if (userId == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "사용자 ID가 필요합니다.");
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "업로드할 이미지 파일이 필요합니다.");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "이미지 파일은 10MB 이하만 업로드할 수 있습니다.");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "JPG, PNG, GIF, WEBP 이미지만 업로드할 수 있습니다.");
        }
    }

    private String buildStoragePath(Long userId, String originalFilename, String contentType) {
        String extension = resolveExtension(originalFilename, contentType);
        String basePath = normalizeBasePath(uploadBasePath);

        return basePath + "/" + userId + "/" + UUID.randomUUID() + extension;
    }

    private String resolveExtension(String originalFilename, String contentType) {
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');

            if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
                String extension = originalFilename.substring(dotIndex).toLowerCase();

                if (extension.matches("\\.(jpg|jpeg|png|gif|webp)")) {
                    return extension;
                }
            }
        }

        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    private String normalizeBasePath(String basePath) {
        if (basePath == null || basePath.isBlank()) {
            return "uploads";
        }

        return basePath.replaceAll("^/+", "").replaceAll("/+$", "");
    }

    private String buildDownloadUrl(String storagePath, String downloadToken) {
        String encodedPath = URLEncoder.encode(storagePath, StandardCharsets.UTF_8);

        return "https://firebasestorage.googleapis.com/v0/b/"
                + firebaseStorageBucket.getName()
                + "/o/"
                + encodedPath
                + "?alt=media&token="
                + downloadToken;
    }
}
