package com.sistemas.cursoonline.Repository;

import com.sistemas.cursoonline.Entidades.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    // NUEVO: Método para buscar cursos por el ID del profesor asociado
    List<Curso> findByProfesorId(Long profesorId);
}