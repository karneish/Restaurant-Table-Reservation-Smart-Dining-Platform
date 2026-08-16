package com.ticketbooking.apigateway.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketbooking.apigateway.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthHeaderFilter implements GlobalFilter, Ordered {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String USER_EMAIL_HEADER = "X-User-Email";
    private static final String USER_ROLE_HEADER = "X-User-Role";

    private final AntPathMatcher matcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        if (isPublic(request)) {
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst(AUTH_HEADER);
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return unauthorized(exchange, "Missing or invalid Authorization header");
        }

        String token = authHeader.substring(BEARER_PREFIX.length());
        if (!jwtTokenProvider.validateToken(token)) {
            return unauthorized(exchange, "Invalid or expired token");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        String role = jwtTokenProvider.getRoleFromToken(token);

        ServerHttpRequest mutated = request.mutate()
                .headers(headers -> {
                    headers.remove(USER_EMAIL_HEADER);
                    headers.remove(USER_ROLE_HEADER);
                    headers.set(USER_EMAIL_HEADER, email);
                    headers.set(USER_ROLE_HEADER, role);
                })
                .build();

        return chain.filter(exchange.mutate().request(mutated).build());
    }

    private boolean isPublic(ServerHttpRequest request) {
        String path = request.getPath().value();
        String method = request.getMethod() != null ? request.getMethod().name() : "GET";

        if ("OPTIONS".equals(method)) return true;
        if (path.startsWith("/actuator") || path.startsWith("/fallback")
                || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")) return true;

        // Auth endpoints (login/register/refresh/otp) are public.
        if (path.startsWith("/api/auth/")) return true;

        // Public read-only browsing.
        if ("GET".equals(method)) {
            if (path.startsWith("/api/restaurants")
                    || path.startsWith("/api/slots")
                    || path.startsWith("/api/areas")
                    || path.startsWith("/api/tables")
                    || path.startsWith("/api/reservations/reservation/")
                    || path.startsWith("/api/reservations/add-ons")
                    || path.equals("/api/reservations/stream")
                    || path.equals("/api/tables/stream")) {
                return true;
            }
        }

        // QR Table Companion: tokenized by the reservation ID in the path, so it stays public.
        if (path.contains("/companion")) return true;

        return false;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        body.put("data", null);
        body.put("timestamp", LocalDateTime.now().toString());
        try {
            byte[] bytes = objectMapper.writeValueAsBytes(body);
            DataBuffer buffer = response.bufferFactory().wrap(bytes);
            return response.writeWith(Mono.just(buffer));
        } catch (Exception e) {
            byte[] bytes = ("{\"success\":false,\"message\":\"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
            return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
        }
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
