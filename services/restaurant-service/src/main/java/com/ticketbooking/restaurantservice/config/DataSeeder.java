package com.ticketbooking.restaurantservice.config;

import com.ticketbooking.restaurantservice.entity.MenuItem;
import com.ticketbooking.restaurantservice.entity.Restaurant;
import com.ticketbooking.restaurantservice.repository.MenuItemRepository;
import com.ticketbooking.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        if (restaurantRepository.count() > 0) { log.info("Restaurant DB already seeded."); return; }

        Restaurant italian = restaurantRepository.save(Restaurant.builder()
                .name("La Trattoria").cuisine("Italian").city("Mumbai").address("Linking Road, Bandra West")
                .rating(4.6).avgCostPerHead(1200).openHours("12:00 - 23:00")
                .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800")
                .description("Authentic wood-fired pizzas and handmade pasta in a cozy trattoria setting.")
                .features("Rooftop seating, Private dining, Live music, Vegan options").build());

        Restaurant indian = restaurantRepository.save(Restaurant.builder()
                .name("Spice Symphony").cuisine("Indian").city("Delhi").address("Connaught Place")
                .rating(4.5).avgCostPerHead(900).openHours("11:00 - 23:30")
                .imageUrl("https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800")
                .description("Royal North Indian flavours with a modern twist and a live tandoor counter.")
                .features("Family zone, Wheelchair access, Outdoor seating, Jain options").build());

        Restaurant chinese = restaurantRepository.save(Restaurant.builder()
                .name("Dragon Wok").cuisine("Chinese").city("Hyderabad").address("Hitech City Main Road")
                .rating(4.3).avgCostPerHead(700).openHours("12:00 - 22:30")
                .imageUrl("https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800")
                .description("Sizzling wok dishes, dim sums and noodles from the heart of Asia.")
                .features("Window seating, Bar counter, Gluten-free menu, High tea").build());

        seedMenu(italian, List.of(
                menu("Margherita Pizza", "MAINS", 450, "VEG", 0, 25, "Wood-fired, fresh basil"),
                menu("Truffle Risotto", "MAINS", 650, "VEG", 0, 30, "Creamy arborio rice"),
                menu("Chicken Alfredo", "MAINS", 580, "NON_VEG", 0, 25, "Fettuccine in parmesan cream"),
                menu("Bruschetta", "STARTERS", 320, "VEG", 0, 15, "Tomato, garlic, olive oil"),
                menu("Tiramisu", "DESSERTS", 350, "VEG", 0, 10, "Classic Italian dessert"),
                menu("Aperol Spritz", "DRINKS", 420, "VEG", 0, 5, "Refreshing citrus cocktail")));

        seedMenu(indian, List.of(
                menu("Butter Chicken", "MAINS", 480, "NON_VEG", 1, 25, "Tandoori chicken in makhani gravy"),
                menu("Paneer Tikka", "STARTERS", 380, "VEG", 1, 20, "Smoky grilled cottage cheese"),
                menu("Dal Makhani", "MAINS", 340, "VEG", 0, 25, "Slow-cooked black lentils"),
                menu("Biryani", "MAINS", 420, "NON_VEG", 2, 30, "Fragrant basmati layered with spices"),
                menu("Gulab Jamun", "DESSERTS", 180, "VEG", 0, 10, "Warm sweet dumplings"),
                menu("Masala Chai", "DRINKS", 120, "VEG", 0, 5, "Spiced Indian tea")));

        seedMenu(chinese, List.of(
                menu("Dim Sum Platter", "STARTERS", 420, "VEG", 1, 20, "Assorted steamed dumplings"),
                menu("Kung Pao Chicken", "MAINS", 480, "NON_VEG", 2, 20, "Spicy stir-fried chicken"),
                menu("Veg Hakka Noodles", "MAINS", 320, "VEG", 1, 15, "Wok-tossed noodles"),
                menu("Sweet & Sour Prawns", "MAINS", 560, "NON_VEG", 1, 25, "Crispy prawns in tangy sauce"),
                menu("Fried Ice Cream", "DESSERTS", 240, "VEG", 0, 10, "Golden fried vanilla ice cream"),
                menu("Jasmine Tea", "DRINKS", 150, "VEG", 0, 5, "Fragrant loose-leaf tea")));

        log.info("{} restaurants and menus seeded", restaurantRepository.count());
    }

    private void seedMenu(Restaurant r, List<MenuItem> items) {
        items.forEach(i -> i.setRestaurantId(r.getId()));
        menuItemRepository.saveAll(items);
    }

    private MenuItem menu(String name, String category, int price, String tags, int spice, int prep, String desc) {
        return MenuItem.builder().name(name).category(category).price(BigDecimal.valueOf(price))
                .dietaryTags(tags).spiceLevel(spice).prepTimeMinutes(prep).available(true).description(desc).build();
    }
}
