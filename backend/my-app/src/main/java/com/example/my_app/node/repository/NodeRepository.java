package com.example.my_app.node.repository;



import com.example.my_app.node.domain.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findAllByProject_Id(Long projectsId); //test용 


}
