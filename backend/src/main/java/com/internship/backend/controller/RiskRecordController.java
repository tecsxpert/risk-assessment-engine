package com.internship.backend.controller;

import com.internship.backend.entity.RiskRecord;
import com.internship.backend.service.RiskRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk-records")
public class RiskRecordController {

    private final RiskRecordService service;

    public RiskRecordController(RiskRecordService service) {
        this.service = service;
    }

    @Operation(
            summary = "Get all risk records",
            description = "Returns paginated list of risk records."
    )
    @ApiResponse(responseCode = "200", description = "Records fetched successfully")
    @GetMapping("/all")
    public ResponseEntity<Page<RiskRecord>> getAllRecords(
            @Parameter(description = "Page number", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size", example = "5")
            @RequestParam(defaultValue = "5") int size) {

        List<RiskRecord> records = service.getAllRecords();

        int start = Math.min(page * size, records.size());
        int end = Math.min(start + size, records.size());

        Page<RiskRecord> result =
                new PageImpl<>(records.subList(start, end));

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Get risk record by ID",
            description = "Returns a single risk record using record ID."
    )
    @ApiResponse(responseCode = "200", description = "Record found")
    @ApiResponse(responseCode = "404", description = "Record not found")
    @GetMapping("/{id}")
    public ResponseEntity<RiskRecord> getRecordById(
            @Parameter(description = "Risk record ID", example = "1")
            @PathVariable Long id) {

        RiskRecord record = service.getRecordById(id);
        return ResponseEntity.ok(record);
    }

    @Operation(
            summary = "Create new risk record",
            description = "Creates and stores a new risk assessment record."
    )
    @ApiResponse(responseCode = "201", description = "Record created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @PostMapping("/create")
    public ResponseEntity<RiskRecord> createRecord(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Risk record request body",
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = RiskRecord.class)
                    )
            )
            @Valid @RequestBody RiskRecord riskRecord) {

        RiskRecord saved = service.saveRecord(riskRecord);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}