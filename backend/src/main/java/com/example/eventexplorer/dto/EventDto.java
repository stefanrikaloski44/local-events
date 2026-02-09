package com.example.eventexplorer.dto;

import com.example.eventexplorer.model.ParticipationStatus;

import java.time.LocalDateTime;

public class EventDto {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    private String category;
    private String imageUrl;
    private long interestedCount;
    private long goingCount;
    private ParticipationStatus myStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public ParticipationStatus getMyStatus() {
        return myStatus;
    }

    public void setMyStatus(ParticipationStatus myStatus) {
        this.myStatus = myStatus;
    }
}

