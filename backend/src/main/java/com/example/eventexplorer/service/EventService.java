package com.example.eventexplorer.service;

import com.example.eventexplorer.dto.EventDto;
import com.example.eventexplorer.dto.EventRequest;
import com.example.eventexplorer.model.User;
import com.example.eventexplorer.model.Event;
import com.example.eventexplorer.model.ParticipationStatus;
import com.example.eventexplorer.repository.EventParticipationRepository;
import com.example.eventexplorer.repository.EventRepository;
import com.example.eventexplorer.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipationRepository participationRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        EventParticipationRepository participationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.participationRepository = participationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEvents() {
        return getAllEventsForUser(null);
    }

    @Transactional(readOnly = true)
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        return toDtoWithCountsAndStatus(event, null);
    }

    @Transactional(readOnly = true)
    public List<EventDto> getAllEventsForUser(String username) {
        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username).orElse(null);
        }
        User finalUser = user;
        return eventRepository.findAll().stream()
                .map(event -> toDtoWithCountsAndStatus(event, finalUser))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto getEventByIdForUser(Long id, String username) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username).orElse(null);
        }
        return toDtoWithCountsAndStatus(event, user);
    }

    public EventDto createEvent(EventRequest request) {
        Event event = new Event();
        applyRequest(event, request);
        Event saved = eventRepository.save(event);
        return toDtoWithCountsAndStatus(saved, null);
    }

    public EventDto updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        applyRequest(event, request);
        Event saved = eventRepository.save(event);
        return toDtoWithCountsAndStatus(saved, null);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private void applyRequest(Event event, EventRequest request) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setDate(request.getDate());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setImageUrl(request.getImageUrl());
    }

    private EventDto toDtoWithCountsAndStatus(Event event, User user) {
        long interested = participationRepository.countByEventAndStatus(event, ParticipationStatus.INTERESTED);
        long going = participationRepository.countByEventAndStatus(event, ParticipationStatus.GOING);

        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setDate(event.getDate());
        dto.setLocation(event.getLocation());
        dto.setCategory(event.getCategory());
        dto.setImageUrl(event.getImageUrl());
        dto.setInterestedCount(interested);
        dto.setGoingCount(going);
        if (user != null) {
            participationRepository.findByEventAndUser(event, user)
                    .ifPresent(p -> dto.setMyStatus(p.getStatus()));
        }
        return dto;
    }
}

