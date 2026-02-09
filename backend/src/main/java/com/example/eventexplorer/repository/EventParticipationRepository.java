package com.example.eventexplorer.repository;

import com.example.eventexplorer.model.Event;
import com.example.eventexplorer.model.EventParticipation;
import com.example.eventexplorer.model.ParticipationStatus;
import com.example.eventexplorer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventParticipationRepository extends JpaRepository<EventParticipation, Long> {

    long countByEventAndStatus(Event event, ParticipationStatus status);

    Optional<EventParticipation> findByEventAndUser(Event event, User user);

    List<EventParticipation> findByEvent(Event event);
}

