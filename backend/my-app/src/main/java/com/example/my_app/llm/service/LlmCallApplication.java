package com.example.my_app.llm.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.my_app.llm.PromptProperties;

@SpringBootApplication
@EnableConfigurationProperties(PromptProperties.class) // 프롬프트 속성 클래스 활성화
public class LlmCallApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        SpringApplication.run(LlmCallApplication.class, args);
    }
}