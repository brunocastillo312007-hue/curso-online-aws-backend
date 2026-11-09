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

import com.sistemas.cursoonline.Entidades.Inscripcion;
import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.InscripcionRepository;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;
import com.sistemas.cursoonline.Service.InscripcionService;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService inscripcionService;

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET: Listar todas las inscripciones (ESTRICTAMENTE SOLO PARA ADMINISTRADORES)
    @GetMapping
    public ResponseEntity<?> listarInscripciones(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }

        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);

            if (userOpt.isEmpty() || !"ADMIN".equals(userOpt.get().getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los administradores pueden ver todas las inscripciones."));
            }

            return ResponseEntity.ok(inscripcionService.listarInscripciones());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }
    
    // GET: Ver únicamente las inscripciones del estudiante autenticado (Automático por Token)
    @GetMapping("/mis-inscripciones")
    public ResponseEntity<?> listarMisInscripciones(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        
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
                        .body(Map.of("error", "Usuario no encontrado."));
            }

            Usuario usuarioAutenticado = userOpt.get();

            if (!"ESTUDIANTE".equals(usuarioAutenticado.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Esta sección es exclusiva para estudiantes."));
            }

            List<Inscripcion> misInscripciones = inscripcionRepository.findByEstudianteId(usuarioAutenticado.getId());
            return ResponseEntity.ok(misInscripciones);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }

    // GET: Ver únicamente las inscripciones de los cursos impartidos por el profesor autenticado
    @GetMapping("/mis-cursos-inscripciones")
    public ResponseEntity<?> listarInscripcionesDeMisCursos(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        
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
                        .body(Map.of("error", "Usuario no encontrado."));
            }

            Usuario usuarioAutenticado = userOpt.get();

            // Validación estricta: Solo profesores
            if (!"PROFESOR".equals(usuarioAutenticado.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Esta sección es exclusiva para profesores."));
            }

            // Busca y retorna las inscripciones asociadas a los cursos del profesor
            List<Inscripcion> inscripcionesProfesor = inscripcionRepository.findByCursoProfesorId(usuarioAutenticado.getId());
            return ResponseEntity.ok(inscripcionesProfesor);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }

    // GET: Obtener inscripción por ID
    @GetMapping("/{id}")
    public Inscripcion obtenerInscripcionPorId(@PathVariable Long id) {
        return inscripcionService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Inscripción no encontrada"));
    }

    // POST: Crear inscripción (Estrictamente prohibido para profesores; solo para estudiantes autenticados)
    // POST: Crear inscripción automática extrayendo el estudiante del token y asociando el curso
    @PostMapping
    public ResponseEntity<?> crearInscripcion(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {
        
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

            Usuario usuarioAutenticado = userOpt.get();

            if (!"ESTUDIANTE".equals(usuarioAutenticado.getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Los profesores no pueden realizar inscripciones."));
            }

            // Extraemos el id del curso enviado desde Angular ({ curso: { id: ... } } o directamente { cursoId: ... })
            Map<String, Object> cursoMap = (Map<String, Object>) body.get("curso");
            if (cursoMap == null || cursoMap.get("id") == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Debe proporcionar el ID del curso."));
            }

            Long cursoId = Long.valueOf(cursoMap.get("id").toString());

            // Construimos la inscripción de forma segura
            Inscripcion nuevaInscripcion = new Inscripcion();
            nuevaInscripcion.setEstudiante(usuarioAutenticado);
            
            com.sistemas.cursoonline.Entidades.Curso cursoObj = new com.sistemas.cursoonline.Entidades.Curso();
            cursoObj.setId(cursoId);
            nuevaInscripcion.setCurso(cursoObj);

            Inscripcion guardada = inscripcionService.guardarInscripcion(nuevaInscripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }

    @PutMapping("/{id}")
    public Inscripcion actualizarInscripcion(@PathVariable Long id, @RequestBody Inscripcion inscripcionDetalles) {
        return inscripcionService.actualizarInscripcion(id, inscripcionDetalles);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarInscripcion(@PathVariable Long id) {
        inscripcionService.eliminarInscripcion(id);
        return ResponseEntity.ok(Map.of("mensaje", "Inscripción eliminada exitosamente con ID: " + id));
    }
}