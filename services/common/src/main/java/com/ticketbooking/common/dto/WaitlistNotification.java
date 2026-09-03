ackage com.ticketbooking.common.dto;
public class WaitlistNotification {
    private Long waitlistId;
    private String userEmail;
    private Long restaurantId;
    private String restaurantName;
    private int partySize;
    private String message;
    public WaitlistNotification() {}
    public Long getWaitlistId() { return waitlistId; }
    public void setWaitlistId(Long id) { this.waitlistId = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String e) { this.userEmail = e; }
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long id) { this.restaurantId = id; }
    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String n) { this.restaurantName = n; }
    public int getPartySize() { return partySize; }
    public void setPartySize(int s) { this.partySize = s; }
    public String getMessage() { return message; }
    public void setMessage(String m) { this.message = m; }
}
