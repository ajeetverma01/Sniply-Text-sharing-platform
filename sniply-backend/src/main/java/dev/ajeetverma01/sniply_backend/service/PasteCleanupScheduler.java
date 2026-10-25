
package dev.ajeetverma01.sniply_backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PasteCleanupScheduler {

    private final PasteService pasteService;

    public PasteCleanupScheduler(PasteService pasteService) {
        this.pasteService = pasteService;
    }

    @Scheduled(fixedRate = 600000)
    public void cleanupExpiredPastes() {
        pasteService.deleteExpiredPastes();
    }
}
