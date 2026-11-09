package com.sistemas.cursoonline.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sistemas.cursoonline.Entidades.Usuario;
import com.sistemas.cursoonline.Repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initAdmin(UsuarioRepository usuarioRepository) {
        return args -> {
            // Verificar si ya existe un admin con este correo
            String correoAdmin = "admin@cursos.com";
            if (usuarioRepository.findByCorreo(correoAdmin).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador General");
                admin.setCorreo(correoAdmin);
                admin.setCedula("0999999999");
                admin.setContrasena(passwordEncoder.encode("AdminPassword123")); // Contraseña fija encriptada
                admin.setRol("ADMIN");
                admin.setEstado(Usuario.EstadoUsuario.APROBADA); // Ya nace aprobado
                admin.setVerificado(true); // Ya nace verificado

                usuarioRepository.save(admin);
                System.out.println(">>> Administrador por defecto creado exitosamente: admin@cursos.com / AdminPassword123");
            }
        };
    }
}