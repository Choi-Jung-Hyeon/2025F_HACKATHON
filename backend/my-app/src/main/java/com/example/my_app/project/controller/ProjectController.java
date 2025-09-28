package com.example.my_app.project.controller;

import com.example.my_app.project.domain.Project;
import com.example.my_app.project.repository.ProjectRepository;
import com.example.my_app.node.domain.Node;
import com.example.my_app.node.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.*;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final NodeRepository nodeRepository;


    @GetMapping("/info")
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return ResponseEntity.ok(projects);
    }


    @GetMapping("/{id}") 
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createProjectWithKeywords(@RequestBody ProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setCreatedBy(request.getCreatedBy());
        Project savedProject = projectRepository.save(project);
    

        Node rootNode = new Node();
        rootNode.setText(request.getTitle());
        rootNode.setProject(savedProject);
        Node savedRootNode = nodeRepository.save(rootNode);
    

        List<String> keywords = Arrays.asList("AI", "Data", "Visualization", "UX", "Cloud");
        Random random = new Random();
        int firstIndex = random.nextInt(keywords.size());
        int secondIndex;
        do {
            secondIndex = random.nextInt(keywords.size());
        } while (secondIndex == firstIndex);

        String keyword1 = keywords.get(firstIndex);
        String keyword2 = keywords.get(secondIndex);
    

        Node childNode1 = new Node();
        childNode1.setText(keyword1);
        childNode1.setActive(false);
        childNode1.setProject(savedProject);
        Node savedChildNode1 = nodeRepository.save(childNode1);


        Node childNode2 = new Node();
        childNode2.setText(keyword2);
        childNode2.setActive(false);
        childNode2.setProject(savedProject);
        Node savedChildNode2 = nodeRepository.save(childNode2);
    

        Map<String, Object> response = new HashMap<>();
        response.put("projectId", savedProject.getId());
        response.put("rootNodeId", savedRootNode.getId());
        response.put("keywords", Arrays.asList(keyword1, keyword2));

        return ResponseEntity.ok(response);
    }

    @Data
    static class ProjectRequest {
        private String title;

        private String createdBy;
    }
    
}