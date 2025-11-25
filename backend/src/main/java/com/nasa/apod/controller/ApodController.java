package com.nasa.apod.controller;

import com.nasa.apod.model.ApodResponse;
import com.nasa.apod.service.ApodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apod")
@CrossOrigin(origins = "*")
public class ApodController {

    private final ApodService apodService;

    public ApodController(ApodService apodService) {
        this.apodService = apodService;
    }

    @GetMapping("/today")
    public ApodResponse getToday() {
        return apodService.getCachedToday();
    }

    @GetMapping
    public ApodResponse getByDate(@RequestParam String date) {
        return apodService.getApodByDate(date);
    }

    @GetMapping("/range")
    public List<ApodResponse> getRange(@RequestParam String start, @RequestParam String end) {
        return apodService.getApodRange(start, end);
    }
}