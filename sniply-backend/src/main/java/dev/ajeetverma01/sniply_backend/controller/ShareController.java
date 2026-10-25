
package dev.ajeetverma01.sniply_backend.controller;

import dev.ajeetverma01.sniply_backend.dto.response.PasteResponse;
import dev.ajeetverma01.sniply_backend.entity.Paste;
import dev.ajeetverma01.sniply_backend.service.PasteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ShareController {

    private final PasteService pasteService;

    public ShareController(PasteService pasteService) {
        this.pasteService = pasteService;
    }

    @GetMapping(value = "/p/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String viewPaste(@PathVariable String id) {

        Paste paste = pasteService.getPasteById(id)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                org.springframework.http.HttpStatus.NOT_FOUND,
                                "Paste not found"
                        ));

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Sniply Paste</title>
                </head>
                <body>
                    <h1>Sniply</h1>
                    <pre>%s</pre>
                </body>
                </html>
                """.formatted(
                escapeHtml(paste.getContent())
        );
    }

    private String escapeHtml(String text) {
        return text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }



    @GetMapping("/p/{id}")
    public ResponseEntity<PasteResponse> getSharedPaste(@PathVariable String id) {

        Paste paste = pasteService.getPasteById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Paste not found"
                ));

        String shareableUrl = "http://localhost:8080/p/" + paste.getId();

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
