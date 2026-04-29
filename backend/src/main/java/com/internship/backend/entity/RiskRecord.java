package com.internship.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "risk_records")
@EntityListeners(AuditingEntityListener.class)
@Schema(description = "Risk assessment record details")
public class RiskRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(example = "1", description = "Unique record ID")
    private Long id;

    @Column(nullable = false)
    @Schema(example = "Server Downtime", description = "Risk title")
    private String title;

    @Column(length = 1000)
    @Schema(example = "Unexpected outage due to hardware failure", description = "Detailed risk description")
    private String description;

    @Column(nullable = false)
    @Schema(example = "Infrastructure", description = "Risk category")
    private String category;

    @Column(nullable = false)
    @Schema(example = "OPEN", description = "Current risk status")
    private String status;

    @Column(name = "risk_score")
    @Schema(example = "85", description = "Calculated risk score")
    private Integer riskScore;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    @Schema(example = "2026-04-29T10:30:00", description = "Created timestamp")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    @Schema(example = "2026-04-29T12:45:00", description = "Last updated timestamp")
    private LocalDateTime updatedAt;
}