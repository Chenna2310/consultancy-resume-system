package com.consultancy.resume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class ConsultancyResumeApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsultancyResumeApplication.class, args);
    }
}