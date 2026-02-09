package com.example.eventexplorer.controller;

import com.example.eventexplorer.dto.ParticipationCountsDto;
import com.example.eventexplorer.dto.ParticipationRequest;
import com.example.eventexplorer.service.ParticipationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events/{id}/participation")
@CrossOrigin
public class ParticipationController {

    private final ParticipationService participationService;

    public ParticipationController(ParticipationService participationService) {
        this.participationService = participationService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Void> markParticipation(@PathVariable("id") Long eventId,
                                                  @Valid @RequestBody ParticipationRequest request,
                                                  Authentication authentication) {
        String username = authentication.getName();
        participationService.markParticipation(eventId, username, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<ParticipationCountsDto> getParticipationCounts(@PathVariable("id") Long eventId) {
        return ResponseEntity.ok(participationService.getParticipationCounts(eventId));
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> removeParticipation(@PathVariable("id") Long eventId,
                                                    Authentication authentication) {
        String username = authentication.getName();
        participationService.removeParticipation(eventId, username);
        return ResponseEntity.ok().build();
    }

}

