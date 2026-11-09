package com.sistemas.cursoonline.Repository;

import com.sistemas.cursoonline.Entidades.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    
}