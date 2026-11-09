package com.sistemas.cursoonline.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreo(String destinatario, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject("🔑 Código de Verificación - CursoOnline");

            // Diseño HTML moderno y elegante para el correo
            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f6f9;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 30px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                        }
                        .header {
                            background: linear-gradient(135deg, #4f46e5, #3b82f6);
                            color: #ffffff;
                            text-align: center;
                            padding: 25px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            letter-spacing: 0.5px;
                        }
                        .content {
                            padding: 30px;
                            color: #333333;
                            line-height: 1.6;
                        }
                        .content p {
                            margin: 0 0 15px;
                        }
                        .code-box {
                            background-color: #f0f4ff;
                            border: 2px dashed #3b82f6;
                            color: #1e3a8a;
                            font-size: 32px;
                            font-weight: bold;
                            text-align: center;
                            padding: 15px;
                            margin: 25px 0;
                            border-radius: 6px;
                            letter-spacing: 4px;
                        }
                        .footer {
                            background-color: #f9fafb;
                            text-align: center;
                            padding: 15px;
                            font-size: 12px;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>¡Bienvenido a CursoOnline!</h1>
                        </div>
                        <div class="content">
                            <p>Hola,</p>
                            <p>Gracias por registrarte en nuestra plataforma de aprendizaje. Para completar tu registro y activar tu cuenta de forma automática, por favor utiliza el siguiente código de verificación:</p>
                            
                            <div class="code-box">%s</div>
                            
                            <p>Ingresa este código en la aplicación para validar tu correo electrónico.</p>
                            <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2026 CursoOnline. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(codigo);

            helper.setText(htmlContent, true); // El 'true' activa el formato HTML
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error al enviar el correo HTML de verificación: " + e.getMessage());
        }
    }
}