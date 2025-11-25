package com.nasa.apod.utils;

import java.time.LocalDate;
import java.time.ZoneId;

public class DateUtils {

    private static final ZoneId USA_ET = ZoneId.of("America/New_York");

    public static LocalDate todayUSA() {
        return LocalDate.now(USA_ET);
    }
}