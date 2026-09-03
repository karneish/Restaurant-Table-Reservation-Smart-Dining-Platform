ackage com.ticketbooking.common.dto;
import java.time.LocalDate;
public class SlotAvailabilityQuery {
    private Long restaurantId; private LocalDate date; private int partySize; private String zone;
    public SlotAvailabilityQuery() {}
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long id) { this.restaurantId = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate d) { this.date = d; }
    public int getPartySize() { return partySize; }
    public void setPartySize(int s) { this.partySize = s; }
    public String getZone() { return zone; }
    public void setZone(String z) { this.zone = z; }
}
