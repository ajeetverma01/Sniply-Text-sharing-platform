package dev.ajeetverma01.sniply_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SniplyBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SniplyBackendApplication.class, args);
	}

}
