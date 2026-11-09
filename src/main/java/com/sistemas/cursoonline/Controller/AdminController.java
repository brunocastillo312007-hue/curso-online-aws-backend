package com.sistemas.cursoonline.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Método auxiliar para validar si el token pertenece a un ADMIN
    private boolean validarAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7);
        try {
            String correo = jwtUtil.extraerCorreo(token);
            Optional<Usuario> userOpt = usuarioRepository.findByCorreo(correo);
            if (userOpt.isPresent()) {
                Usuario user = userOpt.get();
                // Validar que sea ADMIN, esté aprobado y verificado
                return "ADMIN".equals(user.getRol()) && 
                       user.getEstado() == Usuario.EstadoUsuario.APROBADA && 
                       user.isVerificado();
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    // 1. Listar usuarios pendientes (Requiere Token de Administrador)
    @GetMapping("/usuarios/pendientes")
    public ResponseEntity<?> listarUsuariosPendientes(@RequestHeader("Authorization") String authHeader) {
        if (!validarAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Acceso denegado. Se requiere rol de Administrador autenticado."));
        }
        List<Usuario> pendientes = usuarioRepository.findByEstado(Usuario.EstadoUsuario.PENDIENTE);
        return ResponseEntity.ok(pendientes);
    }

    // 2. Cambiar estado de usuario mediante JSON (Requiere Token de Administrador)
    @PutMapping("/usuarios/{id}/estado")
    public ResponseEntity<Map<String, Object>> cambiarEstadoUsuario(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        
        Map<String, Object> respuesta = new HashMap<>();

        if (!validarAdmin(authHeader)) {
            respuesta.put("error", "Acceso denegado. No tienes permisos de administrador o tu token es inválido.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String estadoStr = body.get("nuevoEstado");
        if (estadoStr == null) {
            respuesta.put("error", "Debe proporcionar el campo 'nuevoEstado' en el cuerpo de la petición.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        Usuario.EstadoUsuario nuevoEstado;
        try {
            nuevoEstado = Usuario.EstadoUsuario.valueOf(estadoStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            respuesta.put("error", "Estado inválido. Use: PENDIENTE, APROBADA, RECHAZADA, BLOQUEADA.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // Regla de negocio: Si se aprueba, debe estar verificado
        if (nuevoEstado == Usuario.EstadoUsuario.APROBADA && !usuario.isVerificado()) {
            respuesta.put("error", "No se puede aprobar la cuenta porque el usuario aún no ha verificado su cuenta.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        usuario.setEstado(nuevoEstado);
        usuarioRepository.save(usuario);

        respuesta.put("mensaje", "El estado del usuario ha sido actualizado exitosamente a: " + nuevoEstado);
        respuesta.put("usuario", usuario);

        return ResponseEntity.ok(respuesta);
    }

    // 3. Verificar la cuenta de un usuario mediante JSON (Requiere Token de Administrador)
    @PutMapping("/usuarios/{id}/verificar")
    public ResponseEntity<Map<String, Object>> verificarUsuario(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> body) {
        
        Map<String, Object> respuesta = new HashMap<>();

        if (!validarAdmin(authHeader)) {
            respuesta.put("error", "Acceso denegado. No tienes permisos de administrador o tu token es inválido.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Por defecto lo ponemos en true, o leemos si mandan "verificado": true/false en el JSON
        boolean nuevoEstadoVerificacion = true;
        if (body != null && body.containsKey("verificado")) {
            Object val = body.get("verificado");
            if (val instanceof Boolean) {
                nuevoEstadoVerificacion = (Boolean) val;
            } else if (val instanceof String) {
                nuevoEstadoVerificacion = Boolean.parseBoolean((String) val);
            }
        }

        usuario.setVerificado(nuevoEstadoVerificacion);
        usuarioRepository.save(usuario);

        respuesta.put("mensaje", "El estado de verificación del usuario ha sido actualizado a: " + nuevoEstadoVerificacion);
        respuesta.put("usuario", usuario);

        return ResponseEntity.ok(respuesta);
    }

    // Nuevo endpoint o ajuste para listar TODOS los usuarios (no solo pendientes)
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarTodosLosUsuarios(@RequestHeader("Authorization") String authHeader) {
        if (!validarAdmin(authHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Acceso denegado."));
        }
        List<Usuario> todos = usuarioRepository.findAll();
        return ResponseEntity.ok(todos);
    }


    // 4. Cambiar el rol de un usuario (Requiere Token de Administrador)
    @PutMapping("/usuarios/{id}/rol")
    public ResponseEntity<Map<String, Object>> actualizarRolUsuario(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        
        Map<String, Object> respuesta = new HashMap<>();

        if (!validarAdmin(authHeader)) {
            respuesta.put("error", "Acceso denegado. No tienes permisos de administrador.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String nuevoRol = body.get("rol");
        if (nuevoRol == null) {
            respuesta.put("error", "Debe proporcionar el campo 'rol' en el cuerpo de la petición.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        }

        // Actualizamos el rol (asegúrate de que tu entidad Usuario acepte el tipo de dato para el rol, ej: String o Enum)
        usuario.setRol(nuevoRol); // Si usas Enum, conviértelo con Usuario.Rol.valueOf(nuevoRol.toUpperCase())
        usuarioRepository.save(usuario);

        respuesta.put("mensaje", "Rol actualizado exitosamente a: " + nuevoRol);
        respuesta.put("usuario", usuario);

        return ResponseEntity.ok(respuesta);
    }
}