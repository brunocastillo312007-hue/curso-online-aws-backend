package com.sistemas.cursoonline.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;
import com.sistemas.cursoonline.Security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://curso-online-steel.vercel.app"})
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint de Inicio de Sesión (Login)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String contrasena = credenciales.get("contrasena");

        Map<String, Object> respuesta = new HashMap<>();

        // 1. Buscar usuario por correo
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);
        if (usuarioOpt.isEmpty()) {
            respuesta.put("error", "Credenciales incorrectas o usuario no encontrado.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
        }

        Usuario usuario = usuarioOpt.get();

        // 2. Verificar contraseña
        if (!passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            respuesta.put("error", "Contraseña incorrecta.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);
        }

        // 3. Validar si la cuenta está verificada
        if (!usuario.isVerificado()) {
            respuesta.put("error", "Su cuenta aún no ha sido verificada.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        // 4. Validar si el estado es APROBADA
        if (usuario.getEstado() != Usuario.EstadoUsuario.APROBADA) {
            respuesta.put("error", "Su cuenta se encuentra en estado: " + usuario.getEstado() + ". Debe ser aprobada por un administrador.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(respuesta);
        }

        // 5. Generar Token JWT si todo es correcto
        String token = jwtUtil.generarToken(usuario.getCorreo(), usuario.getRol());

        respuesta.put("mensaje", "¡Inicio de sesión exitoso!");
        respuesta.put("token", token);
        respuesta.put("rol", usuario.getRol());
        respuesta.put("nombre", usuario.getNombre());

        return ResponseEntity.ok(respuesta);
    }
}