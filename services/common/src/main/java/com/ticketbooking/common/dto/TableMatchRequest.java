ackage com.ticketbooking.common.dto;
public class TableMatchRequest {
    private Long restaurantId; private int partySize; private String zone;
    private boolean wheelchairAccessible; private boolean quietCorner; private String occasion;
    public TableMatchRequest() {}
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long id) { this.restaurantId = id; }
    public int getPartySize() { return partySize; }
    public void setPartySize(int s) { this.partySize = s; }
    public String getZone() { return zone; }
    public void setZone(String z) { this.zone = z; }
    public boolean isWheelchairAccessible() { return wheelchairAccessible; }
    public void setWheelchairAccessible(boolean w) { this.wheelchairAccessible = w; }
    public boolean isQuietCorner() { return quietCorner; }
    public void setQuietCorner(boolean q) { this.quietCorner = q; }
    public String getOccasion() { return occasion; }
    public void setOccasion(String o) { this.occasion = o; }
}
