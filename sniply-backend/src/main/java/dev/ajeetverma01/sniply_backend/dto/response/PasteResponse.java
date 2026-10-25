package dev.ajeetverma01.sniply_backend.dto.response;

import java.time.Instant;

public record PasteResponse(
        String id,
        String content,
        Instant createdAt,
        Instant expiresAt,
        String shareableUrl
) {
}