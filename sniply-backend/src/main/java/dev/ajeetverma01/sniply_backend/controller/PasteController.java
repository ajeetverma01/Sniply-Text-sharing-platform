package dev.ajeetverma01.sniply_backend.controller;

import dev.ajeetverma01.sniply_backend.dto.request.CreatePasteRequest;
import dev.ajeetverma01.sniply_backend.dto.response.PasteResponse;
import dev.ajeetverma01.sniply_backend.entity.Paste;
import dev.ajeetverma01.sniply_backend.service.PasteService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/pastes")
@CrossOrigin(origins = "http://localhost:5173")
public class PasteController {

    private final PasteService pasteService;

    public PasteController(PasteService pasteService) {
        this.pasteService = pasteService;
    }

    @PostMapping
    public ResponseEntity<PasteResponse> createPaste(@Valid @RequestBody CreatePasteRequest request) {

        Paste paste = pasteService.createPaste(
                request.content(),
                request.expiresAt()
        );

        String shareableUrl =
                "https://sniply-beta.vercel.app/p/" + paste.getId();
        PasteResponse response = new PasteResponse(
                paste.getId(),
                paste.getContent(),
                paste.getCreatedAt(),
                paste.getExpiresAt(),
                shareableUrl
        );

        return ResponseEntity
                .created(URI.create("/api/pastes/" + paste.getId()))
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasteResponse> getPaste(@PathVariable String id) {

        Paste paste = pasteService.getPasteById(id)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Paste not found"
                        )
                );

        String shareableUrl =
                "https://sniply-beta.vercel.app/p/" + paste.getId();
        PasteResponse response = new PasteResponse(
                paste.getId(),
                paste.getContent(),
                paste.getCreatedAt(),
                paste.getExpiresAt(),
                shareableUrl
        );

        return ResponseEntity.ok(response);
    }
}