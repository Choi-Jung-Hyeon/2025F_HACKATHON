package com.example.my_app.llm;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.util.List;

@ConfigurationProperties(prefix = "ideation")
public class PromptProperties {

    private List<PromptConfig> prompts;

    public List<PromptConfig> getPrompts() {
        return prompts;
    }

    public void setPrompts(List<PromptConfig> prompts) {
        this.prompts = prompts;
    }

    /**
     * YAML 파일의 각 프롬프트 항목(- name: ...)에 해당합니다.
     */
    public static class PromptConfig {
        private String name;
        private String description;
        private List<String> variables; // 'variables' 리스트를 위한 필드 추가
        private String template;        // 'prompt' 키를 위한 필드 (기존 이름 유지)

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public List<String> getVariables() { return variables; }
        public void setVariables(List<String> variables) { this.variables = variables; }

        public String getTemplate() { return template; }
        public void setTemplate(String template) { this.template = template; }
    }
}