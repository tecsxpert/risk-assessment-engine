package com.internship.backend.config;

import com.internship.backend.entity.RiskRecord;
import com.internship.backend.repository.RiskRecordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(RiskRecordRepository repository) {
        return args -> {

            if (repository.count() > 0) {
                return; // prevent duplicate seeding
            }

            String[] statuses = {"OPEN", "IN_PROGRESS", "CLOSED"};
            String[] categories = {"FINANCIAL", "TECHNICAL", "OPERATIONAL", "SECURITY"};

            Random random = new Random();

            for (int i = 1; i <= 30; i++) {
                RiskRecord record = new RiskRecord();

                record.setTitle("Risk #" + i);
                record.setDescription("Demo risk description " + i);

                record.setCategory(categories[random.nextInt(categories.length)]);
                record.setStatus(statuses[random.nextInt(statuses.length)]);

                record.setRiskScore(random.nextInt(101)); // 0–100

                repository.save(record);
            }

            System.out.println("✅ Seeded 30 RiskRecords successfully!");
        };
    }
}
