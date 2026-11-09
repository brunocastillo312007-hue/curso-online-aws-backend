package com.sistemas.cursoonline.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemas.cursoonline.Entidades.Resena;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;
import com.sistemas.cursoonline.Service.ResenaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    // --- Inyecciones faltantes añadidas aquí ---
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;
    // ------------------------------------------

    @GetMapping
    public List<Resena> listarResenas() {
        return resenaService.listarResenas();
    }

    @GetMapping("/{id}")
    public Resena obtenerResenaPorId(@PathVariable Long id) {
        return resenaService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
    }

    // POST: Crear reseña (ESTRICTAMENTE PARA ESTUDIANTES AUTENTICADOS)
    @PostMapping
    public ResponseEntity<?> crearResena(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Resena resena) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario no encontrado en el token."));
            }

            Usuario usuario = userOpt.get();

            // Validar que sea estrictamente un ESTUDIANTE el que deja la reseña
            if (!"ESTUDIANTE".equals(usuario.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Solo los estudiantes pueden dejar reseñas."));
            }

            Resena nuevaResena = resenaService.guardarResena(resena);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaResena);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }

    @PutMapping("/{id}")
    public Resena actualizarResena(@PathVariable Long id, @Valid @RequestBody Resena resenaDetalles) {
        return resenaService.actualizarResena(id, resenaDetalles);
    }

    @DeleteMapping("/{id}")
    public String eliminarResena(@PathVariable Long id) {
        resenaService.eliminarResena(id);
        return "Reseña eliminada exitosamente con ID: " + id;
    }
}