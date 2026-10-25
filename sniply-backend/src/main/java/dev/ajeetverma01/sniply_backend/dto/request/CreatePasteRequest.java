package dev.ajeetverma01.sniply_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreatePasteRequest(

        @NotBlank(message = "Content must not be empty")
        @Size(max = 100000, message = "Content must not exceed 100000 characters")
        String content,

        Instant expiresAt

) {
}