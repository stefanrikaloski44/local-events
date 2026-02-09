package com.example.eventexplorer.dto;

public class ParticipationCountsDto {

    private long interestedCount;
    private long goingCount;

    public ParticipationCountsDto(long interestedCount, long goingCount) {
        this.interestedCount = interestedCount;
        this.goingCount = goingCount;
    }

    public long getInterestedCount() {
        return interestedCount;
    }

    public void setInterestedCount(long interestedCount) {
        this.interestedCount = interestedCount;
    }

    public long getGoingCount() {
        return goingCount;
    }

    public void setGoingCount(long goingCount) {
        this.goingCount = goingCount;
    }
}

