package com.sistemas.cursoonline.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el encriptador de BCrypt

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // Método para Registrar Usuario con Encriptación y Estados de Seguridad
    public Usuario guardarUsuario(Usuario usuario) {
        // 1. Encriptar la contraseña antes de guardarla
        if (usuario.getContrasena() != null && !usuario.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        }

        // 2. Establecer valores obligatorios para el flujo de seguridad solicitado
        usuario.setEstado(Usuario.EstadoUsuario.PENDIENTE);
        usuario.setVerificado(false);

        return usuarioRepository.save(usuario);
    }

    // Actualizar Usuario
    public Usuario actualizarUsuario(Long id, Usuario usuarioDetalles) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado para actualizar"));

        usuarioExistente.setNombre(usuarioDetalles.getNombre());
        usuarioExistente.setCorreo(usuarioDetalles.getCorreo());
        usuarioExistente.setRol(usuarioDetalles.getRol());

        // Si se envía una nueva contraseña al actualizar, también la encriptamos
        if (usuarioDetalles.getContrasena() != null && !usuarioDetalles.getContrasena().isEmpty()) {
            usuarioExistente.setContrasena(passwordEncoder.encode(usuarioDetalles.getContrasena()));
        }

        return usuarioRepository.save(usuarioExistente);
    }

    // Eliminar Usuario
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, el usuario no existe");
        }
        usuarioRepository.deleteById(id);
    }
}