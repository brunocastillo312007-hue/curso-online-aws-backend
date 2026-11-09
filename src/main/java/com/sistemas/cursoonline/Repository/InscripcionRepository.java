package com.sistemas.cursoonline.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sistemas.cursoonline.Entidades.Inscripcion;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    
    // Consulta explícita para evitar errores de nombres de propiedades en JPA
    @Query("SELECT i FROM Inscripcion i WHERE i.estudiante.id = :estudianteId")
    List<Inscripcion> findByEstudianteId(@Param("estudianteId") Long estudianteId);

    // Busca las inscripciones donde el curso pertenezca al ID del profesor
    List<Inscripcion> findByCursoProfesorId(Long profesorId);
}