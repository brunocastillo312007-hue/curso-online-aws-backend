package com.sistemas.cursoonline.Controller;

import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;
import com.sistemas.cursoonline.Service.EmailService;
import com.sistemas.cursoonline.Service.UsuarioService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173") // <-- Agrega esto
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService; // Servicio para enviar los correos

    // GET: Listar usuarios (Protegido: Solo ADMIN puede ver la lista completa)
    @GetMapping
    public ResponseEntity<?> listarUsuarios(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token de autenticación."));
        }
        
        try {
            String token = authHeader.substring(7);
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

            if (usuarioOpt.isEmpty() || !"ADMIN".equals(usuarioOpt.get().getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los administradores pueden listar usuarios."));
            }

            return ResponseEntity.ok(usuarioService.listarUsuarios());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }
    
    // GET: Obtener usuario por ID
    @GetMapping("/{id}")
    public Usuario obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    // POST: Registro de nuevo usuario (Genera código, envía email y deja cuenta PENDIENTE)
    @PostMapping
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario) {
        // Generar un código aleatorio de 6 dígitos
        String codigoAleatorio = String.format("%06d", new Random().nextInt(999999));
        
        usuario.setCodigoVerificacion(codigoAleatorio);
        usuario.setVerificado(false);
        usuario.setEstado(Usuario.EstadoUsuario.PENDIENTE);

        // Guardar usuario en la base de datos
        Usuario nuevoUsuario = usuarioService.guardarUsuario(usuario);

        // Enviar el correo electrónico con el código
        try {
            emailService.enviarCorreo(nuevoUsuario.getCorreo(), codigoAleatorio);
        } catch (Exception e) {
            System.err.println("Error al enviar el correo de verificación: " + e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "mensaje", "Registro exitoso. Se ha enviado un código de verificación a su correo.",
                    "correo", nuevoUsuario.getCorreo()
                ));
    }

    // POST: Verificar cuenta mediante un JSON con correo y código
    @PostMapping("/verificar")
    public ResponseEntity<?> verificarCuenta(@RequestBody Map<String, String> request) {
        String correo = request.get("correo");
        String codigo = request.get("codigo");

        if (correo == null || codigo == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Debe proporcionar el correo y el código en formato JSON."));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado con ese correo."));
        }

        Usuario usuario = usuarioOpt.get();

        // Validar si el código coincide
        if (usuario.getCodigoVerificacion() != null && usuario.getCodigoVerificacion().equals(codigo)) {
            usuario.setVerificado(true);
            usuario.setEstado(Usuario.EstadoUsuario.ESPERANDO_ADMIN);
            usuario.setCodigoVerificacion(null); // Limpiar el código usado
            usuarioRepository.save(usuario);

                return ResponseEntity.ok(Map.of("mensaje", "¡Correo verificado! Su cuenta ahora está pendiente de aprobación por un administrador."));        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Código de verificación incorrecto."));
        }
    }

    // PUT: Actualizar usuario
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioDetalles) {
        return usuarioService.actualizarUsuario(id, usuarioDetalles);
    }

    // DELETE: Eliminar usuario
    @DeleteMapping("/{id}")
    public String eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return "Usuario eliminado exitosamente con ID: " + id;
    }

    // PUT: Actualizar únicamente el rol de un usuario
    @PutMapping("/{id}/rol")
    public ResponseEntity<?> actualizarRolUsuario(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestParam String rol) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token."));
        }

        try {
            String token = authHeader.substring(7);
            String correoAdmin = jwtUtil.extraerCorreo(token);
            Optional<Usuario> adminOpt = usuarioRepository.findByCorreo(correoAdmin);

            if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los administradores pueden cambiar roles."));
            }

            Usuario usuario = usuarioService.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            usuario.setRol(rol);
            usuarioService.guardarUsuario(usuario);

            return ResponseEntity.ok(Map.of("mensaje", "Rol actualizado exitosamente a " + rol));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }

    // PUT: /api/usuarios/{id}/aprobar
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobarCuentaUsuario(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Acceso denegado. No se encontró el token."));
        }

        try {
            String token = authHeader.substring(7);
            String correoAdmin = jwtUtil.extraerCorreo(token);
            Optional<Usuario> adminOpt = usuarioRepository.findByCorreo(correoAdmin);

            if (adminOpt.isEmpty() || !"ADMIN".equals(adminOpt.get().getRol())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Acceso denegado. Solo los administradores pueden aprobar cuentas."));
            }

            Usuario usuario = usuarioService.obtenerPorId(id)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            usuario.setEstado(Usuario.EstadoUsuario.APROBADA);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("mensaje", "¡Cuenta aprobada exitosamente para " + usuario.getNombre() + "!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado."));
        }
    }
}