package no.poc.web;

import no.poc.model.Poker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.concurrent.ScheduledFuture;

@RestController
public class RestProvider {

    public static final double BLINDS_RAISE = 5.0;
    public static final int UPDATE_RATE_SECS = 2 * 60;


    @Autowired
    private TaskScheduler scheduler;
    @Autowired
    private SimpMessagingTemplate template;

    private ScheduledFuture<?> scheduledFuture;
    private static double blinds = 10.0;
    private static ZonedDateTime date;

    @RequestMapping(path = "/start", method = RequestMethod.GET)
    public int start() {
        if (scheduledFuture == null) {
            scheduledFuture = scheduler.scheduleAtFixedRate(() -> {
                date = ZonedDateTime.now().plusSeconds(UPDATE_RATE_SECS);
                blinds += BLINDS_RAISE;
                template.convertAndSend("/topic/start", createNewPoker());

            }, UPDATE_RATE_SECS * 1000);
        }
        return 1;
    }

    private Poker createNewPoker() {
        return new Poker(blinds, date);
    }

    @RequestMapping(path = "/populate", method = RequestMethod.GET, produces = "application/json")
    public Poker cont() {
        return createNewPoker();
    }

    @RequestMapping(path = "/stop", method = RequestMethod.GET)
    public int stop() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(true);
            scheduledFuture = null;
            template.convertAndSend("/topic/stop", 1);
        }
        return 1;
    }
}
