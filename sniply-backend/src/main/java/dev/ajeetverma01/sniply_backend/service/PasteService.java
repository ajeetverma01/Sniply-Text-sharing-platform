
package dev.ajeetverma01.sniply_backend.service;

import dev.ajeetverma01.sniply_backend.entity.Paste;
import dev.ajeetverma01.sniply_backend.repository.PasteRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;

@Service
public class PasteService {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final int ID_LENGTH = 8;

    private static final SecureRandom RANDOM = new SecureRandom();

    private final PasteRepository pasteRepository;

    public PasteService(PasteRepository pasteRepository) {
        this.pasteRepository = pasteRepository;
    }

    public Paste createPaste(String content, Instant expiresAt) {
        String id = generateUniqueId();

        Paste paste = new Paste(id, content, expiresAt);

        return pasteRepository.save(paste);
    }

    public Optional<Paste> getPasteById(String id) {
        Optional<Paste> optionalPaste = pasteRepository.findById(id);

        if (optionalPaste.isEmpty()) {
            return Optional.empty();
        }

        Paste paste = optionalPaste.get();

        if (paste.getExpiresAt() != null
                && !paste.getExpiresAt().isAfter(Instant.now())) {
            return Optional.empty();
        }

        return Optional.of(paste);
    }

    private String generateUniqueId() {
        String id;

        do {
            StringBuilder builder = new StringBuilder(ID_LENGTH);

            for (int i = 0; i < ID_LENGTH; i++) {
                int index = RANDOM.nextInt(CHARACTERS.length());
                builder.append(CHARACTERS.charAt(index));
            }

            id = builder.toString();

        } while (pasteRepository.existsById(id));


        return id;
    }
}
