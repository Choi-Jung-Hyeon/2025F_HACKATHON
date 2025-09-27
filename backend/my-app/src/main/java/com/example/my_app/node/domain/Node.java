package com.example.my_app.node.domain;

import com.example.my_app.project.domain.Project;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "node")
@Builder
@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projects_id", nullable = false)
    private Project project;


    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore 
    private List<Node> children = new ArrayList<>();



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Node parent;

    @Column(name = "node_text", nullable = false)
    private String nodeText;

    @Column(name = "memo_text")
    private String memoText;

    @Column(name = "is_active")
    private Boolean isActive;  
}