package com.example.eventexplorer.service;

import com.example.eventexplorer.dto.ParticipationCountsDto;
import com.example.eventexplorer.dto.ParticipationRequest;
import com.example.eventexplorer.model.User;
import com.example.eventexplorer.model.Event;
import com.example.eventexplorer.model.EventParticipation;
import com.example.eventexplorer.model.ParticipationStatus;
import com.example.eventexplorer.repository.EventParticipationRepository;
import com.example.eventexplorer.repository.EventRepository;
import com.example.eventexplorer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ParticipationService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventParticipationRepository participationRepository;

    public ParticipationService(EventRepository eventRepository,
                                UserRepository userRepository,
                                EventParticipationRepository participationRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.participationRepository = participationRepository;
    }

    public void markParticipation(Long eventId, String username, ParticipationRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        ParticipationStatus status = request.getStatus();

        EventParticipation participation = participationRepository
                .findByEventAndUser(event, user)
                .orElseGet(() -> {
                    EventParticipation p = new EventParticipation();
                    p.setEvent(event);
                    p.setUser(user);
                    return p;
                });

        participation.setStatus(status);
        participationRepository.save(participation);
    }

    public void removeParticipation(Long eventId, String username){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        participationRepository.findByEventAndUser(event, user)
                .ifPresent(participationRepository::delete);
    }

    @Transactional(readOnly = true)
    public ParticipationCountsDto getParticipationCounts(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        long interested = participationRepository.countByEventAndStatus(event, ParticipationStatus.INTERESTED);
        long going = participationRepository.countByEventAndStatus(event, ParticipationStatus.GOING);

        return new ParticipationCountsDto(interested, going);
    }
}

