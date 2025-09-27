package com.example.my_app.llm;

import com.example.my_app.llm.service.AIService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


//테스트용 컨트롤러. 실제 구동에는필요없음!
@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    // DTOs
    public record KeywordRequest(String mainTopic, String keyword) {}
    public record IdeaRequest(String mainTopic, List<String> keywords) {}

    @PostMapping("/generate-keywords")
    public String generateKeywords(@RequestBody KeywordRequest request) {
        return aiService.generateNewKeywords(request.mainTopic, request.keyword);
    }

    @PostMapping("/generate-ideas")
    public String generateIdeas(@RequestBody IdeaRequest request) {
        return aiService.generateNewIdeas(request.mainTopic, request.keywords);
    }
}