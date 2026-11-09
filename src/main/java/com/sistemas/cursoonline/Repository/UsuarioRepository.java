package com.sistemas.cursoonline.Repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistemas.cursoonline.Entidades.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    
    // Método para buscar usuarios por su estado de seguridad
    List<Usuario> findByEstado(Usuario.EstadoUsuario estado);
}