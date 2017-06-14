package no.poc.model;

import java.time.ZonedDateTime;

/**
 * Created by bjursroa on 08.10.2016.
 */
public class Poker {
    private double blind;
    private long nextBlindTime;

    public Poker(double blind, ZonedDateTime date) {
        this.blind = blind;
        this.nextBlindTime = date.toEpochSecond() * 1000;
    }

    public double getBlind() {
        return blind;
    }

    public void setBlind(double blind) {
        this.blind = blind;
    }

    public long getNextBlindTime() {
        return nextBlindTime;
    }

    public void setNextBlindTime(ZonedDateTime nextBlindTime) {
        this.nextBlindTime = nextBlindTime.toEpochSecond() * 1000;
    }
}
