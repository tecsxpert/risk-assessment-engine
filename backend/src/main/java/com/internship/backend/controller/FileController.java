package com.internship.backend.controller;

import com.internship.backend.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @Operation(
            summary = "Upload a file",
            description = "Uploads a file up to 10MB and stores it with UUID filename."
    )
    @ApiResponse(
            responseCode = "201",
            description = "File uploaded successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid file request"
    )
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(
            @Parameter(
                    description = "File to upload",
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestPart("file") MultipartFile file) {

        String fileName = fileStorageService.store(file);

        Map<String, String> response = new LinkedHashMap<>();
        response.put("message", "File uploaded successfully");
        response.put("fileId", fileName);

        return ResponseEntity.status(201).body(response);
    }

    @Operation(
            summary = "Download file by ID",
            description = "Downloads previously uploaded file using stored UUID filename."
    )
    @ApiResponse(
            responseCode = "200",
            description = "File downloaded successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "File not found"
    )
    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> getFile(
            @Parameter(
                    description = "Stored file UUID name",
                    example = "802facb1-cc50-4823-a3da-842731ecf34a.pdf"
            )
            @PathVariable String id) {

        Resource file = fileStorageService.load(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + id + "\"")
                .body(file);
    }
}