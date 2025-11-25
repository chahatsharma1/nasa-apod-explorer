package com.nasa.apod.client;

import com.nasa.apod.exception.NasaApiException;
import com.nasa.apod.model.ApodResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class NasaApiClient {

    private final WebClient webClient;

    @Value("${NASA_API_KEY}")
    private String apiKey;

    private static final String BASE_URL = "https://api.nasa.gov/planetary/apod";

    public NasaApiClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    public ApodResponse getApod(String usaDate) {
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.queryParam("api_key", apiKey);

                    if (usaDate != null && !usaDate.isBlank()) {
                        uriBuilder.queryParam("date", usaDate);
                    }

                    return uriBuilder.build();}).retrieve().onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new NasaApiException("NASA API Error: " + body))))
                .bodyToMono(ApodResponse.class)
                .block();
    }

    public ApodResponse[] getApodRange(String usaStartDate, String usaEndDate) {

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("api_key", apiKey)
                        .queryParam("start_date", usaStartDate)
                        .queryParam("end_date", usaEndDate)
                        .build()).retrieve().onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        clientResponse -> clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new NasaApiException("NASA API Error: " + body))))
                .bodyToMono(ApodResponse[].class)
                .block();
    }
}