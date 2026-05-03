package com.sanjana.backend.controller;

import com.sanjana.backend.service.AiServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @Autowired
    private AiServiceClient aiServiceClient;

    @GetMapping("/check-ai")
    public String checkAI() {
        return aiServiceClient.health();
    }
}