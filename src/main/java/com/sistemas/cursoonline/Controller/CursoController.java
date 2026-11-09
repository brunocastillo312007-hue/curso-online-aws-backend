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

import com.sistemas.cursoonline.Entidades.Curso;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;
import com.sistemas.cursoonline.Service.CursoService;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

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
    public List<Curso> listarCursos() {
        return cursoService.listarCursos();
    }

    @GetMapping("/{id}")
    public Curso obtenerCursoPorId(@PathVariable Long id) {
        return cursoService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
    }

    // POST: Crear curso (ESTRICTAMENTE PROFESOR O ADMIN con token)
    // POST: Crear curso (ESTRICTAMENTE PROFESOR O ADMIN con token)
    @PostMapping
    public ResponseEntity<?> crearCurso(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Curso curso) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isEmpty() || (!"PROFESOR".equals(userOpt.get().getRol()) && !"ADMIN".equals(userOpt.get().getRol()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los profesores o administradores pueden crear cursos."));
            }

            // Asignamos automáticamente el profesor autenticado al curso
            curso.setProfesor(userOpt.get());

            Curso nuevoCurso = cursoService.guardarCurso(curso);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCurso);

        } catch (Exception e) {
            System.out.println("ERROR JWT DETALLADO: " + e.getMessage()); // <-- Imprime el error real
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCurso(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id, 
            @RequestBody Curso cursoDetalles) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        if (!esProfesorOAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Solo los profesores o administradores pueden modificar cursos."));
        }

        Curso cursoActualizado = cursoService.actualizarCurso(id, cursoDetalles);
        return ResponseEntity.ok(cursoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCurso(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        if (!esProfesorOAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Solo los profesores o administradores pueden eliminar cursos."));
        }

        cursoService.eliminarCurso(id);
        return ResponseEntity.ok(Map.of("mensaje", "Curso eliminado exitosamente con ID: " + id));
    }

    // NUEVO: GET para que el profesor autenticado obtenga solo sus cursos
    @GetMapping("/mis-cursos")
    public ResponseEntity<?> listarMisCursos(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isEmpty() || !"PROFESOR".equals(userOpt.get().getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los profesores pueden ver sus cursos impartidos."));
            }

            List<Curso> misCursos = cursoService.listarCursosPorProfesor(userOpt.get().getId());
            return ResponseEntity.ok(misCursos);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado: " + e.getMessage()));
        }
    }
}