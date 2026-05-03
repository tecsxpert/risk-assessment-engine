package com.internship.backend.config;

import com.internship.backend.entity.RiskRecord;
import com.internship.backend.repository.RiskRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class DataLoader {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Bean
    CommandLineRunner loadData(RiskRecordRepository repository) {
        return args -> {

            long count = repository.count();

            if (count > 0) {
                logger.info("Data already exists ({} records). Skipping seeding.", count);
                return;
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

            logger.info("Seeded 30 RiskRecords successfully.");
        };
    }
}