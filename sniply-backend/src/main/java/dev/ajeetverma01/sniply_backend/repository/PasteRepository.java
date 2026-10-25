package dev.ajeetverma01.sniply_backend.repository;

import dev.ajeetverma01.sniply_backend.entity.Paste;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.Instant;
import java.util.List;

public interface PasteRepository extends JpaRepository<Paste, String> {
    void deleteByExpiresAtBefore(Instant time);
    List<Paste> findByExpiresAtIsNullOrExpiresAtAfter(Instant now);
}
