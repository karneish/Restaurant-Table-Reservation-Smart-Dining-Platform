package com.ticketbooking.reservationservice.config;

import com.ticketbooking.reservationservice.entity.OccasionAddOn;
import com.ticketbooking.reservationservice.repository.OccasionAddOnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class OccasionAddOnSeeder implements CommandLineRunner {

    private final OccasionAddOnRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        addOn("Birthday Cake", "Classic chocolate truffle cake with a candle, plated and served at the table.", 349, "🎂", "BIRTHDAY");
        addOn("Anniversary Rose Setup", "Fresh rose petals, a table-side rose and a small candle setup.", 299, "🌹", "ANNIVERSARY");
        addOn("Honeymoon Sparkling Cider", "Chilled sparkling cider toast for two with two glasses.", 399, "🥂", "HONEYMOON");
        addOn("Celebration Cake", "Custom celebration cake with your message written in chocolate.", 449, "🎉", "CELEBRATION");
        addOn("Romantic Candlelight Setup", "Candle lanterns and dimmed-lighting table arrangement for two.", 249, "🕯️", "ANNIVERSARY,HONEYMOON");
        addOn("Bouquet of Fresh Flowers", "A hand-tied bouquet kept fresh at the table for the evening.", 199, "💐", "BIRTHDAY,ANNIVERSARY,HONEYMOON,CELEBRATION");
        addOn("Custom Chocolate Message", "Chef's chocolate writing plate with your own message.", 149, "🍫", "BIRTHDAY,CELEBRATION");
        addOn("Family Sharing Platter", "A large platter of appetisers curated by the chef for the table.", 599, "🍽️", "FAMILY,CELEBRATION");
        addOn("Kids' Fun Pack", "Activity sheet, crayons and a small dessert surprise for kids.", 99, "🧸", "FAMILY");
        addOn("Chef's Table Upgrade", "Move to the chef's counter for a front-row kitchen experience.", 499, "👨‍🍳", "CELEBRATION,BIRTHDAY");

        log.info("Seeded {} occasion add-ons", repository.count());
    }

    private void addOn(String name, String description, int price, String emoji, String occasions) {
        repository.save(OccasionAddOn.builder()
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .emoji(emoji)
                .applicableOccasions(occasions)
                .active(true)
                .build());
    }
}
