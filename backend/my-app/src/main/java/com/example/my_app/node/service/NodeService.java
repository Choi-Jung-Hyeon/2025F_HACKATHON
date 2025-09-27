package com.example.my_app.node.service;

import com.example.my_app.node.domain.Node;
import com.example.my_app.node.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NodeService {

    private final NodeRepository nodeRepository;

    // 특정 프로젝트에 속한 노드 전체 조회
    public List<Node> getNodesByProjectId(Long projectId) {
        return nodeRepository.findAllByProjectId(projectId);
    }

    // 현재 노드의 텍스트 가져오기
    public String getCurrentNodeText(Long nodeId) {
        return nodeRepository.findById(nodeId)
                .map(Node::getNodeText)
                .orElseThrow(() -> new IllegalArgumentException("해당 노드가 존재하지 않습니다: " + nodeId));
    }

    // 루트 노드의 텍스트 가져오기
    public String getRootNodeText(Long nodeId) {
        Node node = nodeRepository.findById(nodeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 노드가 존재하지 않습니다: " + nodeId));

        while (node.getParent() != null) {
            node = node.getParent();
        }

        return node.getNodeText();
    }
}