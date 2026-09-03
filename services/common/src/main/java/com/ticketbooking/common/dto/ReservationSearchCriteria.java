ackage com.ticketbooking.common.dto;
import java.time.LocalDateTime;
public class ReservationSearchCriteria {
    private String userEmail;
    private Long restaurantId;
    private String status;
    private LocalDateTime from;
    private LocalDateTime to;
    public ReservationSearchCriteria() {}
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String e) { this.userEmail = e; }
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long id) { this.restaurantId = id; }
    public String getStatus() { return status; }
    public void setStatus(String s) { this.status = s; }
    public LocalDateTime getFrom() { return from; }
    public void setFrom(LocalDateTime f) { this.from = f; }
    public LocalDateTime getTo() { return to; }
    public void setTo(LocalDateTime t) { this.to = t; }
}
