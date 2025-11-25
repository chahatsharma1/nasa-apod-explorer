package com.nasa.apod.service;

import com.nasa.apod.client.NasaApiClient;
import com.nasa.apod.model.ApodResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApodService {
    private final NasaApiClient nasaApiClient;

    public ApodService(NasaApiClient nasaApiClient) {
        this.nasaApiClient = nasaApiClient;
    }

    @Cacheable(value = "apodCache", key = "#date")
    public ApodResponse getApodByDate(String date) {
        validateDate(date);
        return nasaApiClient.getApod(date);
    }

    @Cacheable(value = "apodCache", key = "'today'")
    public ApodResponse getCachedToday() {
        return nasaApiClient.getApod(null);
    }

    public List<ApodResponse> getApodRange(String startDate, String endDate) {
        validateDate(startDate);
        validateDate(endDate);

        return List.of(nasaApiClient.getApodRange(startDate, endDate));
    }

    private void validateDate(String date) {
        try {
            LocalDate parsed = LocalDate.parse(date);

            if (parsed.isAfter(LocalDate.now())) {
                throw new IllegalArgumentException("Date cannot be in the future");
            }

            if (parsed.isBefore(LocalDate.of(1995, 6, 16))) {
                throw new IllegalArgumentException("APOD not available before 1995-06-16");
            }

        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
    }
}
