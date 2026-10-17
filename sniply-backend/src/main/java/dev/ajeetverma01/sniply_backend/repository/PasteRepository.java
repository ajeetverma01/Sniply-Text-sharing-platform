package dev.ajeetverma01.sniply_backend.repository;

import dev.ajeetverma01.sniply_backend.entity.Paste;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasteRepository extends JpaRepository<Paste, String> {
}
