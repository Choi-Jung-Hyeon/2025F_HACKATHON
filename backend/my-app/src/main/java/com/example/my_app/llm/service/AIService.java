package com.example.my_app.llm.service;

import com.example.my_app.llm.PromptProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final PromptProperties promptProperties;
    private Map<String, String> promptTemplates;

    // ... (생성자 및 init 메소드는 이전과 동일)
    public AIService(ChatClient chatClient, PromptProperties promptProperties) {
        this.chatClient = chatClient;
        this.promptProperties = promptProperties;
    }
    
    @PostConstruct
    public void init() {
        this.promptTemplates = promptProperties.getPrompts().stream()
                .collect(Collectors.toMap(
                        PromptProperties.PromptConfig::getName,
                        PromptProperties.PromptConfig::getTemplate
                ));
    }
    
    // ⬇️ 반환 타입을 String에서 List<String>으로 변경
    public List<String> generateNewKeywords(String mainTopic, String keyword) {
        String template = promptTemplates.get("generate_new_keywords");
        if (template == null) {
            throw new IllegalArgumentException("Prompt 'generate_new_keywords' not found.");
        }

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Map<String, Object> variables = Map.of(
                "mainTopic", mainTopic,
                "keyword", keyword
        );

        // 1. LLM으로부터 원본 응답 문자열을 받습니다.
        String rawResponse = chatClient.call(promptTemplate.create(variables))
                                     .getResult()
                                     .getOutput()
                                     .getContent();

        // 2. 받은 문자열을 파싱하여 List<String>으로 변환 후 반환합니다.
        return parseLlmResponseToList(rawResponse);
    }

    // ⬇️ 이 메소드도 동일하게 반환 타입을 변경
    public List<String> generateNewIdeas(String mainTopic, List<String> keywords) {
        String template = promptTemplates.get("generate_new_ideas");
        if (template == null) {
            throw new IllegalArgumentException("Prompt 'generate_new_ideas' not found.");
        }

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Map<String, Object> variables = Map.of(
                "mainTopic", mainTopic,
                "keywords", String.join(", ", keywords)
        );

        String rawResponse = chatClient.call(promptTemplate.create(variables))
                                     .getResult()
                                     .getOutput()
                                     .getContent();
        
        return parseLlmResponseToList(rawResponse);
    }
    
    /**
     * LLM의 줄바꿈 응답을 String 리스트로 파싱하는 헬퍼 메소드
     */
    private List<String> parseLlmResponseToList(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) {
            return List.of(); // 비어있으면 빈 리스트 반환
        }
        return rawResponse.lines()              // 1. 문자열을 줄바꿈 기준으로 나눔 (Stream<String> 생성)
                .map(String::trim)              // 2. 각 줄의 앞뒤 공백 제거
                .filter(line -> !line.isEmpty())  // 3. 내용이 없는 빈 줄은 제거
                .toList();                        // 4. 결과를 새로운 리스트로 만듦
    }
}