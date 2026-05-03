package com.sanjana.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String BASE_URL = "http://localhost:5000";

    public String health() {
        try {
            return restTemplate.getForObject(BASE_URL + "/health", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}