package com.human.festapick.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TourApiStartupSyncRunner {

  private final MainService mainService;

  @Value("${tourapi.sync-on-startup:true}")
  private boolean syncOnStartup;

  @EventListener(ApplicationReadyEvent.class)
  public void syncOnStartup() {
    if (!syncOnStartup) {
      log.info("Startup TourAPI festival sync skipped.");
      return;
    }

    try {
      log.info("Startup TourAPI festival sync started.");
      int syncedCount = mainService.syncTourApiFestivalsFromToday();
      log.info("Startup TourAPI festival sync completed. syncedCount={}", syncedCount);
    } catch (RuntimeException e) {
      log.error("Startup TourAPI festival sync failed.", e);
    }
  }
}
