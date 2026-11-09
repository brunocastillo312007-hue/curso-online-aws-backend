package com.sistemas.cursoonline.Service;

import com.sistemas.cursoonline.Entidades.Resena;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.ResenaRepository;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Resena> listarResenas() {
        return resenaRepository.findAll();
    }

    public Optional<Resena> obtenerPorId(Long id) {
        return resenaRepository.findById(id);
    }

    public Resena guardarResena(Resena resena) {
        // Validar que el usuario que reseña sea ESTUDIANTE
        if (resena.getEstudiante() != null && resena.getEstudiante().getId() != null) {
            Usuario estudiante = usuarioRepository.findById(resena.getEstudiante().getId())
                    .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

            if (!"ESTUDIANTE".equalsIgnoreCase(estudiante.getRol())) {
                throw new RuntimeException("Acción denegada: Solo los estudiantes pueden dejar reseñas.");
            }
        }
        return resenaRepository.save(resena);
    }

    public Resena actualizarResena(Long id, Resena resenaDetalles) {
        Resena resenaExistente = resenaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada para actualizar"));

        resenaExistente.setCalificacion(resenaDetalles.getCalificacion());
        resenaExistente.setComentario(resenaDetalles.getComentario());

        return resenaRepository.save(resenaExistente);
    }

    public void eliminarResena(Long id) {
        if (!resenaRepository.existsById(id)) {
            throw new RuntimeException("Reseña no encontrada");
        }
        resenaRepository.deleteById(id);
    }
}