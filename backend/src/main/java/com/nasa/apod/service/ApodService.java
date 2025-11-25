package com.nasa.apod.service;

import com.nasa.apod.client.NasaApiClient;
import com.nasa.apod.model.ApodResponse;
import com.nasa.apod.utils.DateUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class ApodService {

    private final NasaApiClient nasaApiClient;

    public ApodService(NasaApiClient nasaApiClient) {
        this.nasaApiClient = nasaApiClient;
    }

    @Cacheable(value = "apodCache", key = "#date")
    public ApodResponse getApodByDate(String date) {
        LocalDate parsed = parse(date);
        LocalDate corrected = adjustForUSAToday(parsed);
        validateUSADate(corrected);
        return nasaApiClient.getApod(corrected.toString());
    }

    @Cacheable(value = "apodCache", key = "'today'")
    public ApodResponse getCachedToday() {
        LocalDate indiaToday = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate corrected = adjustForUSAToday(indiaToday);
        validateUSADate(corrected);
        return nasaApiClient.getApod(corrected.toString());
    }

    public List<ApodResponse> getApodRange(String startDate, String endDate) {
        LocalDate startParsed = parse(startDate);
        LocalDate endParsed = parse(endDate);
        LocalDate correctedEnd = adjustForUSAToday(endParsed);
        validateUSADate(startParsed);
        validateUSADate(correctedEnd);
        return List.of(nasaApiClient.getApodRange(startParsed.toString(), correctedEnd.toString()));
    }

    private LocalDate adjustForUSAToday(LocalDate date) {
        LocalDate usaToday = DateUtils.todayUSA();
        LocalDate indiaToday = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        if (date.equals(indiaToday) && !indiaToday.equals(usaToday)) {
            return usaToday;
        }
        return date;
    }

    private LocalDate parse(String date) {
        try {
            return LocalDate.parse(date);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
    }

    private void validateUSADate(LocalDate usaDate) {
        LocalDate usaToday = DateUtils.todayUSA();
        if (usaDate.isAfter(usaToday)) {
            throw new IllegalArgumentException("Date cannot be in the future (NASA time).");
        }
        if (usaDate.isBefore(LocalDate.of(1995, 6, 16))) {
            throw new IllegalArgumentException("APOD not available before 1995-06-16.");
        }
    }
}
