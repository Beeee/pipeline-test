package no.poc;

import no.poc.config.Config;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class App extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Config.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
