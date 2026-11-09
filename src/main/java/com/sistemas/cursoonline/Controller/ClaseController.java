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

import com.sistemas.cursoonline.Entidades.Clase;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;
import com.sistemas.cursoonline.Service.ClaseService;

@RestController
@RequestMapping("/api/clases")
public class ClaseController {

    @Autowired
    private ClaseService claseService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private boolean esProfesorOAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);
            if (userOpt.isPresent()) {
                String rol = userOpt.get().getRol();
                return "PROFESOR".equals(rol) || "ADMIN".equals(rol);
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    @GetMapping
    public List<Clase> listarClases() {
        return claseService.listarClases();
    }

    @GetMapping("/{id}")
    public Clase obtenerClasePorId(@PathVariable Long id) {
        return claseService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Clase no encontrada"));
    }

    // POST: Crear clase (Solo Profesores/Admins con validación limpia de token)
    @PostMapping
    public ResponseEntity<?> crearClase(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Clase clase) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        if (!esProfesorOAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Solo los profesores pueden crear clases."));
        }

        Clase nuevaClase = claseService.guardarClase(clase);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaClase);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarClase(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id, 
            @RequestBody Clase claseDetalles) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        if (!esProfesorOAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Solo los profesores pueden modificar clases."));
        }

        Clase claseActualizada = claseService.actualizarClase(id, claseDetalles);
        return ResponseEntity.ok(claseActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarClase(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        if (!esProfesorOAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Solo los profesores pueden eliminar clases."));
        }

        claseService.eliminarClase(id);
        return ResponseEntity.ok(Map.of("mensaje", "Clase eliminada exitosamente con ID: " + id));
    }
}