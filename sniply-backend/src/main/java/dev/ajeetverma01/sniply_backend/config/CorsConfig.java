
package dev.ajeetverma01.sniply_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "https://sniply-beta.vercel.app"
                        )
                        .allowedMethods(
                                "GET", "POST", "PUT",
                                "DELETE", "OPTIONS"
                        )
                        .allowedHeaders("*");
            }
        };
    }
}
