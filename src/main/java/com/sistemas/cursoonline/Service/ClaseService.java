package com.sistemas.cursoonline.Service;

import com.sistemas.cursoonline.Entidades.Clase;
import com.sistemas.cursoonline.Entidades.Curso;
import com.sistemas.cursoonline.Repository.ClaseRepository;
import com.sistemas.cursoonline.Repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaseService {

    @Autowired
    private ClaseRepository claseRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public List<Clase> listarClases() {
        return claseRepository.findAll();
    }

    public Optional<Clase> obtenerPorId(Long id) {
        return claseRepository.findById(id);
    }

    public Clase guardarClase(Clase clase) {
        // Validamos que el curso exista antes de asociar la clase
        if (clase.getCurso() != null && clase.getCurso().getId() != null) {
            Curso curso = cursoRepository.findById(clase.getCurso().getId())
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
            clase.setCurso(curso);
        }
        return claseRepository.save(clase);
    }

    // Actualizar Clase
    public Clase actualizarClase(Long id, Clase claseDetalles) {
        Clase claseExistente = claseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada para actualizar"));

        claseExistente.setTitulo(claseDetalles.getTitulo());
        claseExistente.setUrlVideo(claseDetalles.getUrlVideo());
        claseExistente.setOrden(claseDetalles.getOrden());

        if (claseDetalles.getCurso() != null && claseDetalles.getCurso().getId() != null) {
            Curso curso = cursoRepository.findById(claseDetalles.getCurso().getId())
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
            claseExistente.setCurso(curso);
        }

        return claseRepository.save(claseExistente);
    }

    // Eliminar Clase
    public void eliminarClase(Long id) {
        if (!claseRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, la clase no existe");
        }
        claseRepository.deleteById(id);
    }
}