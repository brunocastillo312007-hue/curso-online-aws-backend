package com.sistemas.cursoonline.Service;

import com.sistemas.cursoonline.Entidades.Inscripcion;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.InscripcionRepository;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Inscripcion> listarInscripciones() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> obtenerPorId(Long id) {
        return inscripcionRepository.findById(id);
    }

    public Inscripcion guardarInscripcion(Inscripcion inscripcion) {
        // Validar que el usuario asociado tenga el rol de ESTUDIANTE
        if (inscripcion.getEstudiante() != null && inscripcion.getEstudiante().getId() != null) {
            // Nota: Asegúrate de inyectar 'usuarioRepository' en tu InscripcionService si no lo tienes
            Usuario estudiante = usuarioRepository.findById(inscripcion.getEstudiante().getId())
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (!"ESTUDIANTE".equalsIgnoreCase(estudiante.getRol())) {
                throw new RuntimeException("Acción denegada: Solo los usuarios con rol de ESTUDIANTE pueden inscribirse a los cursos.");
            }
        } else {
            throw new RuntimeException("La inscripción debe estar asociada a un estudiante.");
        }

        return inscripcionRepository.save(inscripcion);
    }

    public void eliminarInscripcion(Long id) {
        inscripcionRepository.deleteById(id);
    }
    
    public Inscripcion actualizarInscripcion(Long id, Inscripcion inscripcionDetalles) {
        Inscripcion inscripcionExistente = inscripcionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada para actualizar"));

        inscripcionExistente.setCompletado(inscripcionDetalles.getCompletado());
        
        // Si necesitas actualizar la fecha o cambiar de curso/estudiante, puedes hacerlo aquí también
        if (inscripcionDetalles.getFechaInscripcion() != null) {
            inscripcionExistente.setFechaInscripcion(inscripcionDetalles.getFechaInscripcion());
        }

        return inscripcionRepository.save(inscripcionExistente);
    }
}