package com.sistemas.cursoonline.Service;

import com.sistemas.cursoonline.Entidades.Curso;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.CursoRepository;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }
    
    // NUEVO: Método para listar solo los cursos impartidos por un profesor específico
    public List<Curso> listarCursosPorProfesor(Long profesorId) {
        return cursoRepository.findByProfesorId(profesorId);
    }

    public Optional<Curso> obtenerPorId(Long id) {
        return cursoRepository.findById(id);
    }

    public Curso guardarCurso(Curso curso) {
        // Validar que el usuario asociado sea profesor
        if (curso.getProfesor() != null && curso.getProfesor().getId() != null) {
            Usuario profesor = usuarioRepository.findById(curso.getProfesor().getId())
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

            if (!"PROFESOR".equalsIgnoreCase(profesor.getRol())) {
                throw new RuntimeException("Acción denegada: Solo los usuarios con rol de PROFESOR pueden crear cursos.");
            }
        } else {
            throw new RuntimeException("El curso debe estar asignado a un profesor.");
        }

        return cursoRepository.save(curso);
    }

    // NUEVO: Método para Actualizar
    public Curso actualizarCurso(Long id, Curso cursoDetalles) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado para actualizar"));

        cursoExistente.setTitulo(cursoDetalles.getTitulo());
        cursoExistente.setDescripcion(cursoDetalles.getDescripcion());
        cursoExistente.setPrecio(cursoDetalles.getPrecio());

        if (cursoDetalles.getProfesor() != null && cursoDetalles.getProfesor().getId() != null) {
            Usuario profesor = usuarioRepository.findById(cursoDetalles.getProfesor().getId())
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
            cursoExistente.setProfesor(profesor);
        }

        return cursoRepository.save(cursoExistente);
    }

    // NUEVO: Método para Eliminar
    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, el curso no existe");
        }
        cursoRepository.deleteById(id);
    }
}