package com.sistemas.cursoonline.Security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Clave secreta segura para firmar los tokens (mínimo 256 bits)
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expirationTime = 86400000; // 1 día en milisegundos

    // Generar el Token JWT
    public String generarToken(String correo, String rol) {
        return Jwts.builder()
                .setSubject(correo)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact();
    }

    // Extraer el correo del token
    public String extraerCorreo(String token) {
        return obtenerClaims(token).getSubject();
    }

    // Validar si el token es correcto
    public boolean validarToken(String token, String correoUsuario) {
        final String correo = extraerCorreo(token);
        return (correo.equals(correoUsuario) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return obtenerClaims(token).getExpiration().before(new Date());
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}