package com.example.eventexplorer.dto;

import com.example.eventexplorer.model.ParticipationStatus;
import jakarta.validation.constraints.NotNull;

public class ParticipationRequest {

    @NotNull
    private ParticipationStatus status;

    public ParticipationStatus getStatus() {
        return status;
    }

    public void setStatus(ParticipationStatus status) {
        this.status = status;
    }
}

