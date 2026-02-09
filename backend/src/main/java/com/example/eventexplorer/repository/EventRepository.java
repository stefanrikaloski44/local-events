package com.example.eventexplorer.repository;

import com.example.eventexplorer.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}

