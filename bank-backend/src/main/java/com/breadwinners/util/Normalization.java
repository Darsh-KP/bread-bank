package com.breadwinners.util;

public class Normalization {

    public static String normalizePhone(String phone) {
        String digitsOnly = phone.trim().replaceAll("\\D", "");
        if (digitsOnly.length() == 11 && digitsOnly.startsWith("1")) {
            return digitsOnly.substring(1);
        }
        return digitsOnly;
    }
}
