package com.sistemas.cursoonline.Repository;
import com.sistemas.cursoonline.Entidades.Clase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaseRepository extends JpaRepository<Clase, Long> {
    List<Clase> findByCursoId(Long cursoId);
}