package dev.ajeetverma01.sniply_backend.controller;

import dev.ajeetverma01.sniply_backend.entity.Paste;
import dev.ajeetverma01.sniply_backend.service.PasteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/pastes")
// Just for testing purposes. Anyone can get all snippets haha i know
// If you are reading this, just let me know that you are here
public class AdminController {

    private final PasteService pasteService;

    public AdminController(PasteService pasteService) {
        this.pasteService = pasteService;
    }

    @GetMapping
    public List<Paste> getAllPastes() {
        return pasteService.getAllAvailablePastes();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaste(
            @PathVariable String id) {

        boolean deleted = pasteService.deletePasteById(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}